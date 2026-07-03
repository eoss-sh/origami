"use client";

import { useState } from "react";
import type { Child, Symptom } from "@/types";
import { SYMPTOM_LABELS } from "@/types";
import { useAppStore } from "@/lib/store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface KrankmeldungDialogProps {
  child: Child;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SYMPTOMS: Symptom[] = ["fieber", "erbrechen", "durchfall", "ausschlag", "sonstiges"];

type Step = "form" | "confirm" | "done";

export function KrankmeldungDialog({ child, open, onOpenChange }: KrankmeldungDialogProps) {
  const { addSickReport, requestPickup, isCheckedIn } = useAppStore();
  const checkedIn = isCheckedIn(child.id);
  const [step, setStep] = useState<Step>("form");
  const [symptom, setSymptom] = useState<Symptom | null>(null);
  const [temperature, setTemperature] = useState("");
  const [note, setNote] = useState("");

  const handleReset = () => {
    setStep("form");
    setSymptom(null);
    setTemperature("");
    setNote("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) handleReset();
    onOpenChange(open);
  };

  const handleSubmit = () => {
    if (!symptom) return;
    addSickReport(child.id, symptom, temperature || undefined, note || undefined);
    // Kind nicht anwesend → keine Abholung nötig, direkt fertig
    setStep(checkedIn ? "confirm" : "done");
  };

  const handleRequestPickup = () => {
    requestPickup(child.id);
    setStep("done");

    // Simulate parent response after 3 seconds
    setTimeout(() => {
      const store = useAppStore.getState();
      const openPickup = store.incidents.find(
        (i) => i.childId === child.id && i.type === "pickup_request" && i.status === "open"
      );
      if (openPickup) {
        store.updateIncidentStatus(openPickup.id, "confirmed", "14:45", "Mutter");
        store.receiveMessage(
          child.id,
          `Ich bin auf dem Weg! Bin ca. um 14:45 da. – ${child.guardians[0]?.name ?? "Mutter"}`
        );
      }
    }, 3000);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-white border-none shadow-lg px-6 pb-8">
        <SheetHeader className="p-0 pt-2 pb-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <SheetTitle className="text-xl font-bold text-navy text-center">
            Krankmeldung – {child.firstName}
          </SheetTitle>
        </SheetHeader>

        {/* Step: Form */}
        {step === "form" && (
          <div className="py-2 space-y-5">
            <div>
              <label className="text-sm font-medium text-navy mb-2 block">Symptome</label>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSymptom(s)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      symptom === s
                        ? "bg-rot text-white"
                        : "bg-gray-100 text-navy hover:bg-gray-200"
                    )}
                  >
                    {SYMPTOM_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-navy mb-2 block">
                Temperatur <span className="text-grau font-normal">(optional)</span>
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="z.B. 38.5"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="rounded-xl h-12"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-navy mb-2 block">
                Bemerkung <span className="text-grau font-normal">(optional)</span>
              </label>
              <Input
                placeholder="Weitere Infos..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-xl h-12"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!symptom}
              className="w-full bg-rot hover:bg-rot/90 text-white font-semibold rounded-xl h-12"
            >
              Krankmeldung erfassen
            </Button>
          </div>
        )}

        {/* Step: Confirm – ask about pickup */}
        {step === "confirm" && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 mx-auto bg-rot/10 rounded-full flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-bold text-navy">
                Krankmeldung erfasst
              </p>
              <p className="text-sm text-grau">
                Möchtest du die Eltern zur Abholung auffordern?
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => handleOpenChange(false)}
                variant="outline"
                className="rounded-xl h-12"
              >
                Später
              </Button>
              <Button
                onClick={handleRequestPickup}
                className="bg-gelb hover:bg-gelb/90 text-navy font-semibold rounded-xl h-12"
              >
                Abholung anfragen
              </Button>
            </div>
          </div>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 mx-auto bg-rot/10 rounded-full flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-bold text-navy">
                Krankmeldung erfasst
              </p>
              <p className="text-sm text-grau">
                {child.firstName} wurde als krank gemeldet.
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
