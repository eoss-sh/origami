"use client";

import Link from "next/link";
import type { Child } from "@/types";
import { CODE_COLORS, FIGURE_LABELS } from "@/types";
import { useAppStore } from "@/lib/store";
import { OrigamiIcon } from "./OrigamiIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatTime, calculateAge } from "@/lib/utils";

interface KindDetailPanelProps {
  child: Child;
  onClose?: () => void;
  onCheckin?: (child: Child, result: { colorLabel: string; figureLabel: string }) => void;
  onCheckout?: (child: Child) => void;
  onSick?: (child: Child) => void;
  pinned?: boolean;
  onTogglePin?: () => void;
}

export function KindDetailPanel({ child, onClose, onCheckin, onCheckout, onSick, pinned, onTogglePin }: KindDetailPanelProps) {
  const {
    getAttendance,
    isCheckedIn,
    getIncidents,
    getJournal,
    getUnreadCount,
    checkIn,
  } = useAppStore();

  const attendance = getAttendance(child.id);
  const checkedIn = isCheckedIn(child.id);
  const incidents = getIncidents(child.id);
  const journal = getJournal(child.id);
  const unreadCount = getUnreadCount(child.id);
  const age = calculateAge(child.birthdate);

  const codeColor = attendance?.codeColor
    ? CODE_COLORS.find((c) => c.key === attendance.codeColor)
    : null;
  const figureLabel = FIGURE_LABELS[child.figure];

  const openSick = incidents.find(
    (i) => i.type === "sick" && i.status !== "closed"
  );
  const openPickup = incidents.find(
    (i) => i.type === "pickup_request" && i.status !== "closed"
  );

  const handleCheckin = () => {
    const result = checkIn(child.id);
    if (result && onCheckin) {
      onCheckin(child, result);
    }
  };

  return (
    <div>
      {/* Pin toggle bar */}
      {onTogglePin && (
        <div className="flex justify-end px-3 py-1.5">
          <button
            onClick={onTogglePin}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
              pinned
                ? "text-gelb hover:bg-gelb/10"
                : "text-grau hover:bg-gray-100"
            )}
            aria-label={pinned ? "Detailpanel lösen" : "Detailpanel fixieren"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {pinned ? (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M15 3v18" />
                  <path d="M9 9l3 3-3 3" />
                </>
              ) : (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M15 3v18" />
                </>
              )}
            </svg>
            {pinned ? "Fixiert" : "Fixieren"}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-b-3xl p-5 pt-2 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: codeColor
                  ? `${codeColor.hex}15`
                  : checkedIn
                    ? "#F9B23315"
                    : "#f3f4f6",
              }}
            >
              <span className={cn(
                "text-xl font-bold",
                checkedIn ? "text-navy" : "text-grau"
              )}>
                {child.firstName[0]}{child.lastName[0]}
              </span>
            </div>
            <div className={cn(
              "absolute -bottom-0.5 -right-0.5 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white",
              checkedIn ? "bg-gelb/20" : "bg-gray-100"
            )}>
              <OrigamiIcon
                figure={child.figure}
                size={18}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-navy">
                {child.firstName} {child.lastName}
              </h2>
              {child.isVisitor && (
                <Badge variant="outline" className="border-gelb text-gelb text-xs">
                  Besuch
                </Badge>
              )}
            </div>
            <p className="text-sm text-grau mt-0.5">{age} Jahre</p>

            {child.allergies.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
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

            {checkedIn && codeColor && (
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ backgroundColor: `${codeColor.hex}20` }}
                >
                  <OrigamiIcon figure={child.figure} color={codeColor.hex} size={14} />
                </div>
                <span className="text-sm font-medium text-navy">
                  {codeColor.label}er {figureLabel}
                </span>
              </div>
            )}

            {checkedIn && attendance?.checkinAt && (
              <p className="text-xs text-grau mt-1">
                Eingecheckt seit {formatTime(attendance.checkinAt)}
              </p>
            )}
            {attendance?.checkoutAt && (
              <p className="text-xs text-gruen mt-1">
                Ausgecheckt um {formatTime(attendance.checkoutAt)}
              </p>
            )}
          </div>
        </div>

        {/* Status */}
        {(openSick || openPickup) && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {openSick && (
              <Badge className="bg-rot/10 text-rot border-rot/20" variant="outline">
                Krank – {openSick.symptom}
                {openSick.temperature && `, ${openSick.temperature}°C`}
              </Badge>
            )}
            {openPickup && (
              <Badge
                className={cn(
                  openPickup.status === "confirmed"
                    ? "bg-gruen/10 text-gruen border-gruen/20"
                    : "bg-gelb/10 text-gelb border-gelb/20"
                )}
                variant="outline"
              >
                {openPickup.status === "confirmed"
                  ? `${openPickup.pickupPerson} unterwegs, ca. ${openPickup.pickupEta}`
                  : "Abholung angefragt"}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2 px-5 mt-4">
        <Button
          onClick={() => onSick?.(child)}
          variant="outline"
          className="h-auto py-3 rounded-2xl bg-white border-none shadow-sm hover:shadow-md flex flex-col items-center gap-1.5"
        >
          <div className="w-9 h-9 bg-rot/10 rounded-xl flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span className="text-[11px] font-medium text-navy">Krankmeldung</span>
        </Button>

        <Link
          href={`/kind/${child.id}/chat`}
          onClick={() => onClose?.()}
          className="block"
        >
          <Button
            variant="outline"
            className="h-auto py-3 rounded-2xl bg-white border-none shadow-sm hover:shadow-md flex flex-col items-center gap-1.5 w-full relative"
          >
            <div className="w-9 h-9 bg-blau/10 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3498DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-navy">Chat</span>
            {unreadCount > 0 && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-gelb rounded-full flex items-center justify-center">
                <span className="text-[9px] font-bold text-navy">{unreadCount}</span>
              </div>
            )}
          </Button>
        </Link>

        {checkedIn ? (
          <Button
            onClick={() => onCheckout?.(child)}
            variant="outline"
            className="h-auto py-3 rounded-2xl bg-white border-none shadow-sm hover:shadow-md flex flex-col items-center gap-1.5"
          >
            <div className="w-9 h-9 bg-gruen/10 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3FA46A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-navy">Auschecken</span>
          </Button>
        ) : (
          <Button
            onClick={handleCheckin}
            variant="outline"
            className="h-auto py-3 rounded-2xl bg-white border-none shadow-sm hover:shadow-md flex flex-col items-center gap-1.5"
          >
            <div className="w-9 h-9 bg-gelb/10 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9B233" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-navy">Einchecken</span>
          </Button>
        )}
      </div>

      {/* Journal */}
      <div className="px-5 mt-5">
        <h3 className="text-sm font-semibold text-navy mb-2">Tagesjournal</h3>
        {journal.length === 0 ? (
          <p className="text-xs text-grau bg-white rounded-xl p-3 shadow-sm text-center">
            Noch keine Einträge heute
          </p>
        ) : (
          <div className="space-y-1.5">
            {journal.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-xl px-3 py-2 shadow-sm flex items-start gap-2"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5",
                    entry.kind === "checkin" && "bg-gruen/10",
                    entry.kind === "checkout" && "bg-blau/10",
                    entry.kind === "sick" && "bg-rot/10",
                    entry.kind === "pickup_request" && "bg-gelb/10",
                    entry.kind === "pickup_confirmed" && "bg-gruen/10"
                  )}
                >
                  {entry.kind === "checkin" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3FA46A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {entry.kind === "checkout" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3498DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                    </svg>
                  )}
                  {entry.kind === "sick" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  )}
                  {(entry.kind === "pickup_request" || entry.kind === "pickup_confirmed") && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={entry.kind === "pickup_confirmed" ? "#3FA46A" : "#F9B233"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13" />
                      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-navy">{entry.description}</p>
                  <p className="text-[10px] text-grau mt-0.5">
                    {formatTime(entry.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Kontakte */}
      <div className="px-5 mt-5">
        <h3 className="text-sm font-semibold text-navy mb-2">Kontakte</h3>
        <div className="space-y-1.5">
          {child.guardians.map((g) => (
            <div
              key={g.id}
              className="bg-white rounded-xl px-3 py-2 shadow-sm"
            >
              <p className="text-xs font-medium text-navy">{g.name}</p>
              <p className="text-[10px] text-grau">{g.relation} · {g.phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Link to full detail page */}
      <div className="px-5 mt-5 pb-8">
        <Link
          href={`/kind/${child.id}`}
          onClick={() => onClose?.()}
        >
          <Button
            variant="outline"
            className="w-full rounded-xl h-11 border-navy/10 text-navy hover:bg-navy/5"
          >
            Vollständige Detailansicht
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
}
