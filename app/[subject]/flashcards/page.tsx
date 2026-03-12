"use client";

import { getSubject, getTopic } from "@/lib/subjects";
import { getCustomSubjects } from "@/lib/custom-subjects";
import { getTestDate } from "@/lib/test-date";
import type { Subject, Topic } from "@/lib/subjects";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@clerk/nextjs";
import { BottomNav } from "@/components/ui/bottom-nav";

interface Flashcard {
  front: string;
  back: string;
}

const COUNT_OPTIONS = [5, 10, 15, 20];

function FlashcardsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subjectId = params.subject as string;
  const topicId = searchParams.get("topic") ?? undefined;

  const { isSignedIn } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [count, setCount] = useState(10);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function saveDeck() {
    if (!isSignedIn || !subject || saving || saved) return;
    setSaving(true);
    try {
      await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "flashcards",
          subject_id: subjectId,
          subject_name: subject.name,
          title: `${subject.name}${topic ? ` · ${topic.name}` : ""} Flashcards`,
          data: { flashcards: cards },
        }),
      });
      setSaved(true);
    } catch { /* silent */ } finally { setSaving(false); }
  }
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const builtin = getSubject(subjectId);
    if (builtin) {
      setSubject(builtin);
      setTopic(topicId ? (getTopic(subjectId, topicId) ?? null) : null);
      return;
    }
    const custom = getCustomSubjects().find((s) => s.id === subjectId);
    if (custom) {
      setSubject(custom);
      setTopic(topicId ? (custom.topics.find((t) => t.id === topicId) ?? null) : null);
    }
  }, [subjectId, topicId]);

  async function generateCards() {
    if (!subject) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, topicId, count, subjectName: subject.name, topicName: topic?.name, topicDescription: topic?.description, testDate: getTestDate(subjectId) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generating flash cards");
      setCards(data.flashcards);
      setCurrent(0); setFlipped(false); setKnown(new Set()); setFinished(false); setStarted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function markKnown() {
    setKnown((prev) => new Set([...prev, current]));
    goNext();
  }

  function markStudying() {
    goNext();
  }

  function goNext() {
    if (current + 1 >= cards.length) setFinished(true);
    else { setCurrent((c) => c + 1); setFlipped(false); }
  }

  if (!subject) return null;

  const card = cards[current];

  return (
    <main className="relative min-h-screen bg-[#111111] text-white">
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-10" />

      <div className="relative max-w-4xl mx-auto px-8 py-14">
        <Link href={`/${subjectId}`} className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          {subject.name}
        </Link>

        {/* Setup */}
        {!started && (
          <div className="card-glow rounded-2xl p-8 fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                {subject.emoji}
              </div>
              <div>
                <h1 className="font-semibold text-white/90">Flash Cards</h1>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {subject.name}{topic ? ` · ${topic.name}` : ""}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs mb-3 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>NUMBER OF CARDS</p>
              <div className="flex gap-2">
                {COUNT_OPTIONS.map((n) => (
                  <button key={n} onClick={() => setCount(n)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      border: "1px solid",
                      borderColor: count === n ? "rgba(139,92,246,0.5)" : "var(--border)",
                      background: count === n ? "rgba(139,92,246,0.12)" : "transparent",
                      color: count === n ? "#c4b5fd" : "rgba(255,255,255,0.4)",
                    }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <button onClick={generateCards} disabled={loading} className="btn-primary w-full">
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="15"/>
                  </svg>
                  Generating cards...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                  Generate Flash Cards
                </>
              )}
            </button>
          </div>
        )}

        {/* Card study screen */}
        {started && !finished && card && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                {current + 1} / {cards.length}
              </span>
              <span className="text-xs font-semibold" style={{ color: "#86efac" }}>
                {known.size} known
              </span>
            </div>
            <div className="w-full h-1 rounded-full mb-8 overflow-hidden" style={{ background: "var(--surface-2)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(current / cards.length) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#06b6d4)" }} />
            </div>

            {/* Flip card */}
            <button
              onClick={() => setFlipped((f) => !f)}
              className="w-full rounded-2xl p-8 text-center cursor-pointer transition-all mb-4 min-h-[200px] flex flex-col items-center justify-center gap-3"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 0 40px rgba(124,58,237,0.08)" }}>
              <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "rgba(255,255,255,0.2)" }}>
                {flipped ? "BACK — click to flip" : "FRONT — click to reveal"}
              </span>
              <p className="text-lg font-medium leading-relaxed" style={{ color: flipped ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.75)" }}>
                {flipped ? card.back : card.front}
              </p>
            </button>

            {flipped && (
              <div className="grid grid-cols-2 gap-2.5">
                <button onClick={markStudying} className="btn-secondary"
                  style={{ borderColor: "rgba(239,68,68,0.4)", color: "#fca5a5" }}>
                  Still Learning
                </button>
                <button onClick={markKnown} className="btn-secondary"
                  style={{ borderColor: "rgba(34,197,94,0.4)", color: "#86efac" }}>
                  Got It ✓
                </button>
              </div>
            )}
            {!flipped && (
              <p className="text-center text-xs mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
                Tap the card to reveal the answer
              </p>
            )}
          </div>
        )}

        {/* Finished */}
        {finished && (
          <div className="card-glow rounded-2xl p-8 text-center fade-up">
            <div className="text-5xl mb-5">{known.size === cards.length ? "🏆" : known.size >= cards.length * 0.7 ? "👍" : "📚"}</div>
            <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Session Complete</p>
            <p className="text-6xl font-bold mb-1 text-gradient">{known.size}/{cards.length}</p>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>cards marked as known</p>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
              {known.size === cards.length ? "Perfect score! You know all of them."
                : known.size >= cards.length * 0.7 ? "Great progress! Review the ones you missed."
                : "Keep practicing — repetition is key!"}
            </p>
            <div className="grid gap-2.5">
              <button onClick={generateCards} disabled={loading} className="btn-primary w-full">
                {loading ? "Generating..." : "New Deck"}
              </button>
              <button
                onClick={saveDeck}
                disabled={saving || saved}
                className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg leading-none">{saved ? "bookmark_added" : "bookmark"}</span>
                {saved ? "Saved to Library" : saving ? "Saving..." : "Save Deck"}
              </button>
              <Link href={`/${subjectId}`} className="btn-secondary w-full text-center">Back to Subject</Link>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}

export default function FlashcardsPage() {
  return <Suspense><FlashcardsContent /></Suspense>;
}
