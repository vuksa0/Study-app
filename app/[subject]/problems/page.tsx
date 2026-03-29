"use client";

import { getSubject, getTopic } from "@/lib/subjects";
import { getCustomSubjects } from "@/lib/custom-subjects";
import { getTestDate } from "@/lib/test-date";
import type { Subject, Topic } from "@/lib/subjects";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Spinner } from "@/components/ui/ios-spinner";
import { MathText } from "@/components/ui/math-text";
import * as math from "mathjs";

interface Problem {
  problem: string;
  hint: string;
  answer: string;
  steps: string[];
}

interface CheckResult {
  correct: boolean;
  feedback: string;
  correctAnswer: string;
  steps: string[];
}

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

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
  { label: "sin", value: "sin(" }, { label: "cos", value: "cos(" }, { label: "tan", value: "tan(" },
  { label: "log", value: "log(" }, { label: "ln", value: "ln(" }, { label: "|x|", value: "|" },
  { label: "sin⁻¹", value: "sin⁻¹(" }, { label: "cos⁻¹", value: "cos⁻¹(" }, { label: "tan⁻¹", value: "tan⁻¹(" },
  { label: "eˣ", value: "e^" }, { label: "!", value: "!" }, { label: "∑", value: "∑" },
];

function ProblemsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subjectId = params.subject as string;
  const topicId = searchParams.get("topic") ?? undefined;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submittedImageBase64, setSubmittedImageBase64] = useState<string | undefined>(undefined);
  const [submittedImageType, setSubmittedImageType] = useState<string | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const { isSignedIn } = useAuth();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cursorPos = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

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

  const generateProblem = useCallback(async () => {
    if (!subject) return;
    setLoading(true);
    setError("");
    setProblem(null);
    setUserAnswer("");
    setResult(null);
    setShowHint(false);
    setShowSteps(false);
    setImageFile(null);
    setImagePreview(null);
    setSubmittedImageBase64(undefined);
    setSubmittedImageType(undefined);
    setSaved(false);

    try {
      const res = await fetch("/api/generate-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          topicId,
          subjectName: subject.name,
          topicName: topic?.name,
          topicDescription: topic?.description,
          difficulty,
          testDate: getTestDate(subjectId),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generating problem");
      setProblem(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [subject, subjectId, topicId, topic, difficulty]);

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
    } else if (value === "=") {
      // Try to evaluate the expression before cursor
      setUserAnswer((prev) => {
        const expr = prev.slice(0, start);
        const after = prev.slice(end);
        // Normalize math symbols for mathjs
        const normalized = expr
          .replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-")
          .replace(/²/g, "^2").replace(/³/g, "^3").replace(/√/g, "sqrt")
          .replace(/π/g, "pi").replace(/∛/g, "cbrt");
        try {
          const result = math.evaluate(normalized);
          const resultStr = typeof result === "number"
            ? (Number.isInteger(result) ? String(result) : String(math.format(result, { precision: 10 })))
            : String(result);
          const newVal = expr + " = " + resultStr + after;
          const newPos = (expr + " = " + resultStr).length;
          cursorPos.current = { start: newPos, end: newPos };
          return newVal;
        } catch {
          // Not a computable expression — just insert "="
          const newVal = prev.slice(0, start) + "=" + after;
          cursorPos.current = { start: start + 1, end: start + 1 };
          return newVal;
        }
      });
      setTimeout(() => {
        const ta = textareaRef.current;
        if (ta) {
          ta.focus();
          ta.setSelectionRange(cursorPos.current.start, cursorPos.current.end);
        }
      }, 0);
      return;
    } else {
      setUserAnswer((prev) => prev.slice(0, start) + value + prev.slice(end));
      cursorPos.current = { start: start + value.length, end: start + value.length };
    }
    setTimeout(() => {
      const ta = textareaRef.current;
      if (ta) {
        ta.focus();
        ta.setSelectionRange(cursorPos.current.start, cursorPos.current.end);
      }
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function submitAnswer() {
    if (!problem) return;
    if (!userAnswer.trim() && !imageFile) {
      setError("Please write an answer or upload a photo of your work.");
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
      setSubmittedImageBase64(imageBase64);
      setSubmittedImageType(imageType);
    }

    try {
      const res = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: problem.problem,
          userAnswer: userAnswer.trim(),
          imageBase64,
          imageType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error checking answer");
      setResult(data);
      setShowSteps(!data.correct);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setChecking(false);
    }
  }

  async function saveProblem() {
    if (!isSignedIn || !subject || !problem || !result || saving || saved) return;
    setSaving(true);
    try {
      await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "problems",
          subject_id: subjectId,
          subject_name: subject.name,
          title: `${subject.name}${topic ? ` · ${topic.name}` : ""} Problem`,
          data: {
            problem,
            userAnswer,
            result,
            imageBase64: submittedImageBase64,
            imageType: submittedImageType,
          },
        }),
      });
      setSaved(true);
    } catch { /* silent */ } finally { setSaving(false); }
  }

  if (!subject) return null;

  return (
    <main className="relative min-h-screen bg-[#111111] text-white">
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-10" />
      <div className="relative max-w-4xl mx-auto px-8 py-14">

        <Link href={`/${subjectId}`}
          className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {subject.name}
        </Link>

        {/* Setup screen */}
        {!problem && !loading && (
          <div className="card-glow rounded-2xl p-8 fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                {subject.emoji}
              </div>
              <div>
                <h1 className="font-semibold text-white/90">{subject.name} — Problems</h1>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {topic ? topic.name : "All topics"} · Solve and check your work
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs mb-3 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>DIFFICULTY</p>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all"
                    style={{
                      border: "1px solid",
                      borderColor: difficulty === d ? "rgba(255,255,255,0.6)" : "var(--border)",
                      background: difficulty === d ? "rgba(255,255,255,0.1)" : "transparent",
                      color: difficulty === d ? "#ffffff" : "rgba(255,255,255,0.4)",
                    }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              Type your answer using the math keyboard, write it out freely, or upload a photo of your handwritten solution.
            </p>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <button onClick={generateProblem} className="btn-primary w-full">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Generate Problem
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="card-glow rounded-2xl p-10 text-center">
            <Spinner size="lg" className="mx-auto mb-4 text-white" />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Generating problem...</p>
          </div>
        )}

        {/* Problem + answer area */}
        {problem && !result && (
          <div className="fade-up space-y-4">
            {/* Problem card */}
            <div className="card-glow rounded-2xl p-6">
              <p className="text-xs font-medium mb-3 tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                PROBLEM · <span className="capitalize">{difficulty}</span>
              </p>
              <MathText className="text-base leading-relaxed font-medium text-white/85">{problem.problem}</MathText>
            </div>

            {/* Hint */}
            {!showHint ? (
              <button onClick={() => setShowHint(true)}
                className="text-sm px-4 py-2 rounded-lg transition-all"
                style={{ color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)" }}>
                💡 Show hint
              </button>
            ) : (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <span className="font-semibold mr-2" style={{ color: "rgba(255,255,255,0.7)" }}>Hint</span>
                <MathText style={{ color: "rgba(255,255,255,0.6)" }}>{problem.hint}</MathText>
              </div>
            )}

            {/* Answer card */}
            <div className="card-glow rounded-2xl p-5">
              <p className="text-xs font-medium mb-3 tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                YOUR ANSWER
              </p>

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
                        onMouseDown={(e) => {
                          e.preventDefault(); // keep textarea focus
                          insertAtCursor(key.value);
                        }}
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Your handwritten work" className="rounded-xl max-h-52 w-auto object-contain" />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                      style={{ background: "rgba(239,68,68,0.9)", color: "white" }}>
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl w-full justify-center transition-all"
                    style={{ border: "1px dashed rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.35)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
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

            <div className="grid grid-cols-2 gap-3">
              <button onClick={generateProblem} className="btn-secondary">New Problem</button>
              <button onClick={submitAnswer} disabled={checking} className="btn-primary">
                {checking ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    Checking…
                  </>
                ) : "Submit Answer"}
              </button>
            </div>
          </div>
        )}

        {/* Result screen */}
        {result && problem && (
          <div className="fade-up space-y-4">
            {/* Verdict */}
            <div className="card-glow rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{result.correct ? "✅" : "❌"}</span>
                <div>
                  <p className="font-semibold text-white/90">{result.correct ? "Correct!" : "Not quite"}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Answer: <MathText className="font-mono" style={{ color: "rgba(255,255,255,0.8)" }}>{result.correctAnswer}</MathText>
                  </p>
                </div>
              </div>
              <MathText className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{result.feedback}</MathText>
            </div>

            {/* Problem recap */}
            <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <p className="text-xs font-medium mb-1 tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>PROBLEM</p>
              <MathText style={{ color: "rgba(255,255,255,0.5)" }}>{problem.problem}</MathText>
            </div>

            {/* Step-by-step */}
            <div>
              <button
                onClick={() => setShowSteps((v) => !v)}
                className="flex items-center justify-between gap-2 text-sm px-4 py-3 rounded-xl w-full transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
                <span>Step-by-step solution</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transform: showSteps ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {showSteps && (
                <div className="mt-2 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  {result.steps.map((step, i) => (
                    <div key={i} className="px-4 py-3 text-sm flex gap-3 items-start"
                      style={{
                        background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent",
                        borderBottom: i < result.steps.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                      }}>
                      <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                        style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
                        {i + 1}
                      </span>
                      <MathText style={{ color: "rgba(255,255,255,0.7)" }}>{step}</MathText>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href={`/${subjectId}`} className="btn-secondary text-center">Change Topic</Link>
              <button onClick={generateProblem} disabled={loading} className="btn-primary">
                {loading ? "Generating…" : "Next Problem"}
              </button>
            </div>
            <button
              onClick={saveProblem}
              disabled={saving || saved}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              style={{ border: "1px solid rgba(255,255,255,0.12)", color: saved ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)" }}
            >
              <span className="material-symbols-outlined text-lg leading-none">{saved ? "bookmark_added" : "bookmark"}</span>
              {saved ? "Saved to Library" : saving ? "Saving..." : "Save Problem & Answer"}
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}

export default function ProblemsPage() {
  return <Suspense><ProblemsContent /></Suspense>;
}
