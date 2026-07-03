"use client";

import { BottomNav } from "./BottomNav";

interface LayoutShellProps {
  children: React.ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
