"use client";

import { getSubject } from "@/lib/subjects";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import type { Subject } from "@/lib/subjects";

interface CategoryScore {
  score: number;
  comment: string;
}

interface GradeResult {
  grade: string;
  score: number;
  summary: string;
  categories: {
    grammar: CategoryScore;
    vocabulary: CategoryScore;
    structure: CategoryScore;
    clarity: CategoryScore;
    argumentation: CategoryScore;
  };
  strengths: string[];
  improvements: string[];
  corrections: { original: string; corrected: string; explanation: string }[];
}

const CATEGORY_LABELS: Record<string, string> = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  structure: "Structure",
  clarity: "Clarity",
  argumentation: "Argumentation",
};

function gradeColor(score: number): string {
  if (score >= 85) return "#4ade80";
  if (score >= 70) return "#facc15";
  if (score >= 55) return "#fb923c";
  return "#f87171";
}

export default function EssayPage() {
  const params = useParams();
  const subjectId = params.subject as string;
  const [subject, setSubject] = useState<Subject | null>(null);

  const [essayText, setEssayText] = useState("");
  const [essayPrompt, setEssayPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GradeResult | null>(null);

  useEffect(() => {
    const s = getSubject(subjectId);
    if (s) setSubject(s);
  }, [subjectId]);

  async function grade() {
    if (essayText.trim().length < 20) {
      setError("Please write at least a sentence or two before grading.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/grade-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: essayText, prompt: essayPrompt || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Grading failed");
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
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

        {/* Input section */}
        {!result && (
          <div className="space-y-4 fade-up">
            <div className="card-glow rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                  {subject.emoji}
                </div>
                <div>
                  <h1 className="font-semibold text-white/90">Essay & Text Grader</h1>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Paste or write any text — get a thorough grade with feedback
                  </p>
                </div>
              </div>

              {/* Optional task/prompt */}
              <div className="mb-4">
                <label className="text-xs font-medium tracking-wider block mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                  TASK / PROMPT (optional)
                </label>
                <input
                  type="text"
                  value={essayPrompt}
                  onChange={(e) => setEssayPrompt(e.target.value)}
                  placeholder="e.g. Write a persuasive essay about social media"
                  className="w-full bg-transparent text-sm outline-none"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    padding: "0.625rem 0.875rem",
                    caretColor: "#a78bfa",
                  }}
                />
              </div>

              {/* Essay textarea */}
              <div>
                <label className="text-xs font-medium tracking-wider block mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                  YOUR TEXT
                </label>
                <textarea
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  placeholder="Write or paste your essay, letter, email, or any text here…"
                  rows={12}
                  className="w-full bg-transparent text-sm outline-none resize-y"
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    padding: "0.875rem",
                    lineHeight: "1.7",
                    caretColor: "#a78bfa",
                    minHeight: "200px",
                  }}
                />
                <p className="text-xs mt-1.5 text-right" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {essayText.trim().split(/\s+/).filter(Boolean).length} words
                </p>
              </div>

              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

              <button onClick={grade} disabled={loading} className="btn-primary w-full mt-4">
                {loading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="15" />
                    </svg>
                    Grading…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    Grade My Text
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-5 fade-up">
            {/* Grade hero */}
            <div className="card-glow rounded-2xl p-8 text-center">
              <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Overall Grade</p>
              <p className="text-7xl font-black mb-1 text-gradient">{result.grade}</p>
              <p className="text-2xl font-bold mb-4" style={{ color: gradeColor(result.score) }}>{result.score} / 100</p>
              <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>{result.summary}</p>
            </div>

            {/* Category scores */}
            <div className="card-glow rounded-2xl p-6">
              <p className="text-xs font-medium tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>CATEGORY BREAKDOWN</p>
              <div className="space-y-4">
                {Object.entries(result.categories).map(([key, cat]) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-white/70">{CATEGORY_LABELS[key] ?? key}</span>
                      <span className="text-sm font-bold" style={{ color: gradeColor(cat.score) }}>{cat.score}</span>
                    </div>
                    <div className="w-full h-2 rounded-full mb-1.5 overflow-hidden" style={{ background: "var(--surface-2)" }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${cat.score}%`, background: `linear-gradient(90deg, ${gradeColor(cat.score)}88, ${gradeColor(cat.score)})` }} />
                    </div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{cat.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card-glow rounded-2xl p-5">
                <p className="text-xs font-medium tracking-wider mb-3" style={{ color: "rgba(74,222,128,0.7)" }}>STRENGTHS</p>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                      <span style={{ color: "#4ade80", flexShrink: 0 }}>✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-glow rounded-2xl p-5">
                <p className="text-xs font-medium tracking-wider mb-3" style={{ color: "rgba(251,146,60,0.7)" }}>TO IMPROVE</p>
                <ul className="space-y-2">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                      <span style={{ color: "#fb923c", flexShrink: 0 }}>→</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Corrections */}
            {result.corrections && result.corrections.length > 0 && (
              <div className="card-glow rounded-2xl p-6">
                <p className="text-xs font-medium tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>SPECIFIC CORRECTIONS</p>
                <div className="space-y-4">
                  {result.corrections.map((c, i) => (
                    <div key={i} className="rounded-xl p-4 text-sm" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                      <div className="flex flex-wrap gap-2 items-center mb-2">
                        <span className="px-2 py-0.5 rounded-lg line-through" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                          {c.original}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "rgba(255,255,255,0.3)" }}>
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                        <span className="px-2 py-0.5 rounded-lg" style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}>
                          {c.corrected}
                        </span>
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.45)" }}>{c.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Link href={`/${subjectId}`} className="btn-secondary text-center">Back to {subject.name}</Link>
              <button onClick={() => { setResult(null); setEssayText(""); setEssayPrompt(""); setError(""); }} className="btn-primary">
                Grade Another Text
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
