"use client";

import type { Child } from "@/types";
import { CODE_COLORS } from "@/types";
import { useAppStore } from "@/lib/store";
import { OrigamiIcon } from "./OrigamiIcon";
import { Badge } from "@/components/ui/badge";
import { cn, formatTime, calculateAge } from "@/lib/utils";

/** Mix a hex color with white to produce an opaque pastel */
function pastel(hex: string, mix = 0.8): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const pr = Math.round(r + (255 - r) * mix);
  const pg = Math.round(g + (255 - g) * mix);
  const pb = Math.round(b + (255 - b) * mix);
  return `rgb(${pr},${pg},${pb})`;
}

interface KindKarteProps {
  child: Child;
  isSelected?: boolean;
  onSelect: (child: Child) => void;
  onCheckin?: (child: Child, result: { colorLabel: string; figureLabel: string }) => void;
  onCheckout?: (child: Child) => void;
  onSick?: (child: Child) => void;
}

export function KindKarte({ child, isSelected, onSelect, onCheckin, onCheckout, onSick }: KindKarteProps) {
  const { isCheckedIn, getAttendance, getIncidents, getUnreadCount, checkIn, removeSickReport } =
    useAppStore();

  const checkedIn = isCheckedIn(child.id);
  const attendance = getAttendance(child.id);
  const incidents = getIncidents(child.id);
  const unreadCount = getUnreadCount(child.id);
  const openSickIncident = incidents.find(
    (i) => i.type === "sick" && i.status !== "closed"
  );
  const pickupRequest = incidents.find(
    (i) => i.type === "pickup_request" && i.status !== "closed"
  );
  const age = calculateAge(child.birthdate);

  const codeColorHex = attendance?.codeColor
    ? CODE_COLORS.find((c) => c.key === attendance.codeColor)?.hex
    : undefined;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (checkedIn) {
      // Open checkout bottom drawer directly
      if (onCheckout) onCheckout(child);
    } else {
      // Check in and show bottom drawer with code
      const result = checkIn(child.id);
      if (result && onCheckin) {
        onCheckin(child, result);
      }
    }
  };

  return (
    <div
      onClick={() => onSelect(child)}
      className={cn(
        "bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer",
        "border-2 border-transparent",
        isSelected && "border-gelb ring-2 ring-gelb/20 shadow-md",
        openSickIncident && !isSelected && "border-rot/30 bg-red-50/30"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Avatar with initials + origami icon badge */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center",
              checkedIn ? "bg-gelb/15" : "bg-gray-100"
            )}
            style={codeColorHex ? { backgroundColor: `${codeColorHex}15` } : undefined}
          >
            <span className={cn(
              "text-lg font-bold",
              checkedIn ? "text-navy" : "text-grau"
            )}>
              {child.firstName[0]}{child.lastName[0]}
            </span>
          </div>
          <div
            className={cn(
              "absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center border-2 border-white",
              !checkedIn && "bg-gray-100"
            )}
            style={codeColorHex ? { backgroundColor: pastel(codeColorHex) } : checkedIn ? { backgroundColor: pastel("#F9B233") } : undefined}
          >
            <OrigamiIcon
              figure={child.figure}
              size={20}
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-navy truncate">
              {child.firstName} {child.lastName}
            </h3>
            {child.isVisitor && (
              <Badge variant="outline" className="text-xs shrink-0 border-gelb text-gelb">
                Besuch
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm text-grau">{age} Jahre</span>
          </div>
          {/* Allergie-Badges – immer sichtbar */}
          {child.allergies.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {child.allergies.map((a) => (
                <Badge
                  key={a.id}
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
              ))}
            </div>
          )}
        </div>

        {/* Right side: Time + Status + Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Status badges */}
          <div className="flex flex-col items-end gap-1">
            {openSickIncident && (
              <Badge className="bg-rot/10 text-rot text-xs border-rot/20" variant="outline">
                Krank
              </Badge>
            )}
            {pickupRequest && (
              <Badge
                className={cn(
                  "text-xs",
                  pickupRequest.status === "confirmed"
                    ? "bg-gruen/10 text-gruen border-gruen/20"
                    : "bg-gelb/10 text-gelb border-gelb/20"
                )}
                variant="outline"
              >
                {pickupRequest.status === "confirmed"
                  ? `Abholung ${pickupRequest.pickupEta ?? ""}`
                  : "Abholung angefragt"}
              </Badge>
            )}
            {unreadCount > 0 && (
              <div className="w-5 h-5 bg-gelb rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-navy">
                  {unreadCount}
                </span>
              </div>
            )}
          </div>

          {/* Check-in time */}
          {checkedIn && attendance?.checkinAt && (
            <span className="text-sm text-grau tabular-nums">
              {formatTime(attendance.checkinAt)}
            </span>
          )}

          {/* Sick report button (only when not checked in) */}
          {!checkedIn && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (openSickIncident) {
                  removeSickReport(child.id);
                } else {
                  if (onSick) onSick(child);
                }
              }}
              className={cn(
                "flex flex-col items-center gap-0.5 transition-colors",
                openSickIncident
                  ? "text-rot"
                  : "text-grau hover:text-rot"
              )}
              aria-label={openSickIncident ? "Krankmeldung aufheben" : "Krank melden"}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                openSickIncident
                  ? "bg-rot/10"
                  : "bg-gray-50 hover:bg-rot/10"
              )}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="text-[9px] font-medium leading-none">
                {openSickIncident ? "Aufheben" : "Krank"}
              </span>
            </button>
          )}

          {/* Check-in / Check-out toggle */}
          <button
            onClick={handleToggle}
            className={cn(
              "flex flex-col items-center gap-0.5 transition-all duration-300",
              checkedIn
                ? "text-gruen"
                : "text-grau hover:text-gelb"
            )}
            aria-label={checkedIn ? "Anwesend" : "Einchecken"}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
              checkedIn
                ? "bg-gruen/10 scale-100"
                : "bg-gray-100 hover:bg-gelb/10 scale-100 hover:scale-105"
            )}>
            <div className="relative w-6 h-6">
              {/* Checkmark (checked in) */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  checkedIn
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-50"
                )}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {/* Arrow in (not checked in) */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  checkedIn
                    ? "opacity-0 rotate-90 scale-50"
                    : "opacity-100 rotate-0 scale-100"
                )}
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            </div>
            <span className="text-[9px] font-medium leading-none">
              {checkedIn ? "Da" : "Anmelden"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
