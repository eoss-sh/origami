"use client";

import { useState } from "react";
import type { Child } from "@/types";
import { CODE_COLORS } from "@/types";
import { useAppStore } from "@/lib/store";
import { OrigamiIcon } from "./OrigamiIcon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const addSystemMessage = useAppStore((s) => s.addSystemMessage);
  const codeColor = attendance?.codeColor
    ? CODE_COLORS.find((c) => c.key === attendance.codeColor)
    : null;

  const [note, setNote] = useState("");

  const handleClose = () => {
    if (note.trim()) {
      addSystemMessage(child.id, `Notiz: ${note.trim()}`);
    }
    setNote("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose(); else onOpenChange(true); }}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-white border-none shadow-lg px-6 pb-8">
        <SheetHeader className="p-0 pt-2 pb-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <SheetTitle className="text-xl font-bold text-navy text-center">
            {child.firstName} ist eingecheckt
          </SheetTitle>
        </SheetHeader>

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

          {/* Optional note */}
          <div className="text-left px-2">
            <Input
              placeholder="Notiz hinzufügen (optional)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-xl h-11 bg-creme border-none text-sm placeholder:text-grau/50"
            />
          </div>

          <Button
            onClick={handleClose}
            className="bg-navy hover:bg-navy/90 text-white font-semibold rounded-xl h-12 px-8"
          >
            OK
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
