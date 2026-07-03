"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { OrigamiIcon } from "@/components/OrigamiIcon";
import { cn, formatTime } from "@/lib/utils";

export default function InboxPage() {
  const { children, getMessages, getUnreadCount } = useAppStore();

  // Build conversation list
  const conversations = children
    .map((child) => {
      const messages = getMessages(child.id);
      const unreadCount = getUnreadCount(child.id);
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
      return { child, lastMessage, unreadCount };
    })
    .filter((c) => c.lastMessage !== null)
    .sort((a, b) => {
      // Unread first
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      // Then by latest message
      return b.lastMessage!.createdAt.localeCompare(a.lastMessage!.createdAt);
    });

  return (
    <AppShell>
      <h2 className="text-3xl font-extrabold text-navy mb-6">Nachrichten</h2>

      {conversations.length === 0 ? (
        <div className="text-center py-16 text-grau">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-30">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <p className="text-sm">Keine Nachrichten</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(({ child, lastMessage, unreadCount }) => (
            <Link
              key={child.id}
              href={`/kind/${child.id}/chat`}
              className={cn(
                "block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow",
                unreadCount > 0 && "ring-1 ring-gelb/20"
              )}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    unreadCount > 0 ? "bg-gelb/15" : "bg-gray-100"
                  )}>
                    <span className={cn(
                      "text-base font-bold",
                      unreadCount > 0 ? "text-navy" : "text-grau"
                    )}>
                      {child.firstName[0]}{child.lastName[0]}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
                    <OrigamiIcon figure={child.figure} size={14} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={cn(
                      "truncate",
                      unreadCount > 0 ? "font-bold text-navy" : "font-medium text-navy"
                    )}>
                      {child.firstName} {child.lastName}
                    </h3>
                    {lastMessage && (
                      <span className="text-xs text-grau shrink-0">
                        {formatTime(lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className={cn(
                        "text-sm truncate flex-1",
                        unreadCount > 0 ? "text-navy font-medium" : "text-grau"
                      )}>
                        {lastMessage.direction === "out" && "Du: "}
                        {lastMessage.body}
                      </p>
                      {unreadCount > 0 && (
                        <div className="w-5 h-5 bg-gelb rounded-full flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-navy">
                            {unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
