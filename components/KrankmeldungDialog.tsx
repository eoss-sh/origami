"use client";

import { useState } from "react";
import Link from "next/link";
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

type Step = "form" | "contact" | "calling" | "done";

export function KrankmeldungDialog({ child, open, onOpenChange }: KrankmeldungDialogProps) {
  const { addSickReport, requestPickup, isCheckedIn } = useAppStore();
  const checkedIn = isCheckedIn(child.id);
  const [step, setStep] = useState<Step>("form");
  const [symptom, setSymptom] = useState<Symptom | null>(null);
  const [temperature, setTemperature] = useState("");
  const [note, setNote] = useState("");
  const [callInfo, setCallInfo] = useState<{ name: string; phone: string } | null>(null);

  const handleReset = () => {
    setStep("form");
    setSymptom(null);
    setTemperature("");
    setNote("");
    setCallInfo(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) handleReset();
    onOpenChange(open);
  };

  const handleSubmit = () => {
    if (!symptom) return;
    addSickReport(child.id, symptom, temperature || undefined, note || undefined);
    setStep(checkedIn ? "contact" : "done");
  };

  const handleCall = (name: string, phone: string) => {
    requestPickup(child.id);
    setCallInfo({ name, phone });
    setStep("calling");

    // Simulate parent response after 3 seconds
    setTimeout(() => {
      const store = useAppStore.getState();
      const openPickup = store.incidents.find(
        (i) => i.childId === child.id && i.type === "pickup_request" && i.status === "open"
      );
      if (openPickup) {
        store.updateIncidentStatus(openPickup.id, "confirmed", "14:45", name);
        store.receiveMessage(
          child.id,
          `Ich bin auf dem Weg! Bin ca. um 14:45 da. – ${name}`
        );
      }
    }, 3000);
  };

  const handleMessage = () => {
    requestPickup(child.id);
    handleOpenChange(false);
    window.location.href = `/kind/${child.id}/chat`;
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-white border-none shadow-lg px-6 pb-8 max-h-[85vh] overflow-y-auto">
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

        {/* Step: Contact – choose guardian and action */}
        {step === "contact" && (
          <div className="py-4 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto bg-rot/10 rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <p className="text-lg font-bold text-navy">Krankmeldung erfasst</p>
              <p className="text-sm text-grau">Eltern kontaktieren?</p>
            </div>

            {/* Guardian list with actions */}
            <div className="space-y-2">
              {child.guardians.map((g) => (
                <div
                  key={g.id}
                  className="bg-creme rounded-xl px-4 py-3 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy">{g.name}</p>
                    <p className="text-[10px] text-grau">{g.relation} · {g.phone}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {/* Anrufen */}
                    <button
                      onClick={() => handleCall(g.name, g.phone)}
                      className="w-9 h-9 rounded-lg bg-gruen/10 flex items-center justify-center text-gruen hover:bg-gruen/20 transition-colors"
                      aria-label={`${g.name} anrufen`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </button>
                    {/* Nachricht */}
                    <button
                      onClick={handleMessage}
                      className="w-9 h-9 rounded-lg bg-blau/10 flex items-center justify-center text-blau hover:bg-blau/20 transition-colors"
                      aria-label={`${g.name} Nachricht senden`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => handleOpenChange(false)}
              variant="outline"
              className="w-full rounded-xl h-12"
            >
              Später
            </Button>
          </div>
        )}

        {/* Step: Calling simulation */}
        {step === "calling" && callInfo && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto bg-gruen/10 rounded-full flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3FA46A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-navy">{callInfo.name}</p>
              <p className="text-sm text-grau">{callInfo.phone}</p>
            </div>
            <p className="text-sm text-gruen font-medium">Anruf wird gestartet...</p>
            <Button
              onClick={() => handleOpenChange(false)}
              className="bg-rot hover:bg-rot/90 text-white font-semibold rounded-xl h-12 px-8"
            >
              Auflegen
            </Button>
          </div>
        )}

        {/* Step: Done (not checked in) */}
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
