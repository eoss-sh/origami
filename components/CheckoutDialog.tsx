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

type Step = "ask" | "verify" | "correct" | "incorrect" | "done";

export function CheckoutDialog({ child, open, onOpenChange }: CheckoutDialogProps) {
  const { getAttendance, checkOut } = useAppStore();
  const attendance = getAttendance(child.id);
  const [step, setStep] = useState<Step>("ask");
  const [pickedUpBy, setPickedUpBy] = useState<"Mutter" | "Vater" | "Andere" | null>(null);
  const [otherName, setOtherName] = useState("");

  const codeColor = attendance?.codeColor
    ? CODE_COLORS.find((c) => c.key === attendance.codeColor)
    : null;
  const figureLabel = FIGURE_LABELS[child.figure];

  const handleReset = () => {
    setStep("ask");
    setPickedUpBy(null);
    setOtherName("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) handleReset();
    onOpenChange(open);
  };

  const handleCheckout = () => {
    if (!pickedUpBy) return;
    if (pickedUpBy === "Andere" && !otherName.trim()) return;
    checkOut(child.id, pickedUpBy, otherName.trim() || null, true);
    setStep("done");
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

        {/* Step: Ask for code first */}
        {step === "ask" && (
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 mx-auto bg-gelb/10 rounded-3xl flex items-center justify-center">
              <OrigamiIcon figure={child.figure} color="#8A8F98" size={48} />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-navy">
                Frage zuerst nach dem Codewort.
              </p>
              <p className="text-sm text-grau">
                Bitte die Abholperson, dir den heutigen Abholcode zu nennen, bevor du ihn hier anzeigst.
              </p>
            </div>
            <Button
              onClick={() => setStep("verify")}
              className="bg-gelb hover:bg-gelb/90 text-navy font-semibold rounded-xl h-12 px-8"
            >
              Code anzeigen
            </Button>
          </div>
        )}

        {/* Step: Verify code */}
        {step === "verify" && codeColor && (
          <div className="text-center py-6 space-y-6">
            <div
              className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: `${codeColor.hex}15` }}
            >
              <OrigamiIcon figure={child.figure} color={codeColor.hex} size={56} />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-navy">
                {codeColor.label}er {figureLabel}
              </p>
              <p className="text-sm text-grau">
                Stimmt der genannte Code überein?
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setStep("correct")}
                className="bg-gruen hover:bg-gruen/90 text-white font-semibold rounded-xl h-12 px-6"
              >
                Code korrekt
              </Button>
              <Button
                onClick={() => setStep("incorrect")}
                variant="outline"
                className="border-rot/30 text-rot hover:bg-rot/5 rounded-xl h-12 px-6"
              >
                Code falsch
              </Button>
            </div>
          </div>
        )}

        {/* Step: Correct – pick up person */}
        {step === "correct" && (
          <div className="py-4 space-y-5">
            <p className="text-center text-navy font-medium">
              Wer holt {child.firstName} ab?
            </p>
            <div className="flex gap-2 justify-center">
              {(["Mutter", "Vater", "Andere"] as const).map((type) => (
                <Button
                  key={type}
                  onClick={() => setPickedUpBy(type)}
                  variant={pickedUpBy === type ? "default" : "outline"}
                  className={
                    pickedUpBy === type
                      ? "bg-navy text-white rounded-xl h-12"
                      : "rounded-xl h-12"
                  }
                >
                  {type}
                </Button>
              ))}
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
              disabled={!pickedUpBy || (pickedUpBy === "Andere" && !otherName.trim())}
              className="w-full bg-gruen hover:bg-gruen/90 text-white font-semibold rounded-xl h-12"
            >
              Auschecken
            </Button>
          </div>
        )}

        {/* Step: Incorrect code */}
        {step === "incorrect" && (
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
                Das Kind kann ohne korrekten Code nicht ausgecheckt werden. Kontaktiere die Eltern im Chat.
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
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 mx-auto bg-gruen/10 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3FA46A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-navy">
                {child.firstName} ist ausgecheckt
              </p>
              <p className="text-sm text-grau">
                Abgeholt von {pickedUpBy}
                {pickedUpBy === "Andere" && otherName ? ` (${otherName})` : ""}
              </p>
            </div>
            <Button
              onClick={() => handleOpenChange(false)}
              className="bg-navy hover:bg-navy/90 text-white rounded-xl h-12 px-8"
            >
              Fertig
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
