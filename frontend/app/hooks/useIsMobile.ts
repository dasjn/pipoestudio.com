import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

export function useIsMobile(breakpoint = 768): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.innerWidth < breakpoint,
    () => false,
  );
}
