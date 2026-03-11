"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { ThinkioLogo } from "@/components/ThinkioLogo";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "What is Thinkio?",
  "How do I upload notes?",
  "What's included in Pro?",
  "How do flashcards work?",
];

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Thinkio's support assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggested, setShowSuggested] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setShowSuggested(false);
    const updated: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(updated);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? data.error ?? "Sorry, something went wrong." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't connect. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-[#111111] border border-[#E2E8F0] dark:border-[#2D3748]">
          {/* Header */}
          <div className="px-4 py-4 flex items-center justify-between bg-[#111111] dark:bg-[#111111]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <ThinkioLogo size={22} iconOnly />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">Thinkio AI ChatBot</p>
                <p className="mt-0.5 text-[10px] text-white/50 font-medium flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-h-[520px] min-h-[300px] bg-white dark:bg-[#111111]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#111111] dark:bg-white">
                    <Sparkles className="h-3 w-3 text-white dark:text-[#111111]" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-sm bg-[#111111] dark:bg-white text-white dark:text-[#111111]"
                      : "rounded-bl-sm bg-[#F1F5F9] dark:bg-[#1A1A1A] text-[#111111] dark:text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#111111] dark:bg-white">
                  <Sparkles className="h-3 w-3 text-white dark:text-[#111111]" />
                </div>
                <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-[#F1F5F9] dark:bg-[#1A1A1A]">
                  <div className="flex gap-1 items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {showSuggested && (
            <div className="px-4 pb-3 pt-1 flex flex-wrap gap-2 bg-white dark:bg-[#111111] border-t border-[#E2E8F0] dark:border-[#2D3748]">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-[#E2E8F0] dark:border-[#2D3748] px-3 py-1 text-xs text-[#475569] dark:text-[#94A3B8] hover:bg-[#111111] hover:text-white hover:border-[#111111] dark:hover:bg-white dark:hover:text-[#111111] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 flex items-center gap-2 bg-white dark:bg-[#111111] border-t border-[#E2E8F0] dark:border-[#2D3748]">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask a question..."
              className="flex-1 text-sm rounded-full px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#2D3748] text-[#111111] dark:text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#111111] dark:focus:border-white"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] dark:bg-white disabled:opacity-30 hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <Send className="h-3.5 w-3.5 text-white dark:text-[#111111]" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] dark:bg-white shadow-lg hover:opacity-90 transition-all"
        aria-label="Open support chat"
      >
        {open ? <X className="h-5 w-5 text-white dark:text-[#111111]" /> : <Sparkles className="h-5 w-5 text-white dark:text-[#111111]" />}
      </button>
    </>
  );
}
