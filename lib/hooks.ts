import { useState, useEffect, useCallback } from "react";

export function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${breakpoint}px)`);
    setIsDesktop(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return isDesktop;
}

export function usePinnedPanel() {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("origami-panel-pinned");
    if (stored === "true") setPinned(true);
  }, []);

  const toggle = useCallback(() => {
    setPinned((prev) => {
      const next = !prev;
      localStorage.setItem("origami-panel-pinned", String(next));
      return next;
    });
  }, []);

  return { pinned, toggle };
}
