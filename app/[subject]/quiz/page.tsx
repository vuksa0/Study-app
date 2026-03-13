"use client";

import { getSubject, getTopic } from "@/lib/subjects";
import { getCustomSubjects } from "@/lib/custom-subjects";
import type { Subject, Topic } from "@/lib/subjects";
import { getTestDate } from "@/lib/test-date";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@clerk/nextjs";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Spinner } from "@/components/ui/ios-spinner";
import { useLocale } from "@/components/LocaleProvider";

interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const COUNT_OPTIONS = [5, 10, 15, 20];
const OPTION_LABELS = ["A", "B", "C", "D"];

function QuizContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subjectId = params.subject as string;
  const topicId = searchParams.get("topic") ?? undefined;

  const { isSignedIn } = useAuth();
  const { t } = useLocale();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function saveQuiz() {
    if (!isSignedIn || !subject || saving || saved) return;
    setSaving(true);
    try {
      await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quiz",
          subject_id: subjectId,
          subject_name: subject.name,
          title: `${subject.name}${topic ? ` · ${topic.name}` : ""} Quiz`,
          data: { questions },
        }),
      });
      setSaved(true);
    } catch { /* silent */ } finally { setSaving(false); }
  }

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
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  async function generateQuiz() {
    if (!subject) return;
    setLoading(true);
    setError("");
    setShowHint(false);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId, topicId, count,
          subjectName: subject.name,
          topicName: topic?.name,
          topicDescription: topic?.description,
          testDate: getTestDate(subjectId),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generating quiz");
      setQuestions(data.questions);
      setCurrent(0); setSelected(null); setRevealed(false);
      setScore(0); setStreak(0); setMaxStreak(0); setCurrentStreak(0);
      setFinished(false); setStarted(true);
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
    setShowHint(false);
    if (idx === questions[current].answer) {
      setScore((s) => s + 1);
      setCurrentStreak((s) => {
        const next = s + 1;
        setMaxStreak((m) => Math.max(m, next));
        return next;
      });
    } else {
      setCurrentStreak(0);
    }
  }

  function next() {
    if (current + 1 >= questions.length) {
      setStreak(maxStreak);
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
      setShowHint(false);
    }
  }

  if (!subject) return null;

  const q = questions[current];
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const progressPct = questions.length > 0 ? ((current / questions.length) * 100) : 0;

  const RADIUS = 88;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

  return (
    <div className="bg-[#111111] text-white min-h-screen relative overflow-x-hidden font-sans">
      <div className="relative z-10 flex flex-col min-h-screen max-w-5xl mx-auto px-8 py-6">

        {/* Setup Screen */}
        {!started && (
          <>
            <header className="flex items-center justify-between mb-8">
              <Link
                href={`/${subjectId}`}
                className="flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-white">arrow_back</span>
              </Link>
              <div className="text-center">
                <h2 className="text-white text-lg font-bold tracking-tight">Quiz Setup</h2>
                <p className="text-white/50 text-xs font-medium uppercase tracking-widest">{subject.name}</p>
              </div>
              <div className="size-10" />
            </header>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 border border-white/10">
                  <span className="material-symbols-outlined text-white">quiz</span>
                </div>
                <div>
                  <h1 className="font-bold text-white">{subject.name}</h1>
                  <p className="text-sm text-white/50">{topic ? topic.name : "All topics"}</p>
                </div>
              </div>

              <p className="text-xs mb-3 font-bold uppercase tracking-widest text-white/40">Number of Questions</p>
              <div className="flex gap-2 mb-8">
                {COUNT_OPTIONS.map((n) => (
                  <button key={n} onClick={() => setCount(n)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                    style={{
                      border: "1px solid",
                      borderColor: count === n ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.1)",
                      background: count === n ? "rgba(255,255,255,0.12)" : "transparent",
                      color: count === n ? "#ffffff" : "rgba(255,255,255,0.35)",
                    }}>
                    {n}
                  </button>
                ))}
              </div>

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <button
                onClick={generateQuiz}
                disabled={loading}
                className="w-full py-5 rounded-xl bg-white text-[#111111] font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="text-[#111111]" />
                    {t('generating')}
                  </>
                ) : (
                  <>
                    Start Quiz
                    <span className="material-symbols-outlined leading-none">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Quiz Screen */}
        {started && !finished && q && (
          <>
            <header className="flex items-center justify-between mb-8">
              <button
                onClick={() => { setStarted(false); setQuestions([]); }}
                className="flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-white">close</span>
              </button>
              <div className="text-center">
                <h2 className="text-white text-lg font-bold tracking-tight">
                  Question {current + 1} of {questions.length}
                </h2>
                <p className="text-white/40 text-xs font-medium uppercase tracking-widest">{subject.name} Session</p>
              </div>
              <div className="flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10">
                <span className="text-xs font-bold text-white">{score}</span>
              </div>
            </header>

            {/* Progress */}
            <div className="flex flex-col gap-2 mb-10">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-semibold text-white/40 uppercase">Progress</span>
                <span className="text-xs font-bold text-white">{Math.round(progressPct)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-6">
              <div className="relative z-10 flex flex-col items-center text-center">
                {topic && (
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/60 text-[10px] font-bold uppercase tracking-widest mb-6">
                    {topic.name}
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl font-bold leading-tight text-white">
                  {q.question}
                </h1>
              </div>
            </div>

            {/* Hint */}
            {showHint && !revealed && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 text-sm text-white/70">
                <span className="font-bold text-white">Hint: </span>
                {q.explanation}
              </div>
            )}

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {q.options.map((opt, idx) => {
                let bg = "transparent";
                let borderColor = "rgba(255,255,255,0.12)";
                let color = "rgba(255,255,255,0.85)";
                let labelBg = "transparent";
                let labelBorder = "rgba(255,255,255,0.15)";
                let labelColor = "rgba(255,255,255,0.7)";

                if (revealed) {
                  if (idx === q.answer) {
                    bg = "rgba(34,197,94,0.12)";
                    borderColor = "rgba(34,197,94,0.5)";
                    color = "#86efac";
                    labelBg = "rgba(34,197,94,0.2)";
                    labelBorder = "rgba(34,197,94,0.5)";
                    labelColor = "#86efac";
                  } else if (idx === selected) {
                    bg = "rgba(239,68,68,0.12)";
                    borderColor = "rgba(239,68,68,0.5)";
                    color = "#fca5a5";
                    labelBg = "rgba(239,68,68,0.2)";
                    labelBorder = "rgba(239,68,68,0.5)";
                    labelColor = "#fca5a5";
                  } else {
                    color = "rgba(255,255,255,0.2)";
                    labelColor = "rgba(255,255,255,0.2)";
                    labelBorder = "rgba(255,255,255,0.08)";
                  }
                } else if (selected === idx) {
                  bg = "rgba(255,255,255,0.1)";
                  borderColor = "rgba(255,255,255,0.5)";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={revealed}
                    className="rounded-full px-6 py-4 flex items-center gap-4 transition-all duration-200 text-left"
                    style={{
                      background: bg,
                      border: `1px solid ${borderColor}`,
                      color,
                      cursor: revealed ? "default" : "pointer",
                    }}
                  >
                    <span
                      className="size-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: labelBg,
                        border: `1px solid ${labelBorder}`,
                        color: labelColor,
                      }}
                    >
                      {OPTION_LABELS[idx]}
                    </span>
                    <span className="font-medium">{opt}</span>
                    {revealed && idx === q.answer && (
                      <span className="material-symbols-outlined ml-auto text-green-400 text-xl leading-none">check_circle</span>
                    )}
                    {revealed && idx === selected && idx !== q.answer && (
                      <span className="material-symbols-outlined ml-auto text-red-400 text-xl leading-none">cancel</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation after reveal */}
            {revealed && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5 text-sm">
                <span className="font-bold text-white/50">Explanation  </span>
                <span className="text-white/70">{q.explanation}</span>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex flex-col gap-3">
              {!revealed && (
                <button
                  onClick={() => setShowHint((h) => !h)}
                  className="w-full py-4 rounded-xl border border-white/15 text-white/60 font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl leading-none">lightbulb</span>
                  {showHint ? "Hide Hint" : "Hint"}
                </button>
              )}
              {revealed && (
                <button
                  onClick={next}
                  className="w-full py-5 rounded-xl bg-white text-[#111111] font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {current + 1 >= questions.length ? t('seeResults') : t('nextQuestion')}
                  <span className="material-symbols-outlined leading-none">arrow_forward</span>
                </button>
              )}
            </div>
          </>
        )}

        {/* Results Screen */}
        {finished && (
          <>
            <header className="flex items-center justify-between mb-6">
              <button
                onClick={() => { setStarted(false); setFinished(false); setQuestions([]); }}
                className="flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-white">arrow_back</span>
              </button>
              <h1 className="text-xl font-bold tracking-tight">Quiz Results</h1>
              <div className="size-10" />
            </header>

            {/* Circular progress */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                  <circle cx="96" cy="96" r={RADIUS} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                  <circle
                    cx="96" cy="96" r={RADIUS} fill="transparent"
                    stroke="#ffffff"
                    strokeWidth="12"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{percentage}%</span>
                  <span className="text-sm font-medium text-white/50">{t('score')}</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold mb-1">
                  {percentage >= 80 ? "Excellent Work!" : percentage >= 60 ? "Good Job!" : percentage >= 40 ? "Keep Going!" : "Don't Give Up!"}
                </h2>
                <p className="text-white/50 font-medium">
                  {percentage >= 80 ? "You've mastered this topic." : "Keep studying to improve."}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
                <span className="material-symbols-outlined text-green-500 mb-1">check_circle</span>
                <span className="text-xl font-bold">{score}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/40">{t('correct')}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
                <span className="material-symbols-outlined text-red-500 mb-1">cancel</span>
                <span className="text-xl font-bold">{questions.length - score}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/40">{t('incorrect')}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
                <span className="material-symbols-outlined text-orange-500 mb-1">local_fire_department</span>
                <span className="text-xl font-bold">{maxStreak}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/40">Streak</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={generateQuiz}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-white text-[#111111] font-bold hover:opacity-90 transition-all disabled:opacity-40"
              >
                {loading ? t('generating') : "New Quiz"}
              </button>
              <button
                onClick={saveQuiz}
                disabled={saving || saved}
                className="w-full py-4 rounded-xl border border-white/15 text-white/60 font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg leading-none">{saved ? "bookmark_added" : "bookmark"}</span>
                {saved ? "Saved to Library" : saving ? t('saving') : "Save Quiz"}
              </button>
              <Link
                href={`/${subjectId}`}
                className="w-full py-4 rounded-xl border border-white/8 text-white/30 font-bold hover:text-white/60 transition-colors text-center"
              >
                Change Topic
              </Link>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

export default function QuizPage() {
  return <Suspense><QuizContent /></Suspense>;
}
