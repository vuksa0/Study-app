"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { getSubject, subjects as builtinSubjects } from "@/lib/subjects";
import { getCustomSubjects } from "@/lib/custom-subjects";
import type { Subject } from "@/lib/subjects";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { BookOpen, Zap, FileText, Calculator, Upload, X, ChevronDown, ArrowRight, Camera } from "lucide-react";
import { Spinner } from "@/components/ui/ios-spinner";

// ── Function graph helpers ─────────────────────────────────────────────────
function extractFunctionExpr(text: string): string | null {
  const match = text.match(/[fghy]\s*\(\s*x\s*\)\s*=\s*([^\n,;]+)|y\s*=\s*([^\n,;]+)/i);
  if (!match) return null;
  return (match[1] || match[2]).trim().split(" ")[0] + (match[1] || match[2]).trim().slice(((match[1] || match[2]).trim().split(" ")[0]).length);
}

function evalFn(expr: string, x: number): number | null {
  try {
    const safe = expr
      .replace(/\^/g, "**")
      .replace(/(\d)(x)/g, "$1*x")
      .replace(/(x)(\()/g, "x*(")
      .replace(/(\d)\(/g, "$1*(")
      .replace(/\bsin\b/g, "Math.sin")
      .replace(/\bcos\b/g, "Math.cos")
      .replace(/\btan\b/g, "Math.tan")
      .replace(/\bsqrt\b/g, "Math.sqrt")
      .replace(/\babs\b/g, "Math.abs")
      .replace(/\bln\b/g, "Math.log")
      .replace(/\blog\b/g, "Math.log10")
      .replace(/\bπ\b/g, "Math.PI")
      .replace(/\be\b/g, "Math.E");
    // eslint-disable-next-line no-new-func
    const fn = new Function("x", `"use strict"; return (${safe});`);
    const r = fn(x);
    return typeof r === "number" && isFinite(r) ? r : null;
  } catch { return null; }
}

function FunctionGraph({ expr }: { expr: string }) {
  const W = 280, H = 180, PAD = 28;
  const xMin = -6, xMax = 6, STEPS = 300;

  const pts: [number, number][] = [];
  for (let i = 0; i <= STEPS; i++) {
    const x = xMin + (xMax - xMin) * (i / STEPS);
    const y = evalFn(expr, x);
    if (y !== null) pts.push([x, y]);
  }
  if (pts.length < 2) return null;

  const ys = pts.map((p) => p[1]);
  let yMin = Math.max(Math.min(...ys), -15);
  let yMax = Math.min(Math.max(...ys), 15);
  if (yMax - yMin < 0.01) { yMin -= 1; yMax += 1; }

  const sx = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD);
  const sy = (y: number) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD);

  const segments: string[] = [];
  let seg = "";
  let prevSy: number | null = null;
  for (const [x, y] of pts) {
    const cx = sx(x), cy = sy(y);
    if (!isFinite(cy) || cy < -5 || cy > H + 5 || (prevSy !== null && Math.abs(cy - prevSy) > H * 0.6)) {
      if (seg) { segments.push(seg); seg = ""; }
    } else {
      seg += seg ? ` L${cx.toFixed(1)},${cy.toFixed(1)}` : `M${cx.toFixed(1)},${cy.toFixed(1)}`;
    }
    prevSy = cy;
  }
  if (seg) segments.push(seg);

  const zx = sx(0), zy = sy(0);

  return (
    <svg width={W} height={H} className="w-full rounded-xl"
      style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
      viewBox={`0 0 ${W} ${H}`}>
      {[-4,-2,0,2,4].map((v) => (
        <g key={v}>
          <line x1={sx(v)} y1={PAD} x2={sx(v)} y2={H-PAD} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
          <line x1={PAD} y1={sy(v > yMax || v < yMin ? 0 : v)} x2={W-PAD} y2={sy(v > yMax || v < yMin ? 0 : v)} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
        </g>
      ))}
      {zx >= PAD && zx <= W-PAD && <line x1={zx} y1={PAD} x2={zx} y2={H-PAD} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>}
      {zy >= PAD && zy <= H-PAD && <line x1={PAD} y1={zy} x2={W-PAD} y2={zy} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>}
      <text x={W-PAD+3} y={zy+4} fontSize="9" fill="rgba(0,0,0,0.3)">x</text>
      <text x={zx+3} y={PAD-5} fontSize="9" fill="rgba(0,0,0,0.3)">y</text>
      {segments.map((d, i) => <path key={i} d={d} fill="none" stroke="#895af6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>)}
    </svg>
  );
}

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

const MODE_CONFIG: { id: Mode; label: string; icon: React.ReactNode; subjects?: string[] }[] = [
  { id: "quiz",       label: "Quiz",        icon: <Zap className="h-4 w-4" /> },
  { id: "flashcards", label: "Flashcards",  icon: <FileText className="h-4 w-4" /> },
  { id: "lesson",     label: "Lesson",      icon: <BookOpen className="h-4 w-4" /> },
  { id: "problems",   label: "Problems",    icon: <Calculator className="h-4 w-4" />, subjects: ["mathematics","chemistry","physics","biology","computer-science"] },
];

function LessonView({ lesson, files, onReset }: { lesson: LessonData; files: File[]; onReset: () => void }) {
  const [openSections, setOpenSections] = useState<Set<number>>(() => new Set([0]));
  const [readSections, setReadSections] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(i)) { next.delete(i); }
      else { next.add(i); setReadSections(r => new Set(r).add(i)); }
      return next;
    });
  }

  const progress = Math.round(((readSections.size + (openSections.has(0) ? 1 : 0)) / lesson.sections.length) * 100);

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />

      {/* Reading progress bar */}
      <div className="sticky top-16 z-40 h-1 bg-[#F1F5F9] dark:bg-[#2D3748]">
        <div
          className="h-full bg-[#111111] transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">

        {/* Header */}
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#94A3B8]">
            Lesson · {files.length} file{files.length > 1 ? "s" : ""}
          </p>
          <h1 className="text-3xl font-black text-[#111111] dark:text-white mb-4 leading-tight">{lesson.title}</h1>
          <p className="text-base leading-relaxed text-[#475569] dark:text-[#94A3B8]">{lesson.intro}</p>
          <div className="mt-5 flex items-center gap-2 text-xs text-[#94A3B8]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#94A3B8]" />
            {lesson.sections.length} sections
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#94A3B8]" />
            {lesson.keyTerms?.length ?? 0} key terms
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {lesson.sections.map((s, i) => {
            const isOpen = openSections.has(i);
            const isRead = readSections.has(i) || (i === 0 && openSections.has(0));
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? "border-[#111111] dark:border-white" : "border-[#E2E8F0] dark:border-[#2D3748]"}`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-[#F8FAFC] dark:hover:bg-[#1A1A1A] transition-colors"
                >
                  <div className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-xs font-black transition-colors ${isRead ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]" : "bg-[#F1F5F9] dark:bg-[#2D3748] text-[#94A3B8]"}`}>
                    {isRead ? "✓" : i + 1}
                  </div>
                  <span className="flex-1 font-bold text-[#111111] dark:text-white text-sm">{s.heading}</span>
                  <ChevronDown className={`h-4 w-4 text-[#94A3B8] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <div className="ml-12 border-l-2 border-[#E2E8F0] dark:border-[#2D3748] pl-4">
                      <p className="text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8]">{s.content}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Key Takeaways */}
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-4">Key Takeaways</h2>
          <ul className="space-y-2">
            {lesson.summary.split(/\.\s+/).filter(Boolean).map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#475569] dark:text-[#94A3B8]">
                <span className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-[#111111] dark:bg-white flex items-center justify-center">
                  <span className="text-white dark:text-[#111111] text-[8px] font-black">{i + 1}</span>
                </span>
                {point.endsWith(".") ? point : point + "."}
              </li>
            ))}
          </ul>
        </div>

        {/* Key Terms */}
        {lesson.keyTerms?.length > 0 && (
          <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#94A3B8]">Glossary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lesson.keyTerms.map((item, i) => (
                <div key={i} className="group rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#111111] p-4 hover:border-[#111111] dark:hover:border-white transition-colors cursor-default">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-[10px] font-black text-[#94A3B8] uppercase tracking-wider bg-[#F1F5F9] dark:bg-[#2D3748] rounded px-1.5 py-0.5">term</span>
                    <div>
                      <p className="text-sm font-bold text-[#111111] dark:text-white">{item.term}</p>
                      <p className="text-xs mt-1 text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{item.definition}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <InteractiveHoverButton variant="light" text="Upload New Files" className="w-full justify-center h-12" onClick={onReset} />
      </div>
      <Footer />
    </div>
  );
}

function UploadContent() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subject");
  const modeParam = searchParams.get("mode") as Mode | null;
  const [subject, setSubject] = useState<Subject | null>(null);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const plan = (user?.publicMetadata?.plan as string) ?? "free";
  const isAdvancedFlashcards = plan === "plus" || plan === "monthly" || plan === "annual" || plan === "pro";
  const isProPlan = plan === "pro";

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
  const [mode, setMode] = useState<Mode>(modeParam ?? "quiz");
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

  const [questions, setQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);

  const [quizCurrent, setQuizCurrent] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [cardsFinished, setCardsFinished] = useState(false);
  const [cardConfidence, setCardConfidence] = useState<Record<number, "again" | "hard" | "easy">>({});
  const [reviewQueue, setReviewQueue] = useState<number[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

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
    if (!userAnswer.trim() && !imageFile) { setError("Upiši odgovor ili učitaj sliku rešenja."); return; }
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
    setUserAnswer(""); setCheckResult(null);
    setShowHint(false); setShowSteps(false);
    setImageFile(null); setImagePreview(null);
    setError("");
  }

  async function saveToLibrary(type: Mode, data: unknown, title: string) {
    if (!isSignedIn) return;
    try {
      await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, subject_id: subject?.id ?? null, subject_name: subject?.name ?? null, title, data }),
      });
    } catch { /* silent fail */ }
  }

  async function handleGenerate() {
    if (!subject && !files.length) { setError("Pick a subject or upload a file first."); return; }
    setError("");
    setStep("generating");

    const subjectLabel = subject?.name ?? (files.length ? files.map((f) => f.name).join(", ") : "Custom");
    const topicIds = subject ? Array.from(selectedTopics) : [];
    const firstTopicId = topicIds[0] ?? null;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any;

      if (files.length) {
        // ── Upload path: send files to generate-from-file ──────────────────
        const fd = new FormData();
        fd.append("mode", mode);
        fd.append("count", String(count));
        if (subject) fd.append("subject", subject.name);
        if (topicIds.length > 0) {
          const topicNames = subject?.topics.filter((t) => selectedTopics.has(t.id)).map((t) => t.name) ?? [];
          fd.append("topics", topicNames.join(", "));
        }
        files.forEach((f) => fd.append("files", f));
        const res = await fetch("/api/generate-from-file", { method: "POST", body: fd });
        try { data = await res.json(); } catch { throw new Error(`Server error (${res.status}). Please try again.`); }
        if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : (data.error?.message ?? "Generation failed"));
      } else {
        // ── No-upload path: use subject-based APIs directly ─────────────────
        const body = {
          subjectId: subject!.id,
          topicId: firstTopicId,
          subjectName: subject!.name,
          topicName: firstTopicId ? subject!.topics.find((t) => t.id === firstTopicId)?.name : null,
          topicDescription: firstTopicId ? subject!.topics.find((t) => t.id === firstTopicId)?.description : null,
          count,
        };
        const apiRoute =
          mode === "quiz"       ? "/api/generate-quiz"       :
          mode === "flashcards" ? "/api/generate-flashcards" :
          mode === "problems"   ? "/api/generate-problem"    :
                                  "/api/generate-lesson";
        const res = await fetch(apiRoute, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        try { data = await res.json(); } catch { throw new Error(`Server error (${res.status}). Please try again.`); }
        if (!res.ok) throw new Error(data.error ?? "Generation failed");
        // generate-problem returns a single problem; wrap it for consistency
        if (mode === "problems" && data.problem) data.problems = [data.problem];
      }

      if (mode === "quiz") {
        setQuestions(data.questions ?? []);
        setQuizCurrent(0); setQuizSelected(null); setQuizRevealed(false);
        setQuizScore(0); setQuizFinished(false);
        setStep("quiz");
        saveToLibrary("quiz", { questions: data.questions }, `${subjectLabel} Quiz`);
      } else if (mode === "flashcards") {
        setFlashcards(data.flashcards ?? []);
        setCardIndex(0); setCardFlipped(false);
        setKnown(new Set()); setCardsFinished(false);
        setStep("flashcards");
        saveToLibrary("flashcards", { flashcards: data.flashcards }, `${subjectLabel} Flashcards`);
      } else if (mode === "problems") {
        setProblems(data.problems ?? []);
        setProblemIndex(0); setUserAnswer(""); setCheckResult(null);
        setShowHint(false); setShowSteps(false);
        setStep("problems");
        saveToLibrary("problems", { problems: data.problems }, `${subjectLabel} Problems`);
      } else {
        setLesson(data.lesson ?? null);
        setStep("lesson");
        saveToLibrary("lesson", { lesson: data.lesson }, data.lesson?.title ?? `${subjectLabel} Lesson`);
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

  const availableModes = MODE_CONFIG.filter((m) =>
    !m.subjects || (subject && m.subjects.includes(subject.id))
  );

  // ── Pick subject screen ──────────────────────────────────────────────────
  if (step === "pick-subject") return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-4xl font-black tracking-[-0.02em] text-[#111111] dark:text-white md:text-5xl">Pick a Subject</h1>
          <p className="text-[#64748B] dark:text-[#94A3B8]">Choose which subject you&apos;re uploading notes for.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 mb-8">
          {allSubjects.map((s) => (
            <button key={s.id} onClick={() => { setSubject(s); setStep("upload"); }}
              className="group flex flex-col rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-5 text-left transition-all hover:border-[#CBD5E1] hover:shadow-md">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5F9] dark:bg-[#2D3748]">
                <BookOpen className="h-5 w-5 text-[#111111] dark:text-white" />
              </div>
              <p className="font-bold text-[#111111] dark:text-white text-sm">{s.name}</p>
              <p className="text-xs mt-0.5 text-[#94A3B8]">{s.topics.length} topics</p>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button onClick={() => { setSubject(null); setStep("upload"); }}
            className="text-sm text-[#94A3B8] hover:text-[#64748B] transition-colors">
            Skip — upload without a subject
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );

  // ── Upload screen ────────────────────────────────────────────────────────
  if (step === "upload") return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-4xl font-black tracking-[-0.02em] text-[#111111] dark:text-white">Upload Materials</h1>
          <p className="text-[#64748B] dark:text-[#94A3B8]">Transform your notes into interactive study sessions</p>
        </div>

        {/* Subject badge */}
        {subject ? (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] px-5 py-3.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#111111] dark:bg-white">
              <BookOpen className="h-4 w-4 text-white dark:text-[#111111]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#94A3B8]">Subject</p>
              <p className="font-bold text-[#111111] dark:text-white text-sm">{subject.name}</p>
            </div>
            <button onClick={() => setStep("pick-subject")} className="text-xs text-[#94A3B8] hover:text-[#64748B] dark:hover:text-[#94A3B8] transition-colors">
              Change
            </button>
          </div>
        ) : (
          <div className="mb-5">
            <button onClick={() => setStep("pick-subject")} className="text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white transition-colors underline underline-offset-2">
              + Pick a subject (optional)
            </button>
          </div>
        )}

        {/* Topic multi-select */}
        {subject && subject.topics.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#94A3B8] dark:text-[#94A3B8]">Topic (pick one or more)</p>
            <div className="flex flex-wrap gap-2">
              {subject.topics.map((t) => {
                const active = selectedTopics.has(t.id);
                return (
                  <button key={t.id} onClick={() => toggleTopic(t.id)}
                    className="rounded-full px-3 py-1.5 text-sm font-medium transition-all border"
                    style={active
                      ? { background: "#111111", border: "1px solid #111111", color: "#fff" }
                      : { background: "white", border: "1px solid #E2E8F0", color: "#64748B" }}>
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="mb-4 flex cursor-pointer flex-col items-center justify-center gap-5 rounded-3xl border-2 border-dashed px-6 py-16 transition-all"
          style={{
            borderColor: dragging ? "#895af6" : "#E2E8F0",
            background: dragging ? "rgba(137,90,246,0.03)" : files.length ? "#F8FAFC" : "white",
          }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F5F9] dark:bg-[#2D3748]">
            <Upload className="h-6 w-6 text-[#111111] dark:text-white" />
          </div>
          <div className="text-center">
            <p className="font-bold text-[#111111] dark:text-white">
              {files.length ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Drop PDF or paste text here"}
            </p>
            <p className="mt-1 text-sm text-[#94A3B8]">Optional — skip to generate from subject only · Max 20MB</p>
          </div>
          <InteractiveHoverButton
            text="Select File"
            variant="dark"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="px-8"
          />
          <input ref={fileInputRef} type="file" multiple accept={ACCEPTED} className="hidden"
            onChange={(e) => addFiles(e.target.files)} />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748]">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 text-sm"
                style={{ borderBottom: i < files.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                <span className="truncate mr-3 text-[#111111] dark:text-white font-medium">{f.name}</span>
                <span className="text-xs shrink-0 mr-3 text-[#94A3B8]">
                  {f.size < 1024 ? `${f.size} B` : f.size < 1048576 ? `${(f.size / 1024).toFixed(0)} KB` : `${(f.size / 1048576).toFixed(1)} MB`}
                </span>
                <button onClick={(e) => { e.stopPropagation(); setFiles((p) => p.filter((_, j) => j !== i)); }}
                  className="text-[#CBD5E1] hover:text-red-400 transition-colors shrink-0">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Mode Selector */}
        <div className="mb-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#94A3B8] dark:text-[#94A3B8]">Study Mode</p>
          <div className={`grid gap-2 ${availableModes.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
            {availableModes.map((m) => (
              <button key={m.id} onClick={() => setMode(m.id)}
                className="flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-sm font-medium transition-all border"
                style={mode === m.id
                  ? { background: "#111111", borderColor: "#111111", color: "white" }
                  : { background: "white", borderColor: "#E2E8F0", color: "#64748B" }}>
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        {mode !== "lesson" && (
          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#94A3B8]">
              {mode === "quiz" ? "Number of questions" : mode === "problems" ? "Number of problems" : "Number of cards"}
            </p>
            <div className="flex gap-2">
              {COUNT_OPTIONS.map((n) => (
                <button key={n} onClick={() => setCount(n)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border"
                  style={{
                    borderColor: count === n ? "#111111" : "#E2E8F0",
                    background: count === n ? "#111111" : "white",
                    color: count === n ? "white" : "#64748B",
                  }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generate */}
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <button
          onClick={handleGenerate}
          disabled={!subject && !files.length}
          className="group relative w-full h-14 overflow-hidden rounded-full border border-[#111111] bg-[#111111] text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 group-disabled:translate-x-0 group-disabled:opacity-100">
            Generate {mode === "quiz" ? "Quiz" : mode === "flashcards" ? "Flash Cards" : mode === "problems" ? "Problems" : "Lesson"} ✦
          </span>
          <div className="absolute inset-0 z-10 flex translate-x-12 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 group-disabled:hidden">
            <span>Generate {mode === "quiz" ? "Quiz" : mode === "flashcards" ? "Flash Cards" : mode === "problems" ? "Problems" : "Lesson"}</span>
            <ArrowRight className="h-4 w-4" />
          </div>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white/30 transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:translate-y-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-white/10" />
        </button>
        <p className="mt-3 text-center text-xs text-[#94A3B8] dark:text-[#94A3B8]">AI processes your materials in seconds</p>
      </div>
      <Footer />
    </div>
  );

  // ── Generating screen ────────────────────────────────────────────────────
  if (step === "generating") return (
    <div className="min-h-screen bg-white dark:bg-[#111111] flex flex-col">
      <Navigation />
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-6 flex items-center justify-center">
            <Spinner size="lg" className="h-12 w-12 text-[#111111] dark:text-white" />
          </div>
          <h2 className="mb-2 text-xl font-black text-[#111111] dark:text-white">Generating your {mode}…</h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Analyzing {files.length} file{files.length > 1 ? "s" : ""}</p>
        </div>
      </div>
    </div>
  );

  // ── Quiz screen ──────────────────────────────────────────────────────────
  if (step === "quiz") {
    const q = questions[quizCurrent];
    const pct = Math.round((quizScore / questions.length) * 100);

    if (quizFinished) return (
      <div className="min-h-screen bg-white dark:bg-[#111111]">
        <Navigation />
        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <div className="rounded-3xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-10 shadow-sm">
            <p className="mb-1 text-sm text-[#94A3B8]">Quiz Complete</p>
            <p className="mb-1 text-7xl font-black text-[#111111] dark:text-white">{pct}%</p>
            <p className="mb-8 text-sm text-[#64748B] dark:text-[#94A3B8]">{quizScore} of {questions.length} correct</p>
            <div className="flex flex-col gap-3">
              <InteractiveHoverButton variant="dark" text="Retry Quiz" className="w-full justify-center h-12"
                onClick={() => { setQuizCurrent(0); setQuizSelected(null); setQuizRevealed(false); setQuizScore(0); setQuizFinished(false); }} />
              <InteractiveHoverButton variant="light" text="Upload New Files" className="w-full justify-center h-12" onClick={resetToUpload} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );

    return (
      <div className="min-h-screen bg-white dark:bg-[#111111]">
        <Navigation />
        <div className="mx-auto max-w-2xl px-6 py-10">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-[#94A3B8]">{quizCurrent + 1} / {questions.length}</span>
            <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">{quizScore} correct</span>
          </div>
          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9] dark:bg-[#2D3748]">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(quizCurrent / questions.length) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#06b6d4)" }} />
          </div>

          <div className="mb-5 rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-6">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Question {quizCurrent + 1}</p>
            <p className="text-base font-semibold leading-relaxed text-[#111111] dark:text-white">{q.question}</p>
          </div>

          <div className="mb-5 flex flex-col gap-2.5">
            {q.options.map((opt, idx) => {
              let bg = "white", border = "#E2E8F0", color = "#111111";
              if (quizRevealed) {
                if (idx === q.answer) { bg = "#f0fdf4"; border = "#86efac"; color = "#15803d"; }
                else if (idx === quizSelected) { bg = "#fef2f2"; border = "#fca5a5"; color = "#b91c1c"; }
                else { color = "#94A3B8"; }
              }
              return (
                <button key={idx} disabled={quizRevealed}
                  onClick={() => {
                    if (quizRevealed) return;
                    setQuizSelected(idx); setQuizRevealed(true);
                    if (idx === q.answer) setQuizScore((s) => s + 1);
                  }}
                  className="w-full text-left px-5 py-3.5 rounded-2xl text-sm font-medium transition-all border"
                  style={{ background: bg, borderColor: border, color, cursor: quizRevealed ? "default" : "pointer" }}>
                  {opt}
                </button>
              );
            })}
          </div>

          {quizRevealed && (
            <>
              <div className="mb-5 rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-4 text-sm">
                <span className="font-bold text-[#111111] dark:text-white">Explanation — </span>
                <span className="text-[#64748B] dark:text-[#94A3B8]">{q.explanation}</span>
              </div>
              <InteractiveHoverButton variant="dark" className="w-full justify-center h-12"
                text={quizCurrent + 1 >= questions.length ? "See Results" : "Next Question"}
                onClick={() => {
                  if (quizCurrent + 1 >= questions.length) setQuizFinished(true);
                  else { setQuizCurrent((c) => c + 1); setQuizSelected(null); setQuizRevealed(false); }
                }} />
            </>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  // ── Flashcards screen ────────────────────────────────────────────────────
  if (step === "flashcards") {
    // Determine current deck
    const deck = reviewMode ? reviewQueue : flashcards.map((_, i) => i);
    const currentDeckIndex = reviewMode ? reviewIndex : cardIndex;
    const actualCardIndex = deck[currentDeckIndex];
    const card = flashcards[actualCardIndex];

    function handleConfidence(conf: "again" | "hard" | "easy") {
      setCardConfidence((prev) => ({ ...prev, [actualCardIndex]: conf }));
      if (conf === "again" && !reviewMode) {
        setReviewQueue((q) => [...q, actualCardIndex]);
      }
      if (conf !== "again") {
        setKnown((p) => new Set([...p, actualCardIndex]));
      }
      const nextIndex = currentDeckIndex + 1;
      if (nextIndex >= deck.length) {
        setCardsFinished(true);
      } else {
        if (reviewMode) setReviewIndex(nextIndex);
        else setCardIndex(nextIndex);
        setCardFlipped(false);
      }
    }

    if (cardsFinished) {
      const againCount = Object.values(cardConfidence).filter(v => v === "again").length;
      const hardCount = Object.values(cardConfidence).filter(v => v === "hard").length;
      const easyCount = Object.values(cardConfidence).filter(v => v === "easy").length;
      const knownCount = known.size;

      return (
        <div className="min-h-screen bg-white dark:bg-[#111111]">
          <Navigation />
          <div className="mx-auto max-w-xl px-6 py-16 text-center">
            <div className="rounded-3xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-10 shadow-sm">
              <p className="mb-1 text-sm text-[#94A3B8]">Session Complete</p>
              <p className="mb-1 text-7xl font-black text-[#111111] dark:text-white">{knownCount}/{flashcards.length}</p>
              <p className="mb-6 text-sm text-[#64748B] dark:text-[#94A3B8]">cards marked as known</p>
              {isAdvancedFlashcards && (
                <div className="flex justify-center gap-4 mb-8">
                  <div className="text-center">
                    <p className="text-2xl font-black text-green-600">{easyCount}</p>
                    <p className="text-xs text-[#94A3B8]">Easy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-orange-500">{hardCount}</p>
                    <p className="text-xs text-[#94A3B8]">Hard</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-red-500">{againCount}</p>
                    <p className="text-xs text-[#94A3B8]">Again</p>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-3">
                {isAdvancedFlashcards && reviewQueue.length > 0 && !reviewMode && (
                  <InteractiveHoverButton variant="dark" text={`Review ${reviewQueue.length} "Again" cards`} className="w-full justify-center h-12"
                    onClick={() => { setReviewMode(true); setReviewIndex(0); setCardFlipped(false); setCardsFinished(false); }} />
                )}
                <InteractiveHoverButton variant="dark" text="Review Again" className="w-full justify-center h-12"
                  onClick={() => {
                    setCardIndex(0); setCardFlipped(false); setKnown(new Set());
                    setCardsFinished(false); setCardConfidence({}); setReviewQueue([]); setReviewMode(false); setReviewIndex(0);
                  }} />
                {isProPlan && (
                  <button
                    onClick={() => {
                      const text = flashcards.map((c, i) => `Card ${i + 1}\nQ: ${c.front}\nA: ${c.back}`).join("\n\n");
                      const blob = new Blob([text], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a"); a.href = url; a.download = "flashcards.txt"; a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full rounded-full border border-[#E2E8F0] dark:border-[#2D3748] py-3 text-sm font-bold text-[#64748B] dark:text-[#94A3B8] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white transition-colors"
                  >
                    Export as .txt
                  </button>
                )}
                <button onClick={() => setStep("upload")} className="text-sm text-[#94A3B8] hover:text-[#64748B] transition-colors">
                  Start over
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white dark:bg-[#111111]">
        <Navigation />
        <div className="mx-auto max-w-2xl px-6 py-10">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-[#94A3B8]">{currentDeckIndex + 1} / {deck.length}{reviewMode ? " (review)" : ""}</span>
            <span className="text-xs font-semibold text-green-600">{known.size} known</span>
          </div>
          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9] dark:bg-[#2D3748]">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(currentDeckIndex / deck.length) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#06b6d4)" }} />
          </div>

          <button onClick={() => setCardFlipped((f) => !f)}
            className="w-full rounded-3xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-10 text-center cursor-pointer mb-4 min-h-[220px] flex flex-col items-center justify-center gap-3 transition-all hover:border-[#CBD5E1] hover:shadow-md shadow-sm">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#94A3B8]">
              {cardFlipped ? "BACK — tap to flip" : "FRONT — tap to reveal"}
            </span>
            <p className="text-lg font-semibold leading-relaxed text-[#111111] dark:text-white">
              {cardFlipped ? card.back : card.front}
            </p>
          </button>

          {cardFlipped ? (
            isAdvancedFlashcards ? (
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => handleConfidence("again")}
                  className="rounded-full border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors">
                  Again
                </button>
                <button onClick={() => handleConfidence("hard")}
                  className="rounded-full border border-orange-200 bg-orange-50 py-3 text-sm font-bold text-orange-500 hover:bg-orange-100 transition-colors">
                  Hard
                </button>
                <button onClick={() => handleConfidence("easy")}
                  className="rounded-full border border-green-200 bg-green-50 py-3 text-sm font-bold text-green-600 hover:bg-green-100 transition-colors">
                  Easy ✓
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => {
                  if (cardIndex + 1 >= flashcards.length) setCardsFinished(true);
                  else { setCardIndex((c) => c + 1); setCardFlipped(false); }
                }} className="rounded-full border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors">
                  Still Learning
                </button>
                <button onClick={() => {
                  setKnown((p) => new Set([...p, cardIndex]));
                  if (cardIndex + 1 >= flashcards.length) setCardsFinished(true);
                  else { setCardIndex((c) => c + 1); setCardFlipped(false); }
                }} className="rounded-full border border-green-200 bg-green-50 py-3 text-sm font-bold text-green-600 hover:bg-green-100 transition-colors">
                  Got It ✓
                </button>
              </div>
            )
          ) : (
            <p className="text-center text-xs text-[#94A3B8]">Tap the card to reveal the answer</p>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  // ── Problems screen ──────────────────────────────────────────────────────
  if (step === "problems") {
    const problem = problems[problemIndex];
    const allDone = problemIndex >= problems.length;

    if (allDone) return (
      <div className="min-h-screen bg-white dark:bg-[#111111]">
        <Navigation />
        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <div className="rounded-3xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-10 shadow-sm">
            <p className="mb-2 text-sm text-[#94A3B8]">All done!</p>
            <p className="mb-1 text-2xl font-black text-[#111111] dark:text-white">You solved all {problems.length} problems</p>
            <p className="mb-8 text-sm text-[#64748B] dark:text-[#94A3B8]">from your uploaded files</p>
            <div className="flex flex-col gap-3">
              <InteractiveHoverButton variant="dark" text="Start Over" className="w-full justify-center h-12"
                onClick={() => { setProblemIndex(0); setUserAnswer(""); setCheckResult(null); setShowHint(false); setShowSteps(false); }} />
              <InteractiveHoverButton variant="light" text="Upload New Files" className="w-full justify-center h-12" onClick={resetToUpload} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );

    return (
      <div className="min-h-screen bg-white dark:bg-[#111111]">
        <Navigation />
        <div className="mx-auto max-w-2xl px-6 py-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#94A3B8]">Problem {problemIndex + 1} / {problems.length}</span>
            <button onClick={resetToUpload} className="text-xs text-[#94A3B8] hover:text-[#64748B] dark:hover:text-[#94A3B8] transition-colors">
              ← Upload new files
            </button>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9] dark:bg-[#2D3748]">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(problemIndex / problems.length) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#06b6d4)" }} />
          </div>

          {!checkResult && (
            <>
              <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#94A3B8]">Problem</p>
                <p className="text-base font-semibold leading-relaxed text-[#111111] dark:text-white">{problem.problem}</p>
                {(() => { const fn = extractFunctionExpr(problem.problem); return fn ? <div className="mt-4"><FunctionGraph expr={fn} /></div> : null; })()}
              </div>

              {!showHint ? (
                <button onClick={() => setShowHint(true)}
                  className="text-sm px-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] text-[#64748B] dark:text-[#94A3B8] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1A1A1A] transition-all">
                  Show hint
                </button>
              ) : (
                <div className="rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] px-4 py-3 text-sm">
                  <span className="font-bold text-[#111111] dark:text-white">Hint — </span>
                  <span className="text-[#64748B] dark:text-[#94A3B8]">{problem.hint}</span>
                </div>
              )}

              <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#94A3B8]">Your Answer</p>
                <textarea
                  ref={textareaRef}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onSelect={saveCursor} onKeyUp={saveCursor} onMouseUp={saveCursor} onFocus={saveCursor}
                  placeholder="Type your answer here…"
                  rows={3}
                  spellCheck={false}
                  className="w-full bg-transparent text-[#111111] dark:text-white text-sm resize-none outline-none font-mono placeholder:text-[#CBD5E1] dark:placeholder:text-[#4B5563]"
                />

                <div className="mt-3 border-t border-[#F1F5F9] dark:border-[#2D3748]">
                  <button onClick={() => setShowKeyboard((v) => !v)}
                    className="flex items-center gap-1.5 text-xs mt-3 mb-2 text-[#94A3B8] hover:text-[#64748B] dark:hover:text-[#94A3B8] transition-colors">
                    <ChevronDown className="h-3 w-3" style={{ transform: showKeyboard ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    MATH SYMBOLS
                  </button>

                  {showKeyboard && (
                    <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
                      {MATH_KEYS.map((key) => (
                        <button key={key.label}
                          onMouseDown={(e) => { e.preventDefault(); insertAtCursor(key.value); }}
                          className="py-2 rounded-lg text-sm font-medium transition-all active:scale-95 select-none border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#2D3748] hover:bg-[#F1F5F9] dark:hover:bg-[#374151]"
                          style={{ color: key.label === "⌫" ? "#ef4444" : "#111111", fontFamily: "monospace" }}>
                          {key.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 border-t border-[#F1F5F9] dark:border-[#2D3748] pt-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#94A3B8]">OR UPLOAD A PHOTO OF YOUR WORK</p>
                  <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageChange} className="hidden" />
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Your handwritten work" className="rounded-xl max-h-52 w-auto object-contain border border-[#E2E8F0] dark:border-[#2D3748]" />
                      <button onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center bg-red-500 text-white">
                        ×
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => imageInputRef.current?.click()}
                      className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl w-full justify-center transition-all border border-dashed border-[#E2E8F0] dark:border-[#2D3748] text-[#94A3B8] hover:border-[#CBD5E1] hover:text-[#64748B] dark:hover:text-[#94A3B8]">
                      <Camera className="h-4 w-4" />
                      Upload photo
                    </button>
                  )}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <InteractiveHoverButton variant="dark" className="w-full justify-center h-12"
                text={checking ? "Checking…" : "Submit Answer"}
                onClick={submitProblemAnswer}
                disabled={checking} />
            </>
          )}

          {checkResult && (
            <>
              <div className={`rounded-2xl border p-6 ${checkResult.correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${checkResult.correct ? "bg-green-100" : "bg-red-100"}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      style={{ color: checkResult.correct ? "#16a34a" : "#dc2626" }}>
                      {checkResult.correct
                        ? <polyline points="20 6 9 17 4 12"/>
                        : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}
                    </svg>
                  </div>
                  <div>
                    <p className={`font-bold ${checkResult.correct ? "text-green-800" : "text-red-800"}`}>{checkResult.correct ? "Correct!" : "Not quite"}</p>
                    <p className="text-xs mt-0.5 text-[#64748B] dark:text-[#94A3B8]">Answer: <span className="font-mono font-bold text-[#111111] dark:text-white">{checkResult.correctAnswer}</span></p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">{checkResult.feedback}</p>
              </div>

              <div className="rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] px-4 py-3 text-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Problem</p>
                <p className="text-[#64748B] dark:text-[#94A3B8]">{problem.problem}</p>
              </div>

              <div>
                <button onClick={() => setShowSteps((v) => !v)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] px-4 py-3 text-sm font-medium text-[#111111] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#1A1A1A] transition-colors">
                  <span>Step-by-step solution</span>
                  <ChevronDown className="h-4 w-4 text-[#94A3B8]" style={{ transform: showSteps ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>

                {showSteps && (
                  <div className="mt-2 overflow-hidden rounded-xl border border-[#E2E8F0] dark:border-[#2D3748]">
                    {checkResult.steps.map((s, i) => (
                      <div key={i} className="px-4 py-3 text-sm flex gap-3 items-start"
                        style={{ background: i % 2 === 0 ? "#F8FAFC" : "white", borderBottom: i < checkResult.steps.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                        <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-[#111111] dark:bg-white text-white dark:text-[#111111] mt-0.5">{i + 1}</span>
                        <span className="text-[#64748B] dark:text-[#94A3B8]">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <InteractiveHoverButton variant="dark" className="w-full justify-center h-12"
                text={problemIndex + 1 >= problems.length ? "Finish" : "Next Problem"}
                onClick={nextProblem} />
            </>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  // ── Lesson screen ────────────────────────────────────────────────────────
  if (step === "lesson" && lesson) return (
    <LessonView lesson={lesson} files={files} onReset={resetToUpload} />
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
