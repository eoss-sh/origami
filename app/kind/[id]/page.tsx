"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { CODE_COLORS, FIGURE_LABELS } from "@/types";
import { OrigamiIcon } from "@/components/OrigamiIcon";
import { CheckoutDialog } from "@/components/CheckoutDialog";
import { CheckinDialog } from "@/components/CheckinDialog";
import { KrankmeldungDialog } from "@/components/KrankmeldungDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatTime, calculateAge } from "@/lib/utils";

export default function KindDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    getChildById,
    getAttendance,
    isCheckedIn,
    getIncidents,
    getJournal,
    getUnreadCount,
    checkIn,
  } = useAppStore();

  const child = getChildById(id);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [checkinCode, setCheckinCode] = useState<{ colorLabel: string; figureLabel: string } | null>(null);
  const [sickOpen, setSickOpen] = useState(false);

  if (!child) {
    return (
      <div className="min-h-screen bg-creme flex items-center justify-center">
        <p className="text-grau">Kind nicht gefunden</p>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-creme">
      {/* Back Navigation */}
      <div className="px-6 pt-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-grau hover:text-navy transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Zurück
          </Link>
        </div>
      </div>

      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 mt-4 shadow-sm">
            <div className="flex items-start gap-5">
              {/* Large Avatar */}
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: codeColor
                    ? `${codeColor.hex}15`
                    : checkedIn
                      ? "#F9B23315"
                      : "#f3f4f6",
                }}
              >
                <OrigamiIcon
                  figure={child.figure}
                  color={codeColor?.hex ?? (checkedIn ? "#F9B233" : "#8A8F98")}
                  size={52}
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-navy">
                    {child.firstName} {child.lastName}
                  </h1>
                  {child.isVisitor && (
                    <Badge variant="outline" className="border-gelb text-gelb">
                      Besuchskind
                    </Badge>
                  )}
                </div>
                <p className="text-grau mt-1">{age} Jahre</p>

                {/* Allergies */}
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

                {/* Pickup Code */}
                {checkedIn && codeColor && (
                  <div className="mt-3 flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${codeColor.hex}20` }}
                    >
                      <OrigamiIcon
                        figure={child.figure}
                        color={codeColor.hex}
                        size={16}
                      />
                    </div>
                    <span className="text-sm font-medium text-navy">
                      Code: {codeColor.label}er {figureLabel}
                    </span>
                  </div>
                )}

                {/* Attendance info */}
                {checkedIn && attendance?.checkinAt && (
                  <p className="text-sm text-grau mt-1">
                    Eingecheckt seit {formatTime(attendance.checkinAt)}
                  </p>
                )}
                {attendance?.checkoutAt && (
                  <p className="text-sm text-gruen mt-1">
                    Ausgecheckt um {formatTime(attendance.checkoutAt)}
                  </p>
                )}
              </div>
            </div>

            {/* Status Badges */}
            {(openSick || openPickup) && (
              <div className="flex gap-2 mt-4 flex-wrap">
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
          <div className="grid grid-cols-3 gap-3 mt-4">
            {/* Krankmeldung */}
            <Button
              onClick={() => setSickOpen(true)}
              variant="outline"
              className="h-auto py-4 rounded-2xl bg-white border-none shadow-sm hover:shadow-md flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 bg-rot/10 rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="text-xs font-medium text-navy">Krankmeldung</span>
            </Button>

            {/* Chat */}
            <Link href={`/kind/${child.id}/chat`} className="block">
              <Button
                variant="outline"
                className="h-auto py-4 rounded-2xl bg-white border-none shadow-sm hover:shadow-md flex flex-col items-center gap-2 w-full relative"
              >
                <div className="w-10 h-10 bg-blau/10 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3498DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-navy">Chat</span>
                {unreadCount > 0 && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-gelb rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-navy">{unreadCount}</span>
                  </div>
                )}
              </Button>
            </Link>

            {/* Checkout */}
            {checkedIn ? (
              <Button
                onClick={() => setCheckoutOpen(true)}
                variant="outline"
                className="h-auto py-4 rounded-2xl bg-white border-none shadow-sm hover:shadow-md flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 bg-gruen/10 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3FA46A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-navy">Auschecken</span>
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const result = checkIn(child.id);
                  if (result) {
                    setCheckinCode(result);
                    setCheckinOpen(true);
                  }
                }}
                variant="outline"
                className="h-auto py-4 rounded-2xl bg-white border-none shadow-sm hover:shadow-md flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 bg-gelb/10 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F9B233" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-navy">Einchecken</span>
              </Button>
            )}
          </div>

          {/* Tagesjournal */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-navy mb-3">Tagesjournal</h2>
            {journal.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center text-grau">
                <p>Noch keine Einträge heute</p>
              </div>
            ) : (
              <div className="space-y-2">
                {journal.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-start gap-3"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                        entry.kind === "checkin" && "bg-gruen/10",
                        entry.kind === "checkout" && "bg-blau/10",
                        entry.kind === "sick" && "bg-rot/10",
                        entry.kind === "pickup_request" && "bg-gelb/10",
                        entry.kind === "pickup_confirmed" && "bg-gruen/10",
                        entry.kind === "code_failed" && "bg-rot/10",
                        entry.kind === "message" && "bg-navy/10"
                      )}
                    >
                      {entry.kind === "message" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14243A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      )}
                      {entry.kind === "checkin" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3FA46A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {entry.kind === "checkout" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3498DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                        </svg>
                      )}
                      {entry.kind === "sick" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      )}
                      {(entry.kind === "pickup_request" || entry.kind === "pickup_confirmed") && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={entry.kind === "pickup_confirmed" ? "#3FA46A" : "#F9B233"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 2L11 13" />
                          <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-navy">{entry.description}</p>
                      <p className="text-xs text-grau mt-0.5">
                        {formatTime(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kontakte */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-navy mb-3">Kontakte</h2>
            <div className="space-y-2">
              {child.guardians.map((g) => (
                <div
                  key={g.id}
                  className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-navy">{g.name}</p>
                    <p className="text-xs text-grau">{g.relation} · {g.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CheckoutDialog
        child={child}
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
      />
      <KrankmeldungDialog
        child={child}
        open={sickOpen}
        onOpenChange={setSickOpen}
      />
      {checkinCode && (
        <CheckinDialog
          child={child}
          colorLabel={checkinCode.colorLabel}
          figureLabel={checkinCode.figureLabel}
          open={checkinOpen}
          onOpenChange={setCheckinOpen}
        />
      )}
    </div>
  );
}
