"use client";

import { getSubject, getTopic } from "@/lib/subjects";
import { getCustomSubjects } from "@/lib/custom-subjects";
import { getTestDate } from "@/lib/test-date";
import type { Subject, Topic } from "@/lib/subjects";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@clerk/nextjs";
import { ChevronLeft, Zap } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { SUBJECT_ICON_MAP } from "@/components/SubjectIcons";
import { BottomNav } from "@/components/ui/bottom-nav";

interface Flashcard { front: string; back: string; }

const COUNT_OPTIONS = [5, 10, 15, 20];

function FlashcardsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subjectId = params.subject as string;
  const topicId = searchParams.get("topic") ?? undefined;

  const { isSignedIn } = useAuth();
  const { t } = useLocale();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [count, setCount] = useState(10);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

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

  async function saveDeck() {
    if (!isSignedIn || !subject || saving || saved) return;
    setSaving(true);
    try {
      await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "flashcards", subject_id: subjectId, subject_name: subject.name, title: `${subject.name}${topic ? ` · ${topic.name}` : ""} Flashcards`, data: { flashcards: cards } }),
      });
      setSaved(true);
    } catch { /* silent */ } finally { setSaving(false); }
  }

  function markKnown() { setKnown((prev) => new Set([...prev, current])); goNext(); }
  function markStudying() { goNext(); }
  function goNext() {
    if (current + 1 >= cards.length) setFinished(true);
    else { setCurrent((c) => c + 1); setFlipped(false); }
  }

  if (!subject) return null;

  const def = SUBJECT_ICON_MAP[subjectId];
  const card = cards[current];

  return (
    <main className="min-h-screen bg-white dark:bg-[#111111]">
      <div className="max-w-2xl mx-auto px-6 py-14">
        <Link
          href={`/subject/${subjectId}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-[#64748B] dark:hover:text-white transition-colors mb-10"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('back')} — {subject.name}
        </Link>

        {/* Setup */}
        {!started && (
          <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
                style={def ? { background: `${def.color}18` } : { background: "#F1F5F9" }}
              >
                {def ? <def.Icon className="h-5 w-5" /> : <Zap className="h-5 w-5 text-[#94A3B8]" />}
              </div>
              <div>
                <h1 className="font-semibold text-[#111111] dark:text-white">Flash Cards</h1>
                <p className="text-sm text-[#94A3B8]">{subject.name}{topic ? ` · ${topic.name}` : ""}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs mb-3 font-medium text-[#94A3B8] uppercase tracking-wide">Number of cards</p>
              <div className="flex gap-2">
                {COUNT_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      count === n
                        ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white"
                        : "border-[#E2E8F0] dark:border-[#2D3748] text-[#64748B] dark:text-[#94A3B8] hover:border-[#CBD5E1]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              onClick={generateCards}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] py-3.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="15"/>
                  </svg>
                  {t('generating')}
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
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
              <span className="text-xs font-medium text-[#94A3B8]">{current + 1} {t('of')} {cards.length}</span>
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">{known.size} known</span>
            </div>
            <div className="w-full h-1.5 rounded-full mb-8 overflow-hidden bg-[#F1F5F9] dark:bg-[#2D3748]">
              <div
                className="h-full rounded-full transition-all duration-500 bg-[#111111] dark:bg-white"
                style={{ width: `${(current / cards.length) * 100}%` }}
              />
            </div>

            <button
              onClick={() => setFlipped((f) => !f)}
              className="w-full rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-8 text-center cursor-pointer transition-all mb-4 min-h-[200px] flex flex-col items-center justify-center gap-3 hover:shadow-md"
            >
              <span className="text-[10px] uppercase tracking-widest font-medium text-[#CBD5E1] dark:text-[#4A5568]">
                {flipped ? "BACK — click to flip" : t('tapToFlip')}
              </span>
              <p className="text-lg font-medium leading-relaxed text-[#111111] dark:text-white">
                {flipped ? card.back : card.front}
              </p>
            </button>

            {flipped && (
              <div className="grid grid-cols-2 gap-2.5">
                <button onClick={markStudying} className="py-3 rounded-xl border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  {t('stillLearning')}
                </button>
                <button onClick={markKnown} className="py-3 rounded-xl border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                  {t('knowIt')} ✓
                </button>
              </div>
            )}
            {!flipped && (
              <p className="text-center text-xs mt-2 text-[#CBD5E1] dark:text-[#4A5568]">Tap the card to reveal the answer</p>
            )}
          </div>
        )}

        {/* Finished */}
        {finished && (
          <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-8 text-center shadow-sm">
            <div className="text-5xl mb-5">
              {known.size === cards.length ? "🏆" : known.size >= cards.length * 0.7 ? "👍" : "📚"}
            </div>
            <p className="text-sm text-[#94A3B8] mb-1">Session Complete</p>
            <p className="text-6xl font-bold mb-1 text-[#111111] dark:text-white">{known.size}/{cards.length}</p>
            <p className="text-sm text-[#94A3B8] mb-4">cards marked as known</p>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-8">
              {known.size === cards.length ? "Perfect score! You know all of them."
                : known.size >= cards.length * 0.7 ? "Great progress! Review the ones you missed."
                : "Keep practicing — repetition is key!"}
            </p>
            <div className="grid gap-2.5">
              <button onClick={generateCards} disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? t('generating') : "New Deck"}
              </button>
              <button onClick={saveDeck} disabled={saving || saved} className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] text-[#64748B] dark:text-[#94A3B8] py-3 text-sm font-semibold hover:bg-[#F8FAFC] dark:hover:bg-[#222] transition-colors disabled:opacity-50">
                {saved ? "Saved to Library ✓" : saving ? t('saving') : "Save Deck"}
              </button>
              <Link href={`/subject/${subjectId}`} className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] text-[#64748B] dark:text-[#94A3B8] py-3 text-sm font-semibold text-center hover:bg-[#F8FAFC] dark:hover:bg-[#222] transition-colors block">
                Back to Subject
              </Link>
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
