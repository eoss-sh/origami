"use client";

import type { Child } from "@/types";
import { CODE_COLORS } from "@/types";
import { useAppStore } from "@/lib/store";
import { OrigamiIcon } from "./OrigamiIcon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CheckinDialogProps {
  child: Child;
  colorLabel: string;
  figureLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckinDialog({
  child,
  colorLabel,
  figureLabel,
  open,
  onOpenChange,
}: CheckinDialogProps) {
  const attendance = useAppStore((s) => s.getAttendance(child.id));
  const codeColor = attendance?.codeColor
    ? CODE_COLORS.find((c) => c.key === attendance.codeColor)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-white rounded-3xl border-none shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-navy text-center">
            {child.firstName} ist eingecheckt
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-4 space-y-5">
          <div
            className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center"
            style={{
              backgroundColor: codeColor ? `${codeColor.hex}15` : "#F9B23315",
            }}
          >
            <OrigamiIcon
              figure={child.figure}
              color={codeColor?.hex ?? "#F9B233"}
              size={56}
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm text-grau">Abholcode für heute</p>
            <p className="text-2xl font-bold text-navy">
              {colorLabel}er {figureLabel}
            </p>
          </div>

          <p className="text-xs text-grau px-4">
            Der Code wurde den Erziehungsberechtigten automatisch mitgeteilt.
          </p>

          <Button
            onClick={() => onOpenChange(false)}
            className="bg-navy hover:bg-navy/90 text-white font-semibold rounded-xl h-12 px-8"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
