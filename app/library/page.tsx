"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useAuth } from "@clerk/nextjs";

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
  quiz:       { icon: "quiz",        label: "Quiz",       color: "text-blue-400",    bg: "bg-blue-500/10" },
  flashcards: { icon: "style",       label: "Flashcards", color: "text-purple-400",  bg: "bg-purple-500/10" },
  lesson:     { icon: "menu_book",   label: "Lesson",     color: "text-emerald-400", bg: "bg-emerald-500/10" },
  problems:   { icon: "calculate",   label: "Problems",   color: "text-amber-400",   bg: "bg-amber-500/10" },
};

export default function LibraryPage() {
  const { isSignedIn } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

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

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase()) ||
    (i.subject_name ?? "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-[#151022] text-slate-100 min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-[#151022]/80 backdrop-blur-md px-6 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            My Library
          </h1>
          <div className="flex gap-3 items-center">
            <Link href="/" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-xl leading-none">home</span>
            </Link>
            <Link href="/upload" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-xl leading-none">upload_file</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="px-6 py-4 max-w-7xl mx-auto w-full">
        <div
          className="relative flex items-center rounded-xl bg-primary/10"
          style={{ border: "1px solid rgba(137,90,246,0.1)" }}
        >
          <span className="material-symbols-outlined ml-4 text-primary/60">search</span>
          <input
            className="w-full bg-transparent border-none outline-none py-4 px-3 text-slate-100 placeholder:text-slate-400 text-sm"
            placeholder="Search your library..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        {!isSignedIn ? (
          <div className="text-center py-20">
            <p className="text-slate-400 mb-4">Sign in to see your saved items.</p>
            <Link href="/login" className="text-primary underline">Log in</Link>
          </div>
        ) : loading ? (
          <p className="text-slate-400 text-center py-20">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 mb-4">{items.length === 0 ? "Your library is empty. Generate something to save it here." : "No results."}</p>
            {items.length === 0 && (
              <Link href="/upload" className="text-primary underline">Go to Upload</Link>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Saved Items</h2>
              <span className="text-primary text-sm font-bold">{filtered.length} items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((item) => {
                const cfg = TYPE_CONFIG[item.type];
                const date = new Date(item.created_at).toLocaleDateString();
                return (
                  <div
                    key={item.id}
                    className="rounded-xl p-5 flex flex-col gap-4 relative"
                    style={{ background: "rgba(137, 90, 246, 0.05)", border: "1px solid rgba(137, 90, 246, 0.1)" }}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`h-12 w-12 rounded-lg ${cfg.bg} flex items-center justify-center ${cfg.color}`}>
                        <span className="material-symbols-outlined text-2xl">{cfg.icon}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${cfg.color}`}>{cfg.label}</p>
                      <h3 className="font-bold text-white leading-snug">{item.title}</h3>
                      {item.subject_name && (
                        <p className="text-slate-400 text-xs mt-1">{item.subject_name}</p>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs mt-auto">{date}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
