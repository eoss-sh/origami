"use client";

import { useAppStore } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";

const SETTINGS = [
  {
    label: "Gruppenprofil",
    description: "Name, Betreuungspersonen, Öffnungszeiten",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Benachrichtigungen",
    description: "Push-Nachrichten und Töne",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    label: "Hilfe & Support",
    description: "FAQ, Kontakt, Anleitungen",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    label: "Abmelden",
    description: "Aus der App ausloggen",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
  },
];

export default function MehrPage() {
  const group = useAppStore((s) => s.group);

  return (
    <AppShell>
      <h2 className="text-3xl font-extrabold text-navy mb-6">Mehr</h2>

      {/* Group info card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gelb/15 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-gelb">
              {group.name[0]}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy">Gruppe {group.name}</h3>
            <p className="text-sm text-grau">Kita Origami</p>
          </div>
        </div>
      </div>

      {/* Settings list */}
      <div className="space-y-2">
        {SETTINGS.map((item) => (
          <button
            key={item.label}
            className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 text-left"
          >
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-grau shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-navy">{item.label}</p>
              <p className="text-xs text-grau">{item.description}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8F98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>
    </AppShell>
  );
}
