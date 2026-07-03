"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { OrigamiIcon } from "@/components/OrigamiIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatTime } from "@/lib/utils";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    getChildById,
    getMessages,
    sendMessage,
    receiveMessage,
    markMessagesRead,
  } = useAppStore();

  const child = getChildById(id);
  const messages = getMessages(id);
  const [input, setInput] = useState("");
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [testInput, setTestInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mark messages as read when viewing
  useEffect(() => {
    markMessagesRead(id);
  }, [id, messages.length, markMessagesRead]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  if (!child) {
    return (
      <div className="min-h-screen bg-creme flex items-center justify-center">
        <p className="text-grau">Kind nicht gefunden</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(id, input.trim());
    setInput("");
  };

  const handleTestSend = () => {
    if (!testInput.trim()) return;
    receiveMessage(id, testInput.trim());
    setTestInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTestKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTestSend();
    }
  };

  // Toggle test panel with Ctrl+Shift+T
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
        e.preventDefault();
        setShowTestPanel((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-creme">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 shrink-0">
        <Link
          href={`/kind/${child.id}`}
          className="p-2 -ml-2 text-grau hover:text-navy transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div className="w-10 h-10 bg-gelb/10 rounded-xl flex items-center justify-center">
          <OrigamiIcon figure={child.figure} color="#F9B233" size={28} />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-navy">
            Chat – {child.firstName} {child.lastName}
          </h1>
          <p className="text-xs text-grau">
            {child.guardians.map((g) => g.name).join(", ")}
          </p>
        </div>
        {/* Hidden test panel toggle hint */}
        <button
          onClick={() => setShowTestPanel((prev) => !prev)}
          className="p-2 text-grau/30 hover:text-grau transition-colors"
          title="Testpanel (Ctrl+Shift+T)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.direction === "out" && "justify-end",
              msg.direction === "in" && "justify-start",
              msg.direction === "system" && "justify-center"
            )}
          >
            {msg.direction === "system" ? (
              <div className="bg-navy/5 rounded-xl px-4 py-2 max-w-[80%]">
                <p className="text-xs text-grau text-center">{msg.body}</p>
                <p className="text-[10px] text-grau/60 text-center mt-1">
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            ) : (
              <div
                className={cn(
                  "rounded-2xl px-4 py-2.5 max-w-[80%] shadow-sm",
                  msg.direction === "out"
                    ? "bg-gelb/20 text-navy rounded-br-md"
                    : "bg-white text-navy rounded-bl-md"
                )}
              >
                <p className="text-sm">{msg.body}</p>
                <p
                  className={cn(
                    "text-[10px] mt-1",
                    msg.direction === "out" ? "text-navy/40 text-right" : "text-grau/60"
                  )}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Test Panel */}
      {showTestPanel && (
        <div className="bg-navy/5 border-t border-navy/10 px-4 py-3 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-grau">
              Testpanel – Elternnachricht simulieren
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              onKeyDown={handleTestKeyDown}
              placeholder="Elternnachricht eingeben..."
              className="rounded-xl h-10 bg-white text-sm"
            />
            <Button
              onClick={handleTestSend}
              size="sm"
              className="bg-blau hover:bg-blau/90 text-white rounded-xl h-10 px-4"
            >
              Senden
            </Button>
          </div>
          <div className="flex gap-1 mt-2 flex-wrap">
            {[
              "Ich bin auf dem Weg!",
              "Bin in 15 Minuten da.",
              "Kann heute leider nicht, Vater kommt.",
              "Danke für die Info!",
            ].map((quick) => (
              <button
                key={quick}
                onClick={() => receiveMessage(id, quick)}
                className="text-xs bg-white px-2.5 py-1.5 rounded-lg text-navy hover:bg-white/80 transition-colors"
              >
                {quick}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 shrink-0">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nachricht schreiben..."
            className="rounded-xl h-12 border-none bg-gray-50 text-base"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gelb hover:bg-gelb/90 text-navy rounded-xl h-12 px-5 shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
