"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Bot, Trash2, BookOpen } from "lucide-react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { ThinkioLogo } from "@/components/ThinkioLogo";
import { UserAvatar } from "@/components/UserAvatar";
import { usePathname } from "next/navigation";
import {
  BookOpen as BookOpenIcon, Upload, Library, TrendingUp, Settings,
} from "lucide-react";
import { MathText } from "@/components/ui/math-text";

const SUBJECTS = [
  { id: "all",              name: "All Subjects"    },
  { id: "mathematics",      name: "Mathematics"     },
  { id: "physics",          name: "Physics"         },
  { id: "chemistry",        name: "Chemistry"       },
  { id: "biology",          name: "Biology"         },
  { id: "history",          name: "History"         },
  { id: "geography",        name: "Geography"       },
  { id: "english",          name: "English"         },
  { id: "computer-science", name: "Computer Science"},
  { id: "economics",        name: "Economics"       },
  { id: "philosophy",       name: "Philosophy"      },
];

const NAV = [
  { label: "Subjects",  href: "/dashboard",  icon: BookOpenIcon },
  { label: "Upload",    href: "/upload",      icon: Upload      },
  { label: "History",   href: "/library",     icon: Library     },
  { label: "Progress",  href: "/progress",    icon: TrendingUp  },
  { label: "Settings",  href: "/subscription",icon: Settings    },
];

const SUGGESTIONS = [
  "Explain the Pythagorean theorem with examples",
  "How does photosynthesis work?",
  "Summarize the causes of World War I",
  "What is the difference between mitosis and meiosis?",
  "Help me understand Newton's laws of motion",
  "Explain supply and demand with a real example",
];

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  error?: boolean;
};

function formatMessage(text: string) {
  // Split on double newlines for paragraphs
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map((para, pi) => {
    const lines = para.split("\n");
    return (
      <div key={pi} className={pi > 0 ? "mt-3" : ""}>
        {lines.map((line, li) => {
          // Bullet points
          if (line.match(/^[\-\*•]\s/)) {
            return (
              <div key={li} className="flex gap-2 items-start mt-1">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#94A3B8] shrink-0" />
                <MathText className="text-sm leading-relaxed">{line.replace(/^[\-\*•]\s/, "")}</MathText>
              </div>
            );
          }
          // Numbered list
          if (line.match(/^\d+\.\s/)) {
            const num = line.match(/^(\d+)\./)?.[1];
            return (
              <div key={li} className="flex gap-2 items-start mt-1">
                <span className="shrink-0 w-5 h-5 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B] mt-0.5">{num}</span>
                <MathText className="text-sm leading-relaxed">{line.replace(/^\d+\.\s/, "")}</MathText>
              </div>
            );
          }
          // Bold headings: **text**
          if (line.match(/^\*\*.*\*\*$/)) {
            return <p key={li} className="text-sm font-bold text-[#111111] mt-2 mb-1">{line.replace(/\*\*/g, "")}</p>;
          }
          // Code block line
          if (line.startsWith("```") || line.startsWith("    ")) {
            return <code key={li} className="block text-xs font-mono bg-[#F8FAFC] border border-[#E2E8F0] rounded px-2 py-0.5 mt-1 text-[#6366F1]">{line.replace(/^    /, "")}</code>;
          }
          if (!line.trim()) return null;
          return <MathText key={li} className="text-sm leading-relaxed block">{line}</MathText>;
        })}
      </div>
    );
  });
}

