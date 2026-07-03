"use client";

import { useAppStore } from "@/lib/store";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const group = useAppStore((s) => s.group);

  const today = new Date().toLocaleDateString("de-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-creme">
      {/* Decorative wave */}
      <div className="absolute top-0 left-0 right-0 h-48 overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1440 200"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 C360,180 720,60 1080,120 C1260,150 1380,100 1440,120 L1440,200 L0,200 Z"
            fill="#F9B233"
            fillOpacity="0.08"
          />
          <path
            d="M0,140 C240,100 480,180 720,140 C960,100 1200,160 1440,140 L1440,200 L0,200 Z"
            fill="#F9B233"
            fillOpacity="0.05"
          />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 pt-6 pb-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gelb rounded-xl flex items-center justify-center">
                <span className="text-navy font-bold text-lg">O</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy">
                  Gruppe {group.name}
                </h1>
                <p className="text-sm text-grau">{today}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-8">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
