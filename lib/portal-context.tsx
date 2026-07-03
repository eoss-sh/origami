"use client";

import { createContext, useContext, useRef, type RefObject } from "react";

const PortalContainerContext = createContext<RefObject<HTMLElement | null> | null>(null);

export function PortalContainerProvider({
  containerRef,
  children,
}: {
  containerRef: RefObject<HTMLElement | null>;
  children: React.ReactNode;
}) {
  return (
    <PortalContainerContext.Provider value={containerRef}>
      {children}
    </PortalContainerContext.Provider>
  );
}

export function usePortalContainer(): HTMLElement | undefined {
  const ref = useContext(PortalContainerContext);
  return ref?.current ?? undefined;
}
