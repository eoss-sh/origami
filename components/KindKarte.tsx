"use client";

import type { Child } from "@/types";
import { CODE_COLORS } from "@/types";
import { useAppStore } from "@/lib/store";
import { OrigamiIcon } from "./OrigamiIcon";
import { Badge } from "@/components/ui/badge";
import { cn, formatTime, calculateAge } from "@/lib/utils";

interface KindKarteProps {
  child: Child;
  onSelect: (child: Child) => void;
}

export function KindKarte({ child, onSelect }: KindKarteProps) {
  const { isCheckedIn, getAttendance, getIncidents, getUnreadCount, checkIn } =
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
      // Open drawer for checkout
      onSelect(child);
    } else {
      checkIn(child.id);
      // Open drawer to show the code
      onSelect(child);
    }
  };

  return (
    <div
      onClick={() => onSelect(child)}
      className={cn(
        "bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
        "border border-transparent",
        openSickIncident && "border-rot/30 bg-red-50/30"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
            checkedIn ? "bg-gelb/20" : "bg-gray-100"
          )}
          style={codeColorHex ? { backgroundColor: `${codeColorHex}15` } : undefined}
        >
          <OrigamiIcon
            figure={child.figure}
            color={codeColorHex ?? (checkedIn ? "#F9B233" : "#8A8F98")}
            size={36}
          />
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
            {checkedIn && attendance?.checkinAt && (
              <span className="text-sm text-grau">
                · seit {formatTime(attendance.checkinAt)}
              </span>
            )}
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

        {/* Right side: Status indicators + Toggle */}
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

          {/* Check-in toggle */}
          <button
            onClick={handleToggle}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
              checkedIn
                ? "bg-gruen/10 text-gruen"
                : "bg-gray-100 text-grau hover:bg-gelb/10 hover:text-gelb"
            )}
            aria-label={checkedIn ? "Anwesend" : "Einchecken"}
          >
            {checkedIn ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
