"use client";

import { useAppStore } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { KindKarte } from "@/components/KindKarte";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { GroupFilter } from "@/types";

const FILTERS: { key: GroupFilter; label: string }[] = [
  { key: "alle", label: "Alle" },
  { key: "hier", label: "Hier" },
  { key: "fehlt", label: "Fehlt" },
  { key: "allergien", label: "Allergien" },
];

export default function HomePage() {
  const {
    children,
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,
    getFilteredChildren,
    getPresentCount,
  } = useAppStore();

  const filtered = getFilteredChildren();
  const presentCount = getPresentCount();
  const totalCount = children.length;
  const progress = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

  return (
    <AppShell>
      {/* Attendance Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-navy">
            {presentCount} von {totalCount} da
          </h2>
          <span className="text-sm text-grau">
            {totalCount - presentCount} fehlen
          </span>
        </div>
        <div className="w-full h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gruen rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
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

      {/* Filter Chips */}
      <div className="flex gap-2 mb-6">
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
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-grau">
            <p className="text-lg">Keine Kinder gefunden</p>
            <p className="text-sm mt-1">Versuche einen anderen Filter oder Suchbegriff</p>
          </div>
        ) : (
          filtered.map((child) => (
            <KindKarte key={child.id} child={child} />
          ))
        )}
      </div>
    </AppShell>
  );
}
