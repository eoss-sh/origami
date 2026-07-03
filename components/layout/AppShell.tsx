"use client";

import Image from "next/image";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const today = new Date().toLocaleDateString("de-CH", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="h-screen bg-creme relative overflow-hidden flex flex-col">
      {/* Decorative blob */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gelb/15 pointer-events-none" />
      <div className="absolute top-40 -left-32 w-64 h-64 rounded-full bg-gelb/8 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 pt-6 pb-4 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/fox_logo.svg"
              alt="Origami Logo"
              width={48}
              height={48}
              className="text-gelb"
              style={{ color: "#F9B233" }}
            />
            <h1 className="text-2xl font-extrabold text-navy">Origami</h1>
          </div>
          <span className="text-sm text-grau">{today}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-20 flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full">{children}</div>
      </main>
    </div>
  );
}
