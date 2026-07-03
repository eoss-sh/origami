"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { useIsDesktop, usePinnedPanel } from "@/lib/hooks";
import { AppShell } from "@/components/layout/AppShell";
import { KindKarte } from "@/components/KindKarte";
import { KindDrawer } from "@/components/KindDrawer";
import { KindDetailPanel } from "@/components/KindDetailPanel";
import { CheckinDialog } from "@/components/CheckinDialog";
import { CheckoutDialog } from "@/components/CheckoutDialog";
import { KrankmeldungDialog } from "@/components/KrankmeldungDialog";
import { AllergienDialog } from "@/components/AllergienDialog";
import { OrigamiIcon } from "@/components/OrigamiIcon";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LayoutGroup, motion } from "motion/react";
import type { Child, GroupFilter } from "@/types";

const FILTERS: { key: GroupFilter; label: string }[] = [
  { key: "alle", label: "Alle" },
  { key: "hier", label: "Hier" },
  { key: "fehlt", label: "Fehlt" },
  { key: "allergien", label: "Allergien" },
];

const SPRING = { type: "spring" as const, stiffness: 200, damping: 25 };

export default function HomePage() {
  const {
    children,
    incidents,
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,
    getFilteredChildren,
    getGroupedChildren,
    getPresentCount,
    getTotalUnreadCount,
    isCheckedIn,
  } = useAppStore();

  const isDesktop = useIsDesktop();
  const { pinned, toggle: togglePinned } = usePinnedPanel();
  const showPanel = isDesktop && pinned;

  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkinChild, setCheckinChild] = useState<Child | null>(null);
  const [checkinCode, setCheckinCode] = useState<{ colorLabel: string; figureLabel: string } | null>(null);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [checkoutChild, setCheckoutChild] = useState<Child | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [sickChild, setSickChild] = useState<Child | null>(null);
  const [sickOpen, setSickOpen] = useState(false);
  const [widgetDrawer, setWidgetDrawer] = useState<"sick" | "allergies" | null>(null);
  const [allergyChild, setAllergyChild] = useState<Child | null>(null);
  const [allergyOpen, setAllergyOpen] = useState(false);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const filtered = getFilteredChildren();
  const groups = getGroupedChildren();
  const shouldGroup = filter === "alle";
  const presentCount = getPresentCount();
  const totalCount = children.length;
  const progress = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;
  const totalUnread = getTotalUnreadCount();

  // Dashboard data
  const openSickIncidents = incidents.filter(
    (i) => i.type === "sick" && i.status !== "closed"
  );
  const sickChildren = openSickIncidents.map((i) =>
    children.find((c) => c.id === i.childId)
  ).filter(Boolean);

  const presentChildren = children.filter((c) => isCheckedIn(c.id));
  const todayAllergies = presentChildren.flatMap((c) =>
    c.allergies.map((a) => ({ child: c, allergy: a }))
  );

  const handleSelectChild = (child: Child) => {
    setSelectedChild(child);
    if (!showPanel) {
      setDrawerOpen(true);
    }
  };

  const handleCheckin = (child: Child, result: { colorLabel: string; figureLabel: string }) => {
    setCheckinChild(child);
    setCheckinCode(result);
    setCheckinOpen(true);
  };

  const handleCheckout = (child: Child) => {
    setCheckoutChild(child);
    setCheckoutOpen(true);
  };

  const handleSick = (child: Child) => {
    setSickChild(child);
    setSickOpen(true);
  };

  const handleAllergies = (child: Child) => {
    setAllergyChild(child);
    setAllergyOpen(true);
  };

  const scrollToChild = useCallback((childId: string) => {
    setTimeout(() => {
      const el = cardRefs.current.get(childId);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 800);
  }, []);

  const handleSickOpenChange = (open: boolean) => {
    setSickOpen(open);
    if (!open && sickChild) {
      scrollToChild(sickChild.id);
    }
  };

  const renderCard = (child: Child) => (
    <motion.div
      key={child.id}
      layoutId={child.id}
      layout
      transition={SPRING}
      ref={(el) => {
        if (el) cardRefs.current.set(child.id, el);
        else cardRefs.current.delete(child.id);
      }}
    >
      <KindKarte
        child={child}
        isSelected={showPanel && selectedChild?.id === child.id}
        onSelect={handleSelectChild}
        onCheckin={handleCheckin}
        onCheckout={handleCheckout}
        onSick={handleSick}
      />
    </motion.div>
  );

  return (
    <AppShell>
      <div className="lg:flex lg:gap-6 h-full">
        {/* Left column: List */}
        <div className="lg:flex-1 lg:min-w-0 lg:overflow-y-auto lg:pr-2 h-full">
          {/* Attendance Summary */}
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-navy mb-3">
              {presentCount} von {totalCount} da
            </h2>
            <div className="w-full h-2.5 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-gelb rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Dashboard Widgets */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Unread Messages */}
            <Link href="/inbox" className="bg-white rounded-xl px-3 py-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
              <div className="w-8 h-8 bg-blau/10 rounded-lg flex items-center justify-center shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3498DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-extrabold text-navy leading-none">{totalUnread}</p>
                <p className="text-[10px] text-grau">Nachrichten</p>
              </div>
            </Link>

            {/* Sick Reports */}
            <button
              onClick={() => sickChildren.length > 0 && setWidgetDrawer("sick")}
              className={cn(
                "bg-white rounded-xl px-3 py-4 shadow-sm flex items-center gap-3 text-left",
                sickChildren.length > 0 && "hover:shadow-md transition-shadow cursor-pointer"
              )}
            >
              <div className="w-8 h-8 bg-rot/10 rounded-lg flex items-center justify-center shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-extrabold text-navy leading-none">{sickChildren.length}</p>
                <p className="text-[10px] text-grau">Krank</p>
              </div>
              {sickChildren.length > 0 && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A8F98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
            </button>

            {/* Today's Allergies */}
            <button
              onClick={() => todayAllergies.length > 0 && setWidgetDrawer("allergies")}
              className={cn(
                "bg-white rounded-xl px-3 py-4 shadow-sm flex items-center gap-3 text-left",
                todayAllergies.length > 0 && "hover:shadow-md transition-shadow cursor-pointer"
              )}
            >
              <div className="w-8 h-8 bg-orange/10 rounded-lg flex items-center justify-center shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-extrabold text-navy leading-none">{todayAllergies.length}</p>
                <p className="text-[10px] text-grau">Allergien</p>
              </div>
              {todayAllergies.length > 0 && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A8F98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Kind suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-none shadow-sm rounded-xl h-12 text-base placeholder:text-grau/60"
            />
          </div>

          {/* Filter Chips + Pin Toggle */}
          <div className="flex items-center gap-2 mb-6">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  filter === f.key
                    ? "bg-navy text-white shadow-sm"
                    : "bg-white text-grau hover:text-navy hover:bg-white/80"
                )}
              >
                {f.label}
                {f.key === "allergien" && filter === "allergien" && (
                  <span className="ml-1.5 text-xs opacity-80">
                    ({filtered.length})
                  </span>
                )}
              </button>
            ))}

          </div>

          {/* Children List */}
          <LayoutGroup>
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-grau">
                <p className="text-lg">Keine Kinder gefunden</p>
                <p className="text-sm mt-1">Versuche einen anderen Filter oder Suchbegriff</p>
              </div>
            ) : shouldGroup ? (
              /* Grouped view */
              <div className="space-y-5 pb-8">
                {groups.map((group) => (
                  <div key={group.key}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "text-xs font-semibold uppercase tracking-wide",
                        group.key === "anwesend" && "text-gruen",
                        group.key === "abwesend" && "text-grau",
                        group.key === "krank" && "text-rot"
                      )}>
                        {group.label}
                      </span>
                      <span className="text-xs text-grau/60">
                        ({group.children.length})
                      </span>
                      <div className="flex-1 h-px bg-grau/10" />
                    </div>
                    <div className="space-y-3">
                      {group.children.map(renderCard)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Flat view */
              <div className="space-y-3 pb-8">
                {filtered.map(renderCard)}
              </div>
            )}
          </LayoutGroup>
        </div>

        {/* Right column: Detail panel (pinned) */}
        {showPanel && (
          <div className="hidden lg:block lg:w-[420px] lg:shrink-0 lg:overflow-y-auto rounded-2xl bg-white shadow-sm">
            {selectedChild ? (
              <KindDetailPanel
                key={selectedChild.id}
                child={selectedChild}
                onCheckin={handleCheckin}
                onCheckout={handleCheckout}
                onSick={handleSick}
                onAllergies={handleAllergies}
                pinned={pinned}
                onTogglePin={togglePinned}
                variant="inverted"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-grau">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-30">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                <p className="text-sm">Kind auswählen</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Drawer (when panel not pinned) */}
      {!showPanel && (
        <KindDrawer
          key={selectedChild?.id}
          child={selectedChild}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onCheckin={handleCheckin}
          onCheckout={handleCheckout}
          onSick={handleSick}
          onAllergies={handleAllergies}
          pinned={pinned}
          onTogglePin={isDesktop ? togglePinned : undefined}
        />
      )}

      {/* Checkin Bottom Drawer */}
      {checkinChild && checkinCode && (
        <CheckinDialog
          child={checkinChild}
          colorLabel={checkinCode.colorLabel}
          figureLabel={checkinCode.figureLabel}
          open={checkinOpen}
          onOpenChange={(open) => {
            setCheckinOpen(open);
            if (!open && checkinChild) {
              setSelectedChild(checkinChild);
              scrollToChild(checkinChild.id);
            }
          }}
        />
      )}

      {/* Checkout Bottom Drawer */}
      {checkoutChild && (
        <CheckoutDialog
          child={checkoutChild}
          open={checkoutOpen}
          onOpenChange={(open) => {
            setCheckoutOpen(open);
            if (!open && checkoutChild) {
              setSelectedChild(checkoutChild);
              scrollToChild(checkoutChild.id);
            }
          }}
        />
      )}

      {/* Krankmeldung Bottom Drawer */}
      {sickChild && (
        <KrankmeldungDialog
          child={sickChild}
          open={sickOpen}
          onOpenChange={handleSickOpenChange}
        />
      )}

      {/* Allergien Bottom Drawer */}
      {allergyChild && (
        <AllergienDialog
          child={allergyChild}
          open={allergyOpen}
          onOpenChange={setAllergyOpen}
        />
      )}

      {/* Widget Detail Drawer */}
      <Sheet open={widgetDrawer !== null} onOpenChange={(open) => !open && setWidgetDrawer(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl bg-white border-none shadow-lg px-6 pb-8 max-h-[70vh] overflow-y-auto">
          <SheetHeader className="p-0 pt-2 pb-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <SheetTitle className="text-xl font-bold text-navy text-center">
              {widgetDrawer === "sick" ? "Krankmeldungen" : "Allergien heute"}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-3">
            {widgetDrawer === "sick" && sickChildren.map((c) => {
              if (!c) return null;
              const incident = openSickIncidents.find((i) => i.childId === c.id);
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 bg-creme rounded-xl p-3 cursor-pointer hover:bg-creme/70 transition-colors"
                  onClick={() => { setWidgetDrawer(null); handleSelectChild(c); }}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-rot/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-navy">{c.firstName[0]}{c.lastName[0]}</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
                      <OrigamiIcon figure={c.figure} size={14} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy">{c.firstName} {c.lastName}</p>
                    {incident && (
                      <p className="text-xs text-rot">
                        {incident.symptom}{incident.temperature && ` · ${incident.temperature}°C`}
                      </p>
                    )}
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8F98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              );
            })}

            {widgetDrawer === "allergies" && todayAllergies.map(({ child: c, allergy: a }) => (
              <div
                key={`${c.id}-${a.id}`}
                className="flex items-center gap-3 bg-creme rounded-xl p-3 cursor-pointer hover:bg-creme/70 transition-colors"
                onClick={() => { setWidgetDrawer(null); handleSelectChild(c); }}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-navy">{c.firstName[0]}{c.lastName[0]}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
                    <OrigamiIcon figure={c.figure} size={14} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy">{c.firstName} {c.lastName}</p>
                  <Badge
                    className={cn(
                      "text-xs mt-0.5",
                      a.severity === "schwer"
                        ? "bg-rot/10 text-rot border-rot/20"
                        : "bg-orange/10 text-orange border-orange/20"
                    )}
                    variant="outline"
                  >
                    {a.severity === "schwer" && "⚠ "}{a.label}
                  </Badge>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8F98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
