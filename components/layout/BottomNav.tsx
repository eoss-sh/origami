"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TOP_LEVEL = ["/", "/inbox", "/mehr"];

const TABS = [
  {
    href: "/",
    label: "Gruppe",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/inbox",
    label: "Inbox",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    href: "/mehr",
    label: "Mehr",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="19" r="1" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const totalUnread = useAppStore((s) => s.getTotalUnreadCount());

  if (!TOP_LEVEL.includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto flex items-center justify-around h-16">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-6 py-1.5 rounded-xl transition-colors relative",
                isActive ? "text-gelb" : "text-grau hover:text-navy"
              )}
            >
              <div className="relative">
                {tab.icon}
                {tab.href === "/inbox" && totalUnread > 0 && (
                  <div className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] bg-gelb rounded-full flex items-center justify-center px-1">
                    <span className="text-[10px] font-bold text-navy">
                      {totalUnread}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
