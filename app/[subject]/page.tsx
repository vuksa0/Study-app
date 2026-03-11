"use client";

import { getSubject } from "@/lib/subjects";
import { getCustomSubjects } from "@/lib/custom-subjects";
import type { Subject } from "@/lib/subjects";
import { setTestDate, TEST_DATE_OPTIONS } from "@/lib/test-date";
import type { TestDate } from "@/lib/test-date";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useState, useEffect } from "react";

const SUBJECT_COLORS: Record<string, string> = {
  mathematics:       "linear-gradient(135deg,#1d4ed8,#3b82f6)",
  physics:           "linear-gradient(135deg,#7c3aed,#a855f7)",
  chemistry:         "linear-gradient(135deg,#15803d,#22c55e)",
  history:           "linear-gradient(135deg,#b45309,#f59e0b)",
  biology:           "linear-gradient(135deg,#065f46,#10b981)",
  geography:         "linear-gradient(135deg,#0e7490,#22d3ee)",
  english:           "linear-gradient(135deg,#3730a3,#6366f1)",
  "computer-science":"linear-gradient(135deg,#334155,#64748b)",
};

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subject as string;
  const [subject, setSubject] = useState<Subject | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const builtin = getSubject(subjectId);
    if (builtin) { setSubject(builtin); return; }
    const custom = getCustomSubjects().find((s) => s.id === subjectId);
    if (custom) setSubject(custom);
    else setNotFound(true);
  }, [subjectId]);

  function handleTestDatePick(value: TestDate) {
    setTestDate(subjectId, value);
    router.push(`/upload?subject=${subjectId}`);
  }

  if (notFound) return (
    <main className="max-w-3xl mx-auto px-5 py-20 text-center">
      <p style={{ color: "rgba(255,255,255,0.4)" }}>Subject not found.</p>
      <Link href="/" className="text-violet-400 hover:text-violet-300 mt-4 inline-block text-sm">← Home</Link>
    </main>
  );

  if (!subject) return null;

  return (
    <>
    <main className="relative min-h-screen">
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-30" />

      <div className="relative w-full max-w-5xl mx-auto px-8 py-16 flex flex-col items-center">
        <Link href="/"
          className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          All Subjects
        </Link>

        <div className="card-glow rounded-3xl p-8 fade-up text-center">
          {/* Subject pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-semibold"
            style={{ background: SUBJECT_COLORS[subjectId] ?? "var(--surface-2)" }}>
            <span>{subject.emoji}</span>
            <span className="text-white">{subject.name}</span>
          </div>

          <h1 className="text-2xl font-bold text-white/90 mb-2">When is your test?</h1>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
            AI adjusts the content based on how much time you have.
          </p>

          <div className="flex flex-col gap-3">
            {TEST_DATE_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => handleTestDatePick(opt.value)}
                className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-left font-medium transition-all"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "rgba(255,255,255,0.7)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.1)";
                  (e.currentTarget as HTMLElement).style.color = "#c4b5fd";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                }}>
                <span className="text-2xl">{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
    <BottomNav />
    </>
  );
}
