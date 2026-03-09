"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSubject, subjects as builtinSubjects } from "@/lib/subjects";
import { getCustomSubjects } from "@/lib/custom-subjects";
import type { Subject } from "@/lib/subjects";

type Mode = "quiz" | "flashcards" | "lesson" | "problems";
type Step = "pick-subject" | "upload" | "generating" | "quiz" | "flashcards" | "lesson" | "problems";

interface Question { question: string; options: string[]; answer: number; explanation: string; }
interface Flashcard { front: string; back: string; }
interface LessonData {
  title: string;
  intro: string;
  sections: { heading: string; content: string }[];
  summary: string;
  keyTerms: { term: string; definition: string }[];
}
interface Problem { problem: string; hint: string; answer: string; steps: string[]; }
interface CheckResult { correct: boolean; feedback: string; correctAnswer: string; steps: string[]; }

const COUNT_OPTIONS = [5, 10, 15, 20];
const ACCEPTED = ".txt,.md,.csv,.py,.js,.ts,.jsx,.tsx,.java,.c,.cpp,.cs,.html,.css,.json,.xml,.yaml,.yml,.pdf,.docx,.png,.jpg,.jpeg,.webp,.gif";

const MATH_KEYS: { label: string; value: string }[] = [
  { label: "7", value: "7" }, { label: "8", value: "8" }, { label: "9", value: "9" },
  { label: "+", value: "+" }, { label: "(", value: "(" }, { label: ")", value: ")" },
  { label: "4", value: "4" }, { label: "5", value: "5" }, { label: "6", value: "6" },
  { label: "−", value: "−" }, { label: "×", value: "×" }, { label: "÷", value: "÷" },
  { label: "1", value: "1" }, { label: "2", value: "2" }, { label: "3", value: "3" },
  { label: "=", value: "=" }, { label: "^", value: "^" }, { label: "√", value: "√" },
  { label: "0", value: "0" }, { label: ".", value: "." }, { label: "⌫", value: "BACKSPACE" },
  { label: "²", value: "²" }, { label: "³", value: "³" }, { label: "π", value: "π" },
  { label: "≤", value: "≤" }, { label: "≥", value: "≥" }, { label: "≠", value: "≠" },
  { label: "≈", value: "≈" }, { label: "∞", value: "∞" }, { label: "%", value: "%" },
  { label: "θ", value: "θ" }, { label: "α", value: "α" }, { label: "β", value: "β" },
  { label: "Δ", value: "Δ" }, { label: "∛", value: "∛" }, { label: "/", value: "/" },
];