export default function TutorPage() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function sendMessage(text: string, files?: File[]) {
    if (!text.trim() && !files?.length) return;

    let imageBase64: string | undefined;
    let imageType: string | undefined;
    let imageUrl: string | undefined;

    if (files && files[0]?.type.startsWith("image/")) {
      const file = files[0];
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      bytes.forEach((b) => (binary += String.fromCharCode(b)));
      imageBase64 = btoa(binary);
      imageType = file.type;
      imageUrl = URL.createObjectURL(file);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      imageUrl,
    };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
          subjectName: subject.id !== "all" ? subject.name : undefined,
          imageBase64,
          imageType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Something went wrong. Please try again.", error: true }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white relative">

      {/* ── Animated purple background blobs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-purple-400/20 blur-3xl animate-blob" />
        <div className="absolute top-1/2 -left-48 w-[400px] h-[400px] rounded-full bg-violet-500/15 blur-3xl animate-blob animation-delay-2" />
        <div className="absolute -bottom-48 right-1/3 w-[450px] h-[450px] rounded-full bg-purple-300/20 blur-3xl animate-blob animation-delay-4" />
      </div>

      {/* ── Sidebar ── */}
      <aside className="relative z-10 w-52 flex-shrink-0 bg-[#111111] border-r border-[#1E293B] flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-4 border-b border-[#1E293B]">
          <Link href="/"><ThinkioLogo /></Link>
        </div>

        {/* AI Tutor entry — highlighted */}
        <div className="px-3 pt-3">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium bg-white text-[#111111]">
            <Bot className="h-4 w-4" />
            AI Tutor
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                pathname === href
                  ? "bg-white text-[#111111]"
                  : "text-[#94A3B8] hover:bg-[#1A1A2E]"
              }`}>
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-4 pb-4 flex items-center gap-2.5">
          <UserAvatar size="sm" />
        </div>
      </aside>

      {/* ── Main chat area ── */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-white/70 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#111111] flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#111111]">AI Tutor</h1>
              <p className="text-[11px] text-[#94A3B8]">School & academics only</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Subject dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all bg-white hover:bg-[#F8FAFC] text-[#111111] border border-[#E2E8F0]"
              >
                <BookOpen className="h-4 w-4 text-[#94A3B8]" />
                <span className="text-[13px]">{subject.name}</span>
                <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
                </motion.div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[#E2E8F0] bg-white shadow-xl overflow-hidden z-50"
                  >
                    {SUBJECTS.map((s) => (
                      <button key={s.id}
                        onClick={() => { setSubject(s); setDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center justify-between ${
                          subject.id === s.id ? "text-[#111111] bg-[#F1F5F9] font-semibold" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111111]"
                        }`}>
                        {s.name}
                        {subject.id === s.id && <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {messages.length > 0 && (
              <button onClick={() => setMessages([])}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F8FAFC] transition-all">
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-2xl mx-auto space-y-6">

            {messages.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="text-center pt-12">
                <div className="w-16 h-16 rounded-2xl bg-[#111111] flex items-center justify-center mx-auto mb-5">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#111111] mb-2">What do you want to learn?</h2>
                <p className="text-sm text-[#64748B] mb-8">Ask any school question, upload a photo of your homework, or pick a suggestion below.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      onClick={() => sendMessage(s)}
                      className="text-left px-4 py-3 rounded-xl text-[13px] text-[#64748B] hover:text-[#111111] bg-white/80 border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white transition-all shadow-sm">
                      {s}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>

                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-[#111111] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}

                  <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[#111111] text-white rounded-br-sm"
                      : msg.error
                      ? "bg-red-50 border border-red-200 text-red-600 rounded-bl-sm"
                      : "bg-white border border-[#E2E8F0] text-[#1E293B] rounded-bl-sm shadow-sm"
                  }`}>
                    {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="Uploaded" className="rounded-xl max-h-48 w-auto object-contain mb-3" />
                    )}
                    {msg.role === "user" ? (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    ) : (
                      <div>{formatMessage(msg.content)}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-[#111111] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5 items-center h-5">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"
                        animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-white/70 backdrop-blur-md shrink-0">
          <div className="max-w-2xl mx-auto">
            <PromptInputBox
              onSend={sendMessage}
              isLoading={loading}
              placeholder={subject.id !== "all" ? `Ask about ${subject.name}...` : "Ask any school question..."}
              className="border-[#E2E8F0]"
            />
            <p className="text-center text-[11px] text-[#CBD5E1] mt-2">Only answers school & academic questions</p>
          </div>
        </div>
      </main>
    </div>
  );
}
