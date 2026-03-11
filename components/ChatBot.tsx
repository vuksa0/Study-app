"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Sparkles } from "lucide-react";
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
        <div className="fixed bottom-20 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden" style={{ background: "#0f0f1a" }}>
          {/* Header */}
          <div className="relative px-4 py-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #8b5cf6 100%)" }}>
            {/* subtle top glow */}
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 50% -20%, rgba(255,255,255,0.3), transparent 60%)" }} />
            <div className="relative flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <ThinkioLogo size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">Thinkio AI ChatBot</p>
                <p className="mt-0.5 text-[10px] text-white/70 font-medium flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="relative text-white/60 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-h-[520px] min-h-[300px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, #6d28d9, #8b5cf6)" }}>
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-sm text-white"
                      : "rounded-bl-sm text-white/90"
                  }`}
                  style={
                    msg.role === "user"
                      ? { background: "linear-gradient(135deg, #6d28d9, #8b5cf6)" }
                      : { background: "#1e1e2e" }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, #6d28d9, #8b5cf6)" }}>
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ background: "#1e1e2e" }}>
                  <div className="flex gap-1 items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {showSuggested && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-purple-500/40 px-3 py-1 text-xs text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-all"
                  style={{ background: "rgba(109,40,217,0.1)" }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 flex items-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask a question..."
              className="flex-1 text-sm rounded-full px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
              style={{ background: "#1e1e2e", border: "1px solid rgba(139,92,246,0.3)" }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-full disabled:opacity-30 hover:opacity-90 transition-opacity flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6d28d9, #8b5cf6)" }}
            >
              <Send className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-50 flex h-13 w-13 h-12 w-12 items-center justify-center rounded-full shadow-lg hover:opacity-90 transition-all"
        style={{ background: "linear-gradient(135deg, #6d28d9, #8b5cf6)" }}
        aria-label="Open support chat"
      >
        {open ? <X className="h-5 w-5 text-white" /> : <Sparkles className="h-5 w-5 text-white" />}
      </button>
    </>
  );
}