function UploadContent() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subject");
  const [subject, setSubject] = useState<Subject | null>(null);

  useEffect(() => {
    if (!subjectId) return;
    const builtin = getSubject(subjectId);
    if (builtin) { setSubject(builtin); return; }
    const custom = getCustomSubjects().find((s) => s.id === subjectId);
    if (custom) setSubject(custom);
  }, [subjectId]);

  const [allSubjects] = useState<Subject[]>(() => [...builtinSubjects, ...getCustomSubjects()]);
  const [step, setStep] = useState<Step>(() => subjectId ? "upload" : "pick-subject");
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<Mode>("quiz");
  const [count, setCount] = useState(10);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());

  function toggleTopic(topicId: string) {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  }

  // Results
  const [questions, setQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);

  // Quiz state
  const [quizCurrent, setQuizCurrent] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [cardsFinished, setCardsFinished] = useState(false);

  // Problems state
  const [problemIndex, setProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cursorPos = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [...prev, ...Array.from(list).filter((f) => !existing.has(f.name + f.size))];
    });
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  function saveCursor() {
    const ta = textareaRef.current;
    if (ta) cursorPos.current = { start: ta.selectionStart, end: ta.selectionEnd };
  }

  function insertAtCursor(value: string) {
    const { start, end } = cursorPos.current;
    if (value === "BACKSPACE") {
      if (start === end && start > 0) {
        setUserAnswer((prev) => prev.slice(0, start - 1) + prev.slice(end));
        cursorPos.current = { start: start - 1, end: start - 1 };
      } else if (start !== end) {
        setUserAnswer((prev) => prev.slice(0, start) + prev.slice(end));
        cursorPos.current = { start, end: start };
      }
    } else {
      setUserAnswer((prev) => prev.slice(0, start) + value + prev.slice(end));
      cursorPos.current = { start: start + value.length, end: start + value.length };
    }
    setTimeout(() => {
      const ta = textareaRef.current;
      if (ta) { ta.focus(); ta.setSelectionRange(cursorPos.current.start, cursorPos.current.end); }
    }, 0);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  async function submitProblemAnswer() {
    const problem = problems[problemIndex];
    if (!problem) return;
    if (!userAnswer.trim() && !imageFile) {
      setError("Upiši odgovor ili učitaj sliku rešenja.");
      return;
    }
    setChecking(true);
    setError("");

    let imageBase64: string | undefined;
    let imageType: string | undefined;
    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      bytes.forEach((b) => (binary += String.fromCharCode(b)));
      imageBase64 = btoa(binary);
      imageType = imageFile.type;
    }

    try {
      const res = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: problem.problem, userAnswer: userAnswer.trim(), imageBase64, imageType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error checking answer");
      setCheckResult(data);
      setShowSteps(!data.correct);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setChecking(false);
    }
  }

  function nextProblem() {
    setProblemIndex((i) => i + 1);
    setUserAnswer("");
    setCheckResult(null);
    setShowHint(false);
    setShowSteps(false);
    setImageFile(null);
    setImagePreview(null);
    setError("");
  }

  async function handleGenerate() {
    if (!files.length) { setError("Upload at least one file first."); return; }
    setError("");
    setStep("generating");

    const fd = new FormData();
    fd.append("mode", mode);
    fd.append("count", String(count));
    if (subject) fd.append("subject", subject.name);
    if (selectedTopics.size > 0) {
      const topicNames = subject?.topics
        .filter((t) => selectedTopics.has(t.id))
        .map((t) => t.name) ?? [];
      fd.append("topics", topicNames.join(", "));
    }
    files.forEach((f) => fd.append("files", f));

    try {
      const res = await fetch("/api/generate-from-file", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.error === "string" ? data.error : (data.error?.message ?? "Generation failed");
        throw new Error(msg);
      }

      if (mode === "quiz") {
        setQuestions(data.questions ?? []);
        setQuizCurrent(0); setQuizSelected(null); setQuizRevealed(false);
        setQuizScore(0); setQuizFinished(false);
        setStep("quiz");
      } else if (mode === "flashcards") {
        setFlashcards(data.flashcards ?? []);
        setCardIndex(0); setCardFlipped(false);
        setKnown(new Set()); setCardsFinished(false);
        setStep("flashcards");
      } else if (mode === "problems") {
        setProblems(data.problems ?? []);
        setProblemIndex(0); setUserAnswer(""); setCheckResult(null);
        setShowHint(false); setShowSteps(false);
        setStep("problems");
      } else {
        setLesson(data.lesson ?? null);
        setStep("lesson");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStep("upload");
    }
  }

  function resetToUpload() {
    setStep("upload");
    setFiles([]);
    setQuestions([]); setFlashcards([]); setLesson(null); setProblems([]);
    setError("");
  }

  // ── Pick subject screen ────────────────────────────────────────────────────
  if (step === "pick-subject") return (
    <main className="relative min-h-screen">
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-30" />
      <div className="orb w-[500px] h-[500px] top-[-100px] left-1/2 -translate-x-1/2 opacity-40"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
      <div className="relative max-w-2xl mx-auto px-5 py-14">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Home
        </Link>
        <h1 className="text-2xl font-bold text-white/90 mb-1">Pick a Subject</h1>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>Choose which subject you&apos;re uploading notes for.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {allSubjects.map((s) => (
            <button key={s.id} onClick={() => { setSubject(s); setStep("upload"); }}
              className="card-glow rounded-2xl p-4 text-left transition-all"
              style={{ background: "var(--surface)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                {s.emoji}
              </div>
              <p className="font-semibold text-white/85 text-sm">{s.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.topics.length} topics</p>
            </button>
          ))}
        </div>
        <button onClick={() => { setSubject(null); setStep("upload"); }}
          className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}>
          Skip — upload without a subject
        </button>
      </div>
    </main>
  );

  // ── Upload screen ──────────────────────────────────────────────────────────
  if (step === "upload") return (
    <main className="relative min-h-screen">
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-30" />
      <div className="orb w-[500px] h-[500px] top-[-100px] left-1/2 -translate-x-1/2 opacity-40"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }} />

      <div className="relative max-w-2xl mx-auto px-5 py-14">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Home
        </Link>

        {subject && (
          <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <span className="text-2xl">{subject.emoji}</span>
            <div>
              <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Generating for subject</p>
              <p className="font-semibold text-violet-300">{subject.name}</p>
            </div>
          </div>
        )}

        {/* Topic multi-select */}
        {subject && subject.topics.length > 0 && (
          <div className="mb-6">
            <p className="text-xs mb-3 font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
              Oblast (možeš izabrati više)
            </p>
            <div className="flex flex-wrap gap-2">
              {subject.topics.map((t) => {
                const active = selectedTopics.has(t.id);
                return (
                  <button key={t.id} onClick={() => toggleTopic(t.id)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={active
                      ? { background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.6)", color: "#c4b5fd" }
                      : { background: "var(--surface-2)", border: "1px solid var(--border)", color: "rgba(255,255,255,0.4)" }}>
                    {t.name}
                  </button>
                );
              })}
            </div>
            {selectedTopics.size === 0 && (
              <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>Nije odabrano — generisaće se za ceo predmet</p>
            )}
          </div>
        )}

        <h1 className="text-2xl font-bold text-white/90 mb-1">Upload & Generate</h1>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
          Upload your notes, scripts, PDFs, or images and get quizzes, flash cards, a full lesson, or practice problems instantly.
        </p>

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="rounded-2xl p-10 text-center cursor-pointer transition-all mb-5"
          style={{
            border: `2px dashed ${dragging ? "rgba(6,182,212,0.6)" : files.length ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.1)"}`,
            background: dragging ? "rgba(6,182,212,0.05)" : files.length ? "rgba(139,92,246,0.05)" : "var(--surface)",
          }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            📁
          </div>
          <p className="font-medium mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
            {files.length ? `${files.length} file${files.length > 1 ? "s" : ""} selected — click to add more` : "Drop files here or click to browse"}
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            Images · PDFs · Text files · Code scripts · Markdown
          </p>
          <input ref={fileInputRef} type="file" multiple accept={ACCEPTED} className="hidden"
            onChange={(e) => addFiles(e.target.files)} />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="rounded-xl overflow-hidden mb-6" style={{ border: "1px solid var(--border)" }}>
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm"
                style={{ borderBottom: i < files.length - 1 ? "1px solid var(--border)" : "none", background: "var(--surface)" }}>
                <span className="truncate mr-3" style={{ color: "rgba(255,255,255,0.65)" }}>{f.name}</span>
                <span className="text-xs shrink-0 mr-3" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {f.size < 1024 ? `${f.size} B` : f.size < 1048576 ? `${(f.size / 1024).toFixed(0)} KB` : `${(f.size / 1048576).toFixed(1)} MB`}
                </span>
                <button onClick={(e) => { e.stopPropagation(); setFiles((p) => p.filter((_, j) => j !== i)); }}
                  className="text-xs shrink-0 transition-colors"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.2)"; }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-5">
          {/* Mode */}
          <div>
            <p className="text-xs mb-3 font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
              What to generate
            </p>
            {(() => {
              const showProblems = subject && ["mathematics", "chemistry", "physics", "biology"].includes(subject.id);
              if (!showProblems && mode === "problems") setMode("quiz");
              return null;
            })()}
            <div className={`grid gap-2 ${["mathematics","chemistry","physics","biology"].includes(subject?.id ?? "") ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
              {([
                { id: "quiz" as Mode, icon: "🎯", label: "Quiz" },
                { id: "flashcards" as Mode, icon: "🃏", label: "Flash Cards" },
                { id: "lesson" as Mode, icon: "📖", label: "Lesson" },
                ...( subject && ["mathematics", "chemistry", "physics", "biology"].includes(subject.id)
                  ? [{ id: "problems" as Mode, icon: "🧮", label: "Problems" }]
                  : []
                ),
              ]).map((m) => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className="py-4 rounded-xl text-sm font-semibold flex flex-col items-center gap-2 transition-all"
                  style={{
                    border: "1px solid",
                    borderColor: mode === m.id ? "rgba(139,92,246,0.5)" : "var(--border)",
                    background: mode === m.id ? "rgba(139,92,246,0.12)" : "var(--surface)",
                    color: mode === m.id ? "#c4b5fd" : "rgba(255,255,255,0.4)",
                  }}>
                  <span className="text-2xl">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          {mode !== "lesson" && (
            <div>
              <p className="text-xs mb-3 font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
                {mode === "quiz" ? "Number of questions" : mode === "problems" ? "Number of problems" : "Number of cards"}
              </p>
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
          )}

          {error && <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>}

          <button onClick={handleGenerate} disabled={!files.length} className="btn-primary w-full"
            style={{ opacity: files.length ? 1 : 0.4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Generate {mode === "quiz" ? "Quiz" : mode === "flashcards" ? "Flash Cards" : mode === "problems" ? "Problems" : "Lesson"}
          </button>
        </div>
      </div>
    </main>
  );

  // ── Generating screen ──────────────────────────────────────────────────────
  if (step === "generating") return (
    <main className="relative min-h-screen flex items-center justify-center">
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-20" />
      <div className="text-center fade-up">
        <svg className="animate-spin mx-auto mb-5" width="32" height="32" viewBox="0 0 24 24" fill="none"
          style={{ color: "#8b5cf6" }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="40" strokeDashoffset="15"/>
        </svg>
        <p className="font-medium text-white/60">Analyzing {files.length} file{files.length > 1 ? "s" : ""}…</p>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
          Generating your {mode === "quiz" ? "quiz" : mode === "flashcards" ? "flash cards" : mode === "problems" ? "problems" : "lesson"}
        </p>
      </div>
    </main>
  );

  // ── Quiz screen ────────────────────────────────────────────────────────────
  if (step === "quiz") {
    const q = questions[quizCurrent];
    const pct = Math.round((quizScore / questions.length) * 100);

    if (quizFinished) return (
      <main className="relative min-h-screen">
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-20" />
        <div className="relative max-w-xl mx-auto px-5 py-14">
          <div className="card-glow rounded-2xl p-8 text-center fade-up">
            <div className="text-5xl mb-5">{pct >= 80 ? "🏆" : pct >= 60 ? "👍" : pct >= 40 ? "📚" : "💪"}</div>
            <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Result</p>
            <p className="text-6xl font-bold mb-1 text-gradient">{pct}%</p>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>{quizScore} of {questions.length} correct</p>
            <div className="grid gap-2.5">
              <button onClick={() => { setQuizCurrent(0); setQuizSelected(null); setQuizRevealed(false); setQuizScore(0); setQuizFinished(false); }}
                className="btn-primary w-full">Retry Quiz</button>
              <button onClick={resetToUpload} className="btn-secondary w-full">Upload New Files</button>
            </div>
          </div>
        </div>
      </main>
    );

    return (
      <main className="relative min-h-screen">
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-20" />
        <div className="relative max-w-xl mx-auto px-5 py-14">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
              {quizCurrent + 1} / {questions.length}
            </span>
            <span className="text-xs font-semibold" style={{ color: "#a78bfa" }}>{quizScore} correct</span>
          </div>
          <div className="w-full h-1 rounded-full mb-8 overflow-hidden" style={{ background: "var(--surface-2)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(quizCurrent / questions.length) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#06b6d4)" }} />
          </div>

          <div className="card-glow rounded-2xl p-6 mb-4">
            <p className="text-base font-medium leading-relaxed text-white/85">{q.question}</p>
          </div>

          <div className="grid gap-2.5 mb-5">
            {q.options.map((opt, idx) => {
              let bg = "transparent", border = "var(--border)", color = "rgba(255,255,255,0.7)";
              if (quizRevealed) {
                if (idx === q.answer) { bg = "rgba(34,197,94,0.08)"; border = "rgba(34,197,94,0.4)"; color = "#86efac"; }
                else if (idx === quizSelected) { bg = "rgba(239,68,68,0.08)"; border = "rgba(239,68,68,0.4)"; color = "#fca5a5"; }
                else { color = "rgba(255,255,255,0.2)"; }
              }
              return (
                <button key={idx} disabled={quizRevealed}
                  onClick={() => {
                    if (quizRevealed) return;
                    setQuizSelected(idx); setQuizRevealed(true);
                    if (idx === q.answer) setQuizScore((s) => s + 1);
                  }}
                  className="w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: bg, border: `1px solid ${border}`, color, cursor: quizRevealed ? "default" : "pointer" }}>
                  {opt}
                </button>
              );
            })}
          </div>

          {quizRevealed && (
            <>
              <div className="rounded-xl p-4 mb-5 text-sm" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <span className="font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Explanation  </span>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>{q.explanation}</span>
              </div>
              <button className="btn-primary w-full"
                onClick={() => {
                  if (quizCurrent + 1 >= questions.length) setQuizFinished(true);
                  else { setQuizCurrent((c) => c + 1); setQuizSelected(null); setQuizRevealed(false); }
                }}>
                {quizCurrent + 1 >= questions.length ? "See Results" : "Next Question"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </main>
    );
  }

  // ── Flashcards screen ──────────────────────────────────────────────────────
  if (step === "flashcards") {
    const card = flashcards[cardIndex];

    if (cardsFinished) return (
      <main className="relative min-h-screen">
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-20" />
        <div className="relative max-w-xl mx-auto px-5 py-14">
          <div className="card-glow rounded-2xl p-8 text-center fade-up">
            <div className="text-5xl mb-5">{known.size === flashcards.length ? "🏆" : known.size >= flashcards.length * 0.7 ? "👍" : "📚"}</div>
            <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Session Complete</p>
            <p className="text-6xl font-bold mb-1 text-gradient">{known.size}/{flashcards.length}</p>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>cards marked as known</p>
            <div className="grid gap-2.5">
              <button onClick={() => { setCardIndex(0); setCardFlipped(false); setKnown(new Set()); setCardsFinished(false); }}
                className="btn-primary w-full">Review Again</button>
              <button onClick={resetToUpload} className="btn-secondary w-full">Upload New Files</button>
            </div>
          </div>
        </div>
      </main>
    );

    return (
      <main className="relative min-h-screen">
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-20" />
        <div className="relative max-w-xl mx-auto px-5 py-14">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>{cardIndex + 1} / {flashcards.length}</span>
            <span className="text-xs font-semibold" style={{ color: "#86efac" }}>{known.size} known</span>
          </div>
          <div className="w-full h-1 rounded-full mb-8 overflow-hidden" style={{ background: "var(--surface-2)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(cardIndex / flashcards.length) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#06b6d4)" }} />
          </div>

          <button onClick={() => setCardFlipped((f) => !f)}
            className="w-full rounded-2xl p-10 text-center cursor-pointer mb-4 min-h-[220px] flex flex-col items-center justify-center gap-3 transition-all"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 0 40px rgba(124,58,237,0.08)" }}>
            <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "rgba(255,255,255,0.2)" }}>
              {cardFlipped ? "BACK — tap to flip" : "FRONT — tap to reveal"}
            </span>
            <p className="text-lg font-medium leading-relaxed" style={{ color: cardFlipped ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.75)" }}>
              {cardFlipped ? card.back : card.front}
            </p>
          </button>

          {cardFlipped ? (
            <div className="grid grid-cols-2 gap-2.5">
              <button onClick={() => {
                if (cardIndex + 1 >= flashcards.length) setCardsFinished(true);
                else { setCardIndex((c) => c + 1); setCardFlipped(false); }
              }} className="btn-secondary" style={{ borderColor: "rgba(239,68,68,0.4)", color: "#fca5a5" }}>
                Still Learning
              </button>
              <button onClick={() => {
                setKnown((p) => new Set([...p, cardIndex]));
                if (cardIndex + 1 >= flashcards.length) setCardsFinished(true);
                else { setCardIndex((c) => c + 1); setCardFlipped(false); }
              }} className="btn-secondary" style={{ borderColor: "rgba(34,197,94,0.4)", color: "#86efac" }}>
                Got It ✓
              </button>
            </div>
          ) : (
            <p className="text-center text-xs mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
              Tap the card to reveal the answer
            </p>
          )}
        </div>
      </main>
    );
  }

  // ── Problems screen ────────────────────────────────────────────────────────
  if (step === "problems") {
    const problem = problems[problemIndex];
    const allDone = problemIndex >= problems.length;

    if (allDone) return (
      <main className="relative min-h-screen">
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-20" />
        <div className="relative max-w-xl mx-auto px-5 py-14">
          <div className="card-glow rounded-2xl p-8 text-center fade-up">
            <div className="text-5xl mb-5">🏆</div>
            <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>All done!</p>
            <p className="text-2xl font-bold mb-1 text-white/90">You solved all {problems.length} problems</p>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>from your uploaded files</p>
            <div className="grid gap-2.5">
              <button onClick={() => { setProblemIndex(0); setUserAnswer(""); setCheckResult(null); setShowHint(false); setShowSteps(false); }}
                className="btn-primary w-full">Start Over</button>
              <button onClick={resetToUpload} className="btn-secondary w-full">Upload New Files</button>
            </div>
          </div>
        </div>
      </main>
    );

    return (
      <main className="relative min-h-screen">
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-20" />
        <div className="relative max-w-xl mx-auto px-5 py-14 space-y-4 fade-up">

          {/* Progress */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
              Problem {problemIndex + 1} / {problems.length}
            </span>
            <button onClick={resetToUpload} className="text-xs transition-colors"
              style={{ color: "rgba(255,255,255,0.2)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.2)"; }}>
              ← Upload new files
            </button>
          </div>
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(problemIndex / problems.length) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#06b6d4)" }} />
          </div>

          {/* Problem card */}
          {!checkResult && (
            <>
              <div className="card-glow rounded-2xl p-6">
                <p className="text-xs font-medium mb-3 tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>PROBLEM</p>
                <p className="text-base leading-relaxed font-medium text-white/85">{problem.problem}</p>
              </div>

              {/* Hint */}
              {!showHint ? (
                <button onClick={() => setShowHint(true)}
                  className="text-sm px-4 py-2 rounded-lg transition-all"
                  style={{ color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.06)" }}>
                  💡 Show hint
                </button>
              ) : (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <span className="font-semibold mr-2" style={{ color: "#a78bfa" }}>Hint</span>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>{problem.hint}</span>
                </div>
              )}

              {/* Answer card */}
              <div className="card-glow rounded-2xl p-5">
                <p className="text-xs font-medium mb-3 tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>YOUR ANSWER</p>

                <textarea
                  ref={textareaRef}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onSelect={saveCursor}
                  onKeyUp={saveCursor}
                  onMouseUp={saveCursor}
                  onFocus={saveCursor}
                  placeholder="Type your answer here…"
                  rows={3}
                  spellCheck={false}
                  className="w-full bg-transparent text-white/80 text-sm resize-none outline-none font-mono"
                  style={{ color: "rgba(255,255,255,0.8)", caretColor: "#a78bfa" }}
                />

                {/* Math keyboard toggle */}
                <div className="mt-3 border-t" style={{ borderColor: "var(--border)" }}>
                  <button
                    onClick={() => setShowKeyboard((v) => !v)}
                    className="flex items-center gap-1.5 text-xs mt-3 mb-2 transition-colors"
                    style={{ color: "rgba(255,255,255,0.3)" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ transform: showKeyboard ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                    MATH SYMBOLS
                  </button>

                  {showKeyboard && (
                    <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
                      {MATH_KEYS.map((key) => (
                        <button
                          key={key.label}
                          onMouseDown={(e) => { e.preventDefault(); insertAtCursor(key.value); }}
                          className="py-2 rounded-lg text-sm font-medium transition-all active:scale-95 select-none"
                          style={{
                            background: "var(--surface-2)",
                            border: "1px solid var(--border)",
                            color: key.label === "⌫" ? "#f87171" : "rgba(255,255,255,0.65)",
                            fontFamily: "monospace",
                          }}>
                          {key.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image upload */}
                <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                  <p className="text-xs mb-3 tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
                    OR UPLOAD A PHOTO OF YOUR WORK
                  </p>
                  <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageChange} className="hidden" />
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Your handwritten work" className="rounded-xl max-h-52 w-auto object-contain" />
                      <button onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                        style={{ background: "rgba(239,68,68,0.9)", color: "white" }}>
                        ×
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => imageInputRef.current?.click()}
                      className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl w-full justify-center transition-all"
                      style={{ border: "1px dashed rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.35)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.4)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      Upload photo
                    </button>
                  )}
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button onClick={submitProblemAnswer} disabled={checking} className="btn-primary w-full">
                {checking ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="15" />
                    </svg>
                    Checking…
                  </>
                ) : "Submit Answer"}
              </button>
            </>
          )}

          {/* Result */}
          {checkResult && (
            <>
              <div className="card-glow rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{checkResult.correct ? "✅" : "❌"}</span>
                  <div>
                    <p className="font-semibold text-white/90">{checkResult.correct ? "Correct!" : "Not quite"}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Answer: <span className="font-mono" style={{ color: "#c4b5fd" }}>{checkResult.correctAnswer}</span>
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{checkResult.feedback}</p>
              </div>

              {/* Problem recap */}
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-medium mb-1 tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>PROBLEM</p>
                <p style={{ color: "rgba(255,255,255,0.5)" }}>{problem.problem}</p>
              </div>

              {/* Step-by-step */}
              <div>
                <button
                  onClick={() => setShowSteps((v) => !v)}
                  className="flex items-center justify-between gap-2 text-sm px-4 py-3 rounded-xl w-full transition-all"
                  style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", color: "#c4b5fd" }}>
                  <span>Step-by-step solution</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ transform: showSteps ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {showSteps && (
                  <div className="mt-2 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.15)" }}>
                    {checkResult.steps.map((s, i) => (
                      <div key={i} className="px-4 py-3 text-sm flex gap-3 items-start"
                        style={{
                          background: i % 2 === 0 ? "rgba(139,92,246,0.05)" : "transparent",
                          borderBottom: i < checkResult.steps.length - 1 ? "1px solid rgba(139,92,246,0.08)" : "none",
                        }}>
                        <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                          style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa" }}>
                          {i + 1}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.7)" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={nextProblem} className="btn-primary w-full">
                {problemIndex + 1 >= problems.length ? "Finish" : "Next Problem"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </main>
    );
  }

  // ── Lesson screen ──────────────────────────────────────────────────────────
  if (step === "lesson" && lesson) return (
    <main className="relative min-h-screen">
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-20" />
      <div className="relative max-w-2xl mx-auto px-5 py-14 space-y-6 fade-up">
        <div>
          <p className="text-xs font-medium mb-1 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
            Generated from {files.length} file{files.length > 1 ? "s" : ""}
          </p>
          <h1 className="text-2xl font-bold text-white/90 mb-3">{lesson.title}</h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{lesson.intro}</p>
        </div>

        <div className="space-y-4">
          {lesson.sections.map((s, i) => (
            <div key={i} className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h2 className="font-semibold text-white/85 mb-2">{s.heading}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{s.content}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-5" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <h2 className="font-semibold text-violet-300 mb-2 text-sm">Key Takeaways</h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{lesson.summary}</p>
        </div>

        {lesson.keyTerms?.length > 0 && (
          <div>
            <h2 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Key Terms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lesson.keyTerms.map((item, i) => (
                <div key={i} className="rounded-lg p-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <p className="text-sm font-semibold text-white/80">{item.term}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{item.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={resetToUpload} className="btn-secondary w-full">Upload New Files</button>
      </div>
    </main>
  );

  return null;
}

export default function UploadPage() {
  return (
    <Suspense>
      <UploadContent />
    </Suspense>
  );
}
