"use client";

import { useRef } from "react";
import { useIsDesktop } from "@/lib/hooks";
import { PortalContainerProvider } from "@/lib/portal-context";

interface TabletFrameProps {
  children: React.ReactNode;
}

export function TabletFrame({ children }: TabletFrameProps) {
  const isLargeScreen = useIsDesktop(1200);
  const screenRef = useRef<HTMLDivElement>(null);

  if (!isLargeScreen) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-[#1a1a2e] flex items-center justify-center p-8">
      {/* Tablet device frame */}
      <div className="relative w-full max-w-[1024px] h-full max-h-[768px]">
        {/* Outer bezel */}
        <div className="absolute inset-0 bg-[#2d2d3d] rounded-[2.5rem] shadow-2xl shadow-black/40" />

        {/* Inner bezel border */}
        <div className="absolute inset-[3px] bg-[#3a3a4a] rounded-[2.3rem]" />

        {/* Camera dot */}
        <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#1a1a2e] z-10" />

        {/* Screen area */}
        <div
          ref={screenRef}
          className="absolute inset-[12px] top-[12px] rounded-[2rem] overflow-hidden bg-creme"
          style={{ transform: "scale(1)" }}
        >
          <div className="w-full h-full overflow-auto relative">
            <PortalContainerProvider containerRef={screenRef}>
              {children}
            </PortalContainerProvider>
          </div>
        </div>
      </div>

      {/* Label */}
      <p className="absolute bottom-4 text-white/20 text-xs tracking-widest uppercase">
        Origami — Tablet Prototyp
      </p>
    </div>
  );
}
