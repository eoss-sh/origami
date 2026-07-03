"use client";

import { useState } from "react";
import type { Child } from "@/types";
import { useAppStore } from "@/lib/store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AllergienDialogProps {
  child: Child;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SEVERITY_OPTIONS = [
  { key: "mild" as const, label: "Mild" },
  { key: "schwer" as const, label: "Schwer" },
];

export function AllergienDialog({ child, open, onOpenChange }: AllergienDialogProps) {
  const { addAllergy, removeAllergy } = useAppStore();
  // Re-read child from store to get updated allergies
  const currentChild = useAppStore((s) => s.getChildById(child.id));
  const allergies = currentChild?.allergies ?? [];

  const [label, setLabel] = useState("");
  const [severity, setSeverity] = useState<"mild" | "schwer" | null>(null);

  const handleAdd = () => {
    if (!label.trim() || !severity) return;
    addAllergy(child.id, label.trim(), severity);
    setLabel("");
    setSeverity(null);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-white border-none shadow-lg px-6 pb-8">
        <SheetHeader className="p-0 pt-2 pb-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <SheetTitle className="text-xl font-bold text-navy text-center">
            Allergien – {child.firstName}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-5">
          {/* Existing allergies */}
          {allergies.length > 0 ? (
            <div className="space-y-2">
              {allergies.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between bg-creme rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-xs",
                        a.severity === "schwer"
                          ? "bg-rot/10 text-rot border-rot/20"
                          : "bg-orange/10 text-orange border-orange/20"
                      )}
                      variant="outline"
                    >
                      {a.severity === "schwer" && "⚠ "}
                      {a.label}
                    </Badge>
                    <span className="text-xs text-grau">{a.severity === "schwer" ? "Schwer" : "Mild"}</span>
                  </div>
                  <button
                    onClick={() => removeAllergy(child.id, a.id)}
                    className="text-grau hover:text-rot transition-colors p-1"
                    aria-label={`${a.label} entfernen`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-grau text-center py-4">
              Keine Allergien erfasst
            </p>
          )}

          {/* Add new allergy */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-navy">Neue Allergie erfassen</p>
            <Input
              placeholder="z.B. Erdnüsse, Laktose..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="rounded-xl h-11 bg-creme border-none"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <div className="flex gap-2">
              {SEVERITY_OPTIONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSeverity(s.key)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                    severity === s.key
                      ? s.key === "schwer" ? "bg-rot text-white" : "bg-orange text-white"
                      : "bg-gray-100 text-navy hover:bg-gray-200"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <Button
              onClick={handleAdd}
              disabled={!label.trim() || !severity}
              className="w-full bg-navy hover:bg-navy/90 text-white font-semibold rounded-xl h-12"
            >
              Hinzufügen
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
