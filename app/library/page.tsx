"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useAuth } from "@clerk/nextjs";
import { Navigation } from "@/components/Navigation";

type LibraryItem = {
  id: string;
  type: "quiz" | "flashcards" | "lesson" | "problems";
  subject_id: string | null;
  subject_name: string | null;
  title: string;
  created_at: string;
  data: Record<string, unknown>;
};

const TYPE_CONFIG = {
  quiz:       { label: "Quiz",       icon: "quiz" },
  flashcards: { label: "Flashcards", icon: "style" },
  lesson:     { label: "Lesson",     icon: "menu_book" },
  problems:   { label: "Problem",    icon: "calculate" },
};

export default function LibraryPage() {
  const { isSignedIn } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!isSignedIn) { setLoading(false); return; }
    fetch("/api/library")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isSignedIn]);

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/library/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleting(null);
  }

  const filtered = items.filter((i) => {
    const matchesQuery =
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      (i.subject_name ?? "").toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "all" || i.type === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] text-[#111111] dark:text-white font-sans">
      <Navigation />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#111111] dark:text-white md:text-4xl">Saved</h1>
          <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">Your saved quizzes, lessons, flashcards, and problems.</p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col gap-3 mb-8 sm:flex-row">
          <div className="relative flex-1 flex items-center rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A]">
            <span className="material-symbols-outlined ml-4 text-[#94A3B8] text-xl">search</span>
            <input
              className="w-full bg-transparent border-none outline-none py-3 px-3 text-sm placeholder:text-[#94A3B8]"
              placeholder="Search saved items..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(["all", "quiz", "flashcards", "lesson", "problems"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all"
                style={{
                  border: "1px solid",
                  borderColor: filter === f ? "rgba(17,17,17,0.8)" : "#E2E8F0",
                  background: filter === f ? "#111111" : "transparent",
                  color: filter === f ? "#ffffff" : "#64748B",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {!isSignedIn ? (
          <div className="text-center py-20">
            <p className="text-[#64748B] mb-4">Sign in to see your saved items.</p>
            <Link href="/login" className="font-bold underline">Log in</Link>
          </div>
        ) : loading ? (
          <p className="text-[#94A3B8] text-center py-20">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-[#E2E8F0] dark:text-[#2D3748] mb-4 block">bookmarks</span>
            <p className="text-[#64748B] dark:text-[#94A3B8] mb-4">
              {items.length === 0 ? "Nothing saved yet. Start studying and save your results here." : "No results match your search."}
            </p>
            {items.length === 0 && (
              <Link href="/subjects" className="font-bold text-[#111111] dark:text-white underline">Browse subjects</Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-[#94A3B8] mb-6 font-medium">{filtered.length} item{filtered.length !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item) => {
                const cfg = TYPE_CONFIG[item.type];
                const date = new Date(item.created_at).toLocaleDateString();
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl p-5 flex flex-col gap-3 border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] dark:bg-[#2D3748] flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg text-[#111111] dark:text-white">{cfg.icon}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{cfg.label}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                        className="text-[#CBD5E1] hover:text-red-400 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#111111] dark:text-white leading-snug text-sm line-clamp-2">{item.title}</h3>
                      {item.subject_name && (
                        <p className="text-xs mt-1 text-[#94A3B8]">{item.subject_name}</p>
                      )}
                    </div>
                    <p className="text-[#CBD5E1] dark:text-[#4A5568] text-xs mt-auto">{date}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
