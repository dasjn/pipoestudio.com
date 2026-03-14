import { useEffect, useRef, useCallback } from 'react';
import { useNavigationStore } from '../store/navigationStore';

export const useWheelNavigation = () => {
  const { navigateNext, navigatePrevious, isTransitioning } = useNavigationStore();
  const lastActionTime = useRef(0);
  const isNavigating = useRef(false);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const hasNavigated = useRef(false);

  const handleNavigation = useCallback((direction: 'next' | 'prev') => {
    const now = Date.now();
    if (now - lastActionTime.current < 800 || isTransitioning || isNavigating.current) {
      return;
    }

    isNavigating.current = true;
    lastActionTime.current = now;
    
    if (direction === 'next') {
      navigateNext();
    } else {
      navigatePrevious();
    }
    
    setTimeout(() => {
      isNavigating.current = false;
    }, 100);
  }, [navigateNext, navigatePrevious, isTransitioning]);

  useEffect(() => {
    // Desktop wheel navigation
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (e.deltaY > 0) {
        handleNavigation('next');
      } else if (e.deltaY < 0) {
        handleNavigation('prev');
      }
    };

    // Check if touch is in UI areas (header, mobile menu, or chat)
    const isInUIArea = (element: HTMLElement): boolean => {
      const header = document.querySelector('header');
      const mobileMenu = document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-50"]');

      return (header && header.contains(element)) ||
             (mobileMenu && mobileMenu.contains(element)) ||
             element.closest('header') !== null ||
             element.closest('[data-no-nav-scroll]') !== null;
    };

    // Mobile touch navigation
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      
      if (isInUIArea(target)) {
        return; // Allow normal UI interaction
      }

      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
      hasNavigated.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      
      if (isInUIArea(target)) {
        return; // Allow normal UI interaction
      }

      e.preventDefault();
      
      if (isTransitioning || isNavigating.current || hasNavigated.current) {
        return;
      }

      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchCurrentY;
      const minSwipeDistance = 80;

      if (Math.abs(deltaY) > minSwipeDistance) {
        hasNavigated.current = true;
        
        if (deltaY > 0) {
          handleNavigation('next');
        } else {
          handleNavigation('prev');
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.changedTouches[0].target as HTMLElement;
      
      if (isInUIArea(target)) {
        return; // Allow normal UI interaction
      }

      e.preventDefault();
      hasNavigated.current = false;
    };

    // Apply selective CSS scroll blocking
    const applyScrollLock = () => {
      // Only apply to main content area, not header
      document.body.style.overscrollBehavior = 'none';
      document.body.style.webkitOverflowScrolling = 'auto';
    };

    const removeScrollLock = () => {
      document.body.style.overscrollBehavior = '';
      document.body.style.webkitOverflowScrolling = '';
    };

    // Apply scroll locks
    applyScrollLock();
    
    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      // Remove event listeners
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      
      // Remove scroll locks
      removeScrollLock();
    };
  }, [handleNavigation, isTransitioning]);
};