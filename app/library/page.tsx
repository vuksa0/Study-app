"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useAuth } from "@clerk/nextjs";
import { Navigation } from "@/components/Navigation";
import { MathText } from "@/components/ui/math-text";

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
  quiz:       { label: "Quiz",       icon: "quiz",      color: "#3B82F6" },
  flashcards: { label: "Flashcards", icon: "style",     color: "#8B5CF6" },
  lesson:     { label: "Lesson",     icon: "menu_book", color: "#10B981" },
  problems:   { label: "Problem",    icon: "calculate", color: "#F59E0B" },
};

function QuizView({ data }: { data: Record<string, unknown> }) {
  const questions = (data.questions as Array<{
    question: string; options: string[]; answer: number; explanation: string;
  }>) ?? [];
  const savedAnswers = data.userAnswers as Record<string, number> | undefined;
  // If we have saved answers, show static results; otherwise interactive
  const hasHistory = !!savedAnswers;

  const [selected, setSelected] = useState<Record<number, number>>({});

  if (!questions.length) return <p className="text-sm text-[#94A3B8]">No questions found.</p>;

  // Stats bar when we have history
  const correct = hasHistory ? questions.filter((q, i) => savedAnswers![i] === q.answer).length : null;
  const wrong   = hasHistory ? questions.filter((q, i) => i in savedAnswers! && savedAnswers![i] !== q.answer).length : null;
  const skipped = hasHistory ? questions.filter((_, i) => !(i in savedAnswers!)).length : null;

  return (
    <div className="mt-4 space-y-4">
      {/* Score bar for saved results */}
      {hasHistory && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111111] border border-[#E2E8F0] dark:border-[#2D3748]">
          <div className="flex items-center gap-1.5 text-sm font-bold text-[#10B981]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block" />
            {correct} correct
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-[#EF4444]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block" />
            {wrong} wrong
          </div>
          {(skipped ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#94A3B8]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0] dark:bg-[#2D3748] inline-block" />
              {skipped} skipped
            </div>
          )}
          <div className="ml-auto text-sm font-black text-[#111111] dark:text-white">
            {questions.length > 0 ? Math.round((correct! / questions.length) * 100) : 0}%
          </div>
        </div>
      )}

      {questions.map((q, qi) => {
        const userPick = hasHistory ? (savedAnswers![qi] ?? null) : (qi in selected ? selected[qi] : null);
        const revealed = hasHistory || qi in selected;

        return (
          <div key={qi} className="rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] p-4">
            <div className="flex items-start gap-2 mb-3">
              {hasHistory && (
                <span className="shrink-0 mt-0.5 text-base">
                  {userPick === null ? "⬜" : userPick === q.answer ? "✅" : "❌"}
                </span>
              )}
              <p className="text-sm font-semibold text-[#111111] dark:text-white">
                {qi + 1}. {q.question}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, oi) => {
                const isCorrect = oi === q.answer;
                const isUserWrong = revealed && userPick === oi && oi !== q.answer;
                const isUnanswered = hasHistory && userPick === null;

                let borderColor = "#E2E8F0";
                let bg = "transparent";
                let color = "#374151";

                if (revealed) {
                  if (isCorrect) {
                    borderColor = "#86efac"; bg = "rgba(16,185,129,0.08)"; color = "#15803d";
                  } else if (isUserWrong) {
                    borderColor = "#fca5a5"; bg = "rgba(239,68,68,0.08)"; color = "#b91c1c";
                  } else {
                    borderColor = "#E2E8F0"; color = isUnanswered ? "#374151" : "#94A3B8";
                  }
                }

                return (
                  <button key={oi}
                    onClick={hasHistory ? undefined : () => setSelected((s) => ({ ...s, [qi]: oi }))}
                    disabled={hasHistory || (qi in selected)}
                    className="text-left text-sm px-3 py-2.5 rounded-lg transition-all"
                    style={{ border: "1px solid", borderColor, background: bg, color, cursor: hasHistory ? "default" : "pointer" }}>
                    <span className="font-medium mr-1">{["A", "B", "C", "D"][oi]})</span>
                    {opt.replace(/^[A-D]\)\s*/, "")}
                    {revealed && isCorrect && (
                      <span className="ml-2 text-[10px] font-bold text-[#10B981] uppercase tracking-wide">correct</span>
                    )}
                    {revealed && isUserWrong && (
                      <span className="ml-2 text-[10px] font-bold text-[#EF4444] uppercase tracking-wide">your answer</span>
                    )}
                  </button>
                );
              })}
            </div>
            {revealed && q.explanation && (
              <p className="text-xs mt-3 text-[#64748B] dark:text-[#94A3B8] border-t border-[#F1F5F9] dark:border-[#2D3748] pt-3">
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FlashcardsView({ data }: { data: Record<string, unknown> }) {
  const cards = (data.flashcards as Array<{ front: string; back: string }>) ?? [];
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  if (!cards.length) return <p className="text-sm text-[#94A3B8]">No flashcards found.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      {cards.map((c, i) => (
        <button
          key={i}
          onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
          className="text-left rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] p-4 min-h-[80px] transition-all"
          style={{ background: flipped[i] ? "#F8FAFC" : "white" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
            {flipped[i] ? "Answer" : "Question"}
          </p>
          <p className="text-sm text-[#111111] dark:text-[#E2E8F0]">
            {flipped[i] ? c.back : c.front}
          </p>
        </button>
      ))}
    </div>
  );
}

function LessonView({ data }: { data: Record<string, unknown> }) {
  const lesson = data.lesson as {
    title?: string; intro?: string;
    sections?: { heading: string; content: string }[];
    summary?: string;
    keyTerms?: { term: string; definition: string }[];
  } | null;
  if (!lesson) return <p className="text-sm text-[#94A3B8]">No lesson content found.</p>;
  return (
    <div className="mt-4 space-y-4">
      {lesson.intro && (
        <p className="text-sm text-[#374151] dark:text-[#CBD5E1] leading-relaxed">{lesson.intro}</p>
      )}
      {lesson.sections?.map((s, i) => (
        <div key={i} className="rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] p-4">
          <h3 className="font-semibold text-[#111111] dark:text-white text-sm mb-2">{s.heading}</h3>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{s.content}</p>
        </div>
      ))}
      {lesson.summary && (
        <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#2D3748] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Key Takeaways</p>
          <p className="text-sm text-[#374151] dark:text-[#CBD5E1] leading-relaxed">{lesson.summary}</p>
        </div>
      )}
      {lesson.keyTerms && lesson.keyTerms.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-3">Key Terms</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {lesson.keyTerms.map((kt, i) => (
              <div key={i} className="rounded-lg border border-[#E2E8F0] dark:border-[#2D3748] p-3">
                <p className="text-sm font-semibold text-[#111111] dark:text-white">{kt.term}</p>
                <p className="text-xs mt-0.5 text-[#94A3B8]">{kt.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProblemsView({ data }: { data: Record<string, unknown> }) {
  // Single problem (from standalone problems page)
  const singleProblem = data.problem as { problem: string; hint: string; answer: string; steps: string[] } | null;
  const userAnswer = data.userAnswer as string | undefined;
  const result = data.result as { correct: boolean; feedback: string; correctAnswer: string; steps: string[] } | null;
  // Multiple problems (from upload flow)
  const multiProblems = data.problems as Array<{ problem: string; hint: string; answer: string; steps: string[] }> | null;

  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({});

  if (multiProblems && multiProblems.length > 0) {
    return (
      <div className="mt-4 space-y-4">
        {multiProblems.map((p, i) => (
          <div key={i} className="rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Problem {i + 1}</p>
            <MathText className="text-sm font-medium text-[#111111] dark:text-white leading-relaxed">{p.problem}</MathText>
            <div className="mt-3 pt-3 border-t border-[#F1F5F9] dark:border-[#2D3748]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">Answer</p>
              <MathText className="text-sm text-[#10B981]">{p.answer}</MathText>
            </div>
            <button
              onClick={() => setOpenSteps((s) => ({ ...s, [i]: !s[i] }))}
              className="mt-3 text-xs text-[#64748B] flex items-center gap-1 hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: openSteps[i] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
              {openSteps[i] ? "Hide steps" : "Show steps"}
            </button>
            {openSteps[i] && (
              <div className="mt-2 space-y-1">
                {p.steps.map((step, si) => (
                  <div key={si} className="flex gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-[#F1F5F9] dark:bg-[#2D3748] flex items-center justify-center font-bold text-[10px]">{si + 1}</span>
                    <MathText>{step}</MathText>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (!singleProblem) return <p className="text-sm text-[#94A3B8]">No problem found.</p>;

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Problem</p>
        <MathText className="text-sm font-medium text-[#111111] dark:text-white leading-relaxed">{singleProblem.problem}</MathText>
      </div>

      {result && (
        <div className="rounded-xl border p-4"
          style={{ borderColor: result.correct ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)", background: result.correct ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span>{result.correct ? "✅" : "❌"}</span>
            <p className="text-sm font-semibold" style={{ color: result.correct ? "#10B981" : "#EF4444" }}>
              {result.correct ? "Correct" : "Incorrect"}
            </p>
          </div>
          {userAnswer && (
            <p className="text-xs text-[#64748B] mb-1">Your answer: <span className="font-mono text-[#374151] dark:text-[#CBD5E1]">{userAnswer}</span></p>
          )}
          <p className="text-xs text-[#64748B] mb-2">Correct answer: <MathText className="font-mono text-[#111111] dark:text-white">{result.correctAnswer}</MathText></p>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{result.feedback}</p>
        </div>
      )}

      <button
        onClick={() => setOpenSteps((s) => ({ ...s, [0]: !s[0] }))}
        className="text-xs text-[#64748B] flex items-center gap-1 hover:text-[#111111] dark:hover:text-white transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transform: openSteps[0] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
        {openSteps[0] ? "Hide steps" : "Show step-by-step solution"}
      </button>
      {openSteps[0] && (
        <div className="space-y-1">
          {(result?.steps ?? singleProblem.steps).map((step, i) => (
            <div key={i} className="flex gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
              <span className="shrink-0 w-4 h-4 rounded-full bg-[#F1F5F9] dark:bg-[#2D3748] flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
              <MathText>{step}</MathText>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryCard({ item, onDelete }: { item: LibraryItem; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const cfg = TYPE_CONFIG[item.type];
  const date = new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  async function del() {
    setDeleting(true);
    await fetch(`/api/library/${item.id}`, { method: "DELETE" });
    onDelete(item.id);
  }

  return (
    <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${cfg.color}18` }}>
          <span className="material-symbols-outlined text-lg" style={{ color: cfg.color }}>{cfg.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#111111] dark:text-white truncate">{item.title}</p>
          <p className="text-xs text-[#94A3B8]">
            <span className="font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
            {item.subject_name ? ` · ${item.subject_name}` : ""}
            {" · "}{date}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[#F1F5F9] dark:hover:bg-[#2D3748]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"
              style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <button
            onClick={del}
            disabled={deleting}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <span className="material-symbols-outlined text-base text-[#CBD5E1] hover:text-red-400 transition-colors">delete</span>
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-5 border-t border-[#F1F5F9] dark:border-[#2D3748]">
          {item.type === "quiz"       && <QuizView data={item.data} />}
          {item.type === "flashcards" && <FlashcardsView data={item.data} />}
          {item.type === "lesson"     && <LessonView data={item.data} />}
          {item.type === "problems"   && <ProblemsView data={item.data} />}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const { isSignedIn } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!isSignedIn) { setLoading(false); return; }
    fetch("/api/library")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isSignedIn]);

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const filtered = items.filter((i) => {
    const matchesQuery =
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      (i.subject_name ?? "").toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "all" || i.type === filter;
    return matchesQuery && matchesFilter;
  });

  const counts = {
    all: items.length,
    quiz: items.filter((i) => i.type === "quiz").length,
    flashcards: items.filter((i) => i.type === "flashcards").length,
    lesson: items.filter((i) => i.type === "lesson").length,
    problems: items.filter((i) => i.type === "problems").length,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] text-[#111111] dark:text-white font-sans">
      <Navigation />

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#111111] dark:text-white md:text-4xl">History</h1>
          <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">All your quizzes, lessons, flashcards, and problems.</p>
        </div>

        {/* Search */}
        <div className="relative flex items-center rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] mb-4">
          <span className="material-symbols-outlined ml-4 text-[#94A3B8] text-xl">search</span>
          <input
            className="w-full bg-transparent border-none outline-none py-3 px-3 text-sm placeholder:text-[#94A3B8]"
            placeholder="Search history..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "quiz", "flashcards", "lesson", "problems"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all flex items-center gap-1.5"
              style={{
                border: "1px solid",
                borderColor: filter === f ? "#111111" : "#E2E8F0",
                background: filter === f ? "#111111" : "transparent",
                color: filter === f ? "#ffffff" : "#64748B",
              }}
            >
              {f}
              <span className="opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>

        {!isSignedIn ? (
          <div className="text-center py-20">
            <p className="text-[#64748B] mb-4">Sign in to see your history.</p>
            <Link href="/login" className="font-bold underline">Log in</Link>
          </div>
        ) : loading ? (
          <p className="text-[#94A3B8] text-center py-20">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-[#E2E8F0] dark:text-[#2D3748] mb-4 block">history</span>
            <p className="text-[#64748B] dark:text-[#94A3B8] mb-4">
              {items.length === 0 ? "No history yet. Start studying and your results will appear here." : "No results match your search."}
            </p>
            {items.length === 0 && (
              <Link href="/dashboard" className="font-bold text-[#111111] dark:text-white underline">Start studying</Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <HistoryCard key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
