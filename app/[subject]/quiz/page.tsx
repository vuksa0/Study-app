"use client";

import { getSubject, getTopic } from "@/lib/subjects";
import { getCustomSubjects } from "@/lib/custom-subjects";
import type { Subject, Topic } from "@/lib/subjects";
import { getTestDate } from "@/lib/test-date";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const COUNT_OPTIONS = [5, 10, 15, 20];

function QuizContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subjectId = params.subject as string;
  const topicId = searchParams.get("topic") ?? undefined;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);

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

  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);

  async function generateQuiz() {
    if (!subject) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, topicId, count, subjectName: subject.name, topicName: topic?.name, topicDescription: topic?.description, testDate: getTestDate(subjectId) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generating quiz");
      setQuestions(data.questions);
      setCurrent(0); setSelected(null); setRevealed(false); setScore(0); setFinished(false); setStarted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    if (idx === questions[current].answer) setScore((s) => s + 1);
  }

  function next() {
    if (current + 1 >= questions.length) setFinished(true);
    else { setCurrent((c) => c + 1); setSelected(null); setRevealed(false); }
  }

  if (!subject) return null;

  const q = questions[current];
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <main className="relative min-h-screen">
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-30" />

      <div className="relative max-w-xl mx-auto px-5 py-14">
        <Link href={`/${subjectId}`} className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          {subject.name}
        </Link>

        {/* Setup screen */}
        {!started && (
          <div className="card-glow rounded-2xl p-8 fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                {subject.emoji}
              </div>
              <div>
                <h1 className="font-semibold text-white/90">{subject.name}</h1>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {topic ? topic.name : "All topics"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs mb-3 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>NUMBER OF QUESTIONS</p>
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

            <button onClick={generateQuiz} disabled={loading} className="btn-primary w-full">
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="15"/>
                  </svg>
                  Generating questions...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Start Quiz
                </>
              )}
            </button>
          </div>
        )}

        {/* Quiz screen */}
        {started && !finished && q && (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                {current + 1} / {questions.length}
              </span>
              <span className="text-xs font-semibold" style={{ color: "#a78bfa" }}>
                {score} correct
              </span>
            </div>
            <div className="w-full h-1 rounded-full mb-8 overflow-hidden" style={{ background: "var(--surface-2)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(current / questions.length) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#06b6d4)" }} />
            </div>

            {/* Question */}
            <div className="card-glow rounded-2xl p-6 mb-4">
              <p className="text-base font-medium leading-relaxed text-white/85">{q.question}</p>
            </div>

            {/* Options */}
            <div className="grid gap-2.5 mb-5">
              {q.options.map((opt, idx) => {
                let bg = "transparent";
                let borderColor = "var(--border)";
                let color = "rgba(255,255,255,0.7)";
                if (revealed) {
                  if (idx === q.answer) { bg = "rgba(34,197,94,0.08)"; borderColor = "rgba(34,197,94,0.4)"; color = "#86efac"; }
                  else if (idx === selected) { bg = "rgba(239,68,68,0.08)"; borderColor = "rgba(239,68,68,0.4)"; color = "#fca5a5"; }
                  else { color = "rgba(255,255,255,0.2)"; }
                }
                return (
                  <button key={idx} onClick={() => handleSelect(idx)} disabled={revealed}
                    className="w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all"
                    style={{ background: bg, border: `1px solid ${borderColor}`, color, cursor: revealed ? "default" : "pointer" }}>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {revealed && (
              <div className="rounded-xl p-4 mb-5 text-sm" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <span className="font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Explanation  </span>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>{q.explanation}</span>
              </div>
            )}

            {revealed && (
              <button onClick={next} className="btn-primary w-full">
                {current + 1 >= questions.length ? "See Results" : "Next Question"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Result screen */}
        {finished && (
          <div className="card-glow rounded-2xl p-8 text-center fade-up">
            <div className="text-5xl mb-5">
              {percentage >= 80 ? "🏆" : percentage >= 60 ? "👍" : percentage >= 40 ? "📚" : "💪"}
            </div>
            <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Result</p>
            <p className="text-6xl font-bold mb-1 text-gradient">{percentage}%</p>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
              {score} of {questions.length} correct
            </p>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
              {percentage >= 80 ? "Excellent! You've mastered this topic."
                : percentage >= 60 ? "Good job! A little more practice and you'll nail it."
                : percentage >= 40 ? "Decent, but there's room to improve."
                : "Keep studying — you'll get there!"}
            </p>
            <div className="grid gap-2.5">
              <button onClick={generateQuiz} disabled={loading} className="btn-primary w-full">
                {loading ? "Generating..." : "New Quiz"}
              </button>
              <Link href={`/${subjectId}`} className="btn-secondary w-full">Change Topic</Link>
              <Link href="/" className="btn-secondary w-full">All Subjects</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function QuizPage() {
  return <Suspense><QuizContent /></Suspense>;
}
