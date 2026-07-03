"use client";

import type { Child } from "@/types";
import { KindDetailPanel } from "./KindDetailPanel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface KindDrawerProps {
  child: Child | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckin?: (child: Child, result: { colorLabel: string; figureLabel: string }) => void;
  onCheckout?: (child: Child) => void;
  onSick?: (child: Child) => void;
  onAllergies?: (child: Child) => void;
  pinned?: boolean;
  onTogglePin?: () => void;
}

export function KindDrawer({ child, open, onOpenChange, onCheckin, onCheckout, onSick, onAllergies, pinned, onTogglePin }: KindDrawerProps) {
  if (!child) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        side="right"
        showOverlay={false}
        showCloseButton={true}
        className="w-full sm:max-w-md bg-creme border-none overflow-y-auto p-0 shadow-2xl"
      >
        <SheetHeader className="p-5 pb-0">
          <SheetTitle className="sr-only">
            {child.firstName} {child.lastName}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Details zu {child.firstName}
          </SheetDescription>
        </SheetHeader>

        <KindDetailPanel
          child={child}
          onClose={() => onOpenChange(false)}
          onCheckin={onCheckin}
          onCheckout={onCheckout}
          onSick={onSick}
          onAllergies={onAllergies}
          pinned={pinned}
          onTogglePin={onTogglePin}
        />
      </SheetContent>
    </Sheet>
  );
}
