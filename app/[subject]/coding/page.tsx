"use client";

import { getSubject, getTopic } from "@/lib/subjects";
import type { Subject, Topic } from "@/lib/subjects";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { BottomNav } from "@/components/ui/bottom-nav";

interface CodingProblem {
  title: string;
  difficulty: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  hints: string[];
  starterCode: string;
  solution: string;
}

interface CheckResult {
  correct: boolean;
  feedback: string;
  issues: string[];
  improvements: string[];
  timeComplexity: string;
  spaceComplexity: string;
  solution: string;
}

const LANGUAGES = ["Python", "JavaScript", "C++", "Java"] as const;
type Language = (typeof LANGUAGES)[number];
const DIFFICULTIES = ["easy", "medium", "hard"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

const DIFF_COLOR: Record<string, string> = {
  easy: "#4ade80",
  medium: "#facc15",
  hard: "#f87171",
};

function CodingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subjectId = params.subject as string;
  const topicId = searchParams.get("topic") ?? undefined;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);

  const [language, setLanguage] = useState<Language>("Python");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const [result, setResult] = useState<CheckResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const codeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const builtin = getSubject(subjectId);
    if (builtin) {
      setSubject(builtin);
      setTopic(topicId ? (getTopic(subjectId, topicId) ?? null) : null);
    }
  }, [subjectId, topicId]);

  const generateProblem = useCallback(async () => {
    if (!subject) return;
    setLoading(true);
    setError("");
    setProblem(null);
    setCode("");
    setResult(null);
    setShowHints(false);
    setShowSolution(false);

    try {
      const res = await fetch("/api/generate-coding-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, topicId, language, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generating problem");
      setProblem(data);
      setCode(data.starterCode ?? "");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [subject, subjectId, topicId, language, difficulty]);

  async function submitCode() {
    if (!problem || !code.trim()) {
      setError("Please write some code before submitting.");
      return;
    }
    setChecking(true);
    setError("");

    const fullProblem = `${problem.title}\n\n${problem.description}\n\nExamples:\n${problem.examples.map((ex) => `Input: ${ex.input} → Output: ${ex.output}`).join("\n")}\n\nConstraints:\n${problem.constraints.join(", ")}`;

    try {
      const res = await fetch("/api/check-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: fullProblem, code, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error evaluating code");
      setResult(data);
      setShowSolution(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setChecking(false);
    }
  }

  function handleTabKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const ta = codeRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newCode = code.slice(0, start) + "    " + code.slice(end);
    setCode(newCode);
    setTimeout(() => ta.setSelectionRange(start + 4, start + 4), 0);
  }

  if (!subject) return null;

  return (
    <main className="relative min-h-screen">
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-30" />
      <div className="relative max-w-2xl mx-auto px-5 py-14">

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

        {/* Setup */}
        {!problem && !loading && (
          <div className="card-glow rounded-2xl p-8 fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                {subject.emoji}
              </div>
              <div>
                <h1 className="font-semibold text-white/90">{subject.name} — Coding Problems</h1>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {topic ? topic.name : "All topics"} · Write code, get AI feedback
                </p>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs mb-3 font-medium tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>LANGUAGE</p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <button key={l} onClick={() => setLanguage(l)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      border: "1px solid",
                      borderColor: language === l ? "rgba(139,92,246,0.5)" : "var(--border)",
                      background: language === l ? "rgba(139,92,246,0.12)" : "transparent",
                      color: language === l ? "#c4b5fd" : "rgba(255,255,255,0.4)",
                    }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs mb-3 font-medium tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>DIFFICULTY</p>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all"
                    style={{
                      border: "1px solid",
                      borderColor: difficulty === d ? "rgba(139,92,246,0.5)" : "var(--border)",
                      background: difficulty === d ? "rgba(139,92,246,0.12)" : "transparent",
                      color: difficulty === d ? "#c4b5fd" : "rgba(255,255,255,0.4)",
                    }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

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
            <svg className="animate-spin mx-auto mb-4" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Generating problem…</p>
          </div>
        )}

        {/* Problem + editor */}
        {problem && !result && (
          <div className="space-y-4 fade-up">
            {/* Problem description */}
            <div className="card-glow rounded-2xl p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-semibold text-white/90 text-lg">{problem.title}</h2>
                  <span className="text-xs font-semibold capitalize px-2 py-0.5 rounded-full mt-1 inline-block"
                    style={{ background: `${DIFF_COLOR[problem.difficulty] ?? "#a78bfa"}18`, color: DIFF_COLOR[problem.difficulty] ?? "#a78bfa" }}>
                    {problem.difficulty}
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded-lg shrink-0 mt-1"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "rgba(255,255,255,0.4)" }}>
                  {language}
                </span>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>{problem.description}</p>

              {/* Examples */}
              <div className="mb-4">
                <p className="text-xs font-medium tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>EXAMPLES</p>
                <div className="space-y-2">
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="rounded-xl p-3 text-sm font-mono" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                      <div><span style={{ color: "rgba(255,255,255,0.35)" }}>Input: </span><span style={{ color: "#c4b5fd" }}>{ex.input}</span></div>
                      <div><span style={{ color: "rgba(255,255,255,0.35)" }}>Output: </span><span style={{ color: "#4ade80" }}>{ex.output}</span></div>
                      {ex.explanation && <div className="mt-1 font-sans" style={{ color: "rgba(255,255,255,0.4)" }}>{ex.explanation}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraints */}
              {problem.constraints.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>CONSTRAINTS</p>
                  <ul className="space-y-1">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="text-sm flex gap-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hints toggle */}
              {problem.hints.length > 0 && (
                <div>
                  {!showHints ? (
                    <button onClick={() => setShowHints(true)}
                      className="text-sm px-3 py-1.5 rounded-lg transition-all"
                      style={{ color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.06)" }}>
                      💡 Show hints
                    </button>
                  ) : (
                    <div className="space-y-1">
                      {problem.hints.map((h, i) => (
                        <div key={i} className="text-sm rounded-lg px-3 py-2" style={{ background: "rgba(139,92,246,0.07)", color: "rgba(255,255,255,0.6)" }}>
                          <span className="font-semibold mr-2" style={{ color: "#a78bfa" }}>Hint {i + 1}:</span>{h}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Code editor */}
            <div className="card-glow rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>YOUR SOLUTION</p>
                <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>{language}</span>
              </div>
              <textarea
                ref={codeRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleTabKey}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                rows={14}
                className="w-full outline-none resize-y text-sm"
                style={{
                  fontFamily: "'Courier New', 'Consolas', monospace",
                  color: "rgba(255,255,255,0.82)",
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  lineHeight: "1.6",
                  caretColor: "#a78bfa",
                  minHeight: "200px",
                  tabSize: 4,
                }}
              />
              <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>Tab key inserts 4 spaces</p>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="grid grid-cols-2 gap-3">
              <button onClick={generateProblem} className="btn-secondary">New Problem</button>
              <button onClick={submitCode} disabled={checking} className="btn-primary">
                {checking ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="15" />
                    </svg>
                    Evaluating…
                  </>
                ) : "Submit Code"}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && problem && (
          <div className="space-y-4 fade-up">
            {/* Verdict */}
            <div className="card-glow rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{result.correct ? "✅" : "❌"}</span>
                <div>
                  <p className="font-semibold text-white/90">{result.correct ? "Correct Solution!" : "Needs Work"}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{problem.title}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{result.feedback}</p>
            </div>

            {/* Complexity */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card-glow rounded-xl p-4">
                <p className="text-xs tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>TIME COMPLEXITY</p>
                <p className="text-sm font-mono font-bold" style={{ color: "#c4b5fd" }}>{result.timeComplexity}</p>
              </div>
              <div className="card-glow rounded-xl p-4">
                <p className="text-xs tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>SPACE COMPLEXITY</p>
                <p className="text-sm font-mono font-bold" style={{ color: "#c4b5fd" }}>{result.spaceComplexity}</p>
              </div>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="card-glow rounded-2xl p-5">
                <p className="text-xs font-medium tracking-wider mb-3" style={{ color: "#f87171" }}>ISSUES TO FIX</p>
                <ul className="space-y-2">
                  {result.issues.map((issue, i) => (
                    <li key={i} className="text-sm flex gap-2" style={{ color: "rgba(255,255,255,0.65)" }}>
                      <span style={{ color: "#f87171", flexShrink: 0 }}>✗</span>{issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {result.improvements.length > 0 && (
              <div className="card-glow rounded-2xl p-5">
                <p className="text-xs font-medium tracking-wider mb-3" style={{ color: "#facc15" }}>SUGGESTIONS</p>
                <ul className="space-y-2">
                  {result.improvements.map((imp, i) => (
                    <li key={i} className="text-sm flex gap-2" style={{ color: "rgba(255,255,255,0.65)" }}>
                      <span style={{ color: "#facc15", flexShrink: 0 }}>→</span>{imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Solution */}
            <div>
              <button
                onClick={() => setShowSolution((v) => !v)}
                className="flex items-center justify-between gap-2 text-sm px-4 py-3 rounded-xl w-full transition-all"
                style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", color: "#c4b5fd" }}>
                <span>View complete solution</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transform: showSolution ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {showSolution && (
                <pre className="mt-2 rounded-xl p-4 overflow-x-auto text-sm"
                  style={{
                    fontFamily: "'Courier New', 'Consolas', monospace",
                    background: "rgba(0,0,0,0.35)",
                    border: "1px solid rgba(139,92,246,0.15)",
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                  {result.solution}
                </pre>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href={`/${subjectId}`} className="btn-secondary text-center">Change Topic</Link>
              <button onClick={generateProblem} disabled={loading} className="btn-primary">
                {loading ? "Generating…" : "Next Problem"}
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}

export default function CodingPage() {
  return <Suspense><CodingContent /></Suspense>;
}
