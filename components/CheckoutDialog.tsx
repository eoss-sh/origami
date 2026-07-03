"use client";

import { useState } from "react";
import type { Child } from "@/types";
import { CODE_COLORS, FIGURE_LABELS } from "@/types";
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

interface CheckoutDialogProps {
  child: Child;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutDialog({ child, open, onOpenChange }: CheckoutDialogProps) {
  const { getAttendance, checkOut } = useAppStore();
  const attendance = getAttendance(child.id);
  const [pickedUpBy, setPickedUpBy] = useState<"Mutter" | "Vater" | "Andere" | null>(null);
  const [otherName, setOtherName] = useState("");
  const [codeOk, setCodeOk] = useState<boolean | null>(null);

  const codeColor = attendance?.codeColor
    ? CODE_COLORS.find((c) => c.key === attendance.codeColor)
    : null;
  const figureLabel = FIGURE_LABELS[child.figure];

  const handleReset = () => {
    setPickedUpBy(null);
    setOtherName("");
    setCodeOk(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) handleReset();
    onOpenChange(open);
  };

  const handleCheckout = () => {
    if (!pickedUpBy || codeOk !== true) return;
    if (pickedUpBy === "Andere" && !otherName.trim()) return;
    checkOut(child.id, pickedUpBy, otherName.trim() || null, true);
    handleOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-white border-none shadow-lg px-6 pb-8">
        <SheetHeader className="p-0 pt-2 pb-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <SheetTitle className="text-xl font-bold text-navy text-center">
            {child.firstName} auschecken
          </SheetTitle>
        </SheetHeader>

        {/* Code incorrect warning */}
        {codeOk === false ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 mx-auto bg-rot/10 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-navy">
                Code stimmt nicht überein
              </p>
              <p className="text-sm text-grau">
                Das Kind kann ohne korrekten Code nicht ausgecheckt werden.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => handleOpenChange(false)}
                variant="outline"
                className="rounded-xl h-12"
              >
                Schliessen
              </Button>
              <Button
                onClick={() => {
                  handleOpenChange(false);
                  window.location.href = `/kind/${child.id}/chat`;
                }}
                className="bg-navy hover:bg-navy/90 text-white rounded-xl h-12"
              >
                Eltern kontaktieren
              </Button>
            </div>
          </div>
        ) : (
          /* Combined: code verify + pickup person */
          <div className="py-4 space-y-5">
            {/* Code display + verify */}
            {codeColor && (
              <div className="flex items-center gap-4 bg-creme rounded-2xl p-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${codeColor.hex}15` }}
                >
                  <OrigamiIcon figure={child.figure} color={codeColor.hex} size={40} />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-navy">
                    {codeColor.label}er {figureLabel}
                  </p>
                  <p className="text-xs text-grau">Code korrekt?</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setCodeOk(true)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      codeOk === true ? "bg-gruen text-white" : "bg-gruen/10 text-gruen hover:bg-gruen/20"
                    }`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCodeOk(false)}
                    className="w-10 h-10 rounded-xl bg-rot/10 text-rot hover:bg-rot/20 flex items-center justify-center transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Pickup person */}
            <div>
              <p className="text-sm font-medium text-navy mb-2">Abgeholt von</p>
              <div className="flex gap-2">
                {(["Mutter", "Vater", "Andere"] as const).map((type) => (
                  <Button
                    key={type}
                    onClick={() => setPickedUpBy(type)}
                    variant={pickedUpBy === type ? "default" : "outline"}
                    className={
                      pickedUpBy === type
                        ? "bg-navy text-white rounded-xl h-11"
                        : "rounded-xl h-11"
                    }
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {pickedUpBy === "Andere" && (
              <Input
                placeholder="Name der Abholperson"
                value={otherName}
                onChange={(e) => setOtherName(e.target.value)}
                className="rounded-xl h-12"
                autoFocus
              />
            )}

            <Button
              onClick={handleCheckout}
              disabled={codeOk !== true || !pickedUpBy || (pickedUpBy === "Andere" && !otherName.trim())}
              className="w-full bg-gruen hover:bg-gruen/90 text-white font-semibold rounded-xl h-12"
            >
              Auschecken
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
