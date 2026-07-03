"use client";

import { BottomNav } from "./BottomNav";
import { TabletFrame } from "./TabletFrame";

interface LayoutShellProps {
  children: React.ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <TabletFrame>
      {children}
      <BottomNav />
    </TabletFrame>
  );
}
