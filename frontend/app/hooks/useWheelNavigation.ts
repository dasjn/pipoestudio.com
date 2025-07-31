import { useEffect, useRef } from 'react';
import { useNavigationStore } from '../store/navigationStore';

export const useWheelNavigation = () => {
  const { navigateNext, navigatePrevious, isTransitioning } = useNavigationStore();
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastWheelTime = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent default scroll behavior during transitions
      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      const now = Date.now();
      const timeSinceLastWheel = now - lastWheelTime.current;

      // Debounce wheel events (minimum 800ms between navigations)
      if (timeSinceLastWheel < 800) {
        e.preventDefault();
        return;
      }

      // Clear existing timeout
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }

      // Set timeout to handle wheel event
      wheelTimeoutRef.current = setTimeout(() => {
        if (e.deltaY > 0) {
          // Scrolling down - next section
          navigateNext();
        } else if (e.deltaY < 0) {
          // Scrolling up - previous section
          navigatePrevious();
        }
        lastWheelTime.current = now;
      }, 50);

      // Prevent default scroll behavior
      e.preventDefault();
    };

    const handleScrollLock = (e: Event) => {
      if (isTransitioning) {
        e.preventDefault();
      }
    };

    // Add wheel event listener
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Lock scroll during transitions
    window.addEventListener('scroll', handleScrollLock, { passive: false });
    window.addEventListener('touchmove', handleScrollLock, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScrollLock);
      window.removeEventListener('touchmove', handleScrollLock);
      
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, [navigateNext, navigatePrevious, isTransitioning]);
};