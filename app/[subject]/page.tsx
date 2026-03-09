"use client";

import { getSubject } from "@/lib/subjects";
import { getCustomSubjects } from "@/lib/custom-subjects";
import type { Subject, SubjectMode } from "@/lib/subjects";
import { getTestDate, setTestDate, TEST_DATE_OPTIONS } from "@/lib/test-date";
import type { TestDate } from "@/lib/test-date";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const DEFAULT_MODES: SubjectMode[] = ["quiz", "flashcards", "lesson"];

interface ModeButton {
  mode: SubjectMode;
  label: string;
  href: (subjectId: string) => string;
  primary?: boolean;
  icon: React.ReactNode;
}

const MODE_CONFIG: ModeButton[] = [
  {
    mode: "problems",
    label: "Problems",
    href: (id) => `/${id}/problems`,
    primary: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    mode: "quiz",
    label: "Quiz",
    href: (id) => `/${id}/quiz`,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    mode: "flashcards",
    label: "Flash Cards",
    href: (id) => `/${id}/flashcards`,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    mode: "lesson",
    label: "Lesson",
    href: (id) => `/${id}/lesson`,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    mode: "essay",
    label: "Essay Grader",
    href: (id) => `/${id}/essay`,
    primary: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    mode: "coding",
    label: "Coding Problems",
    href: (id) => `/${id}/coding`,
    primary: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params.subject as string;
  const [subject, setSubject] = useState<Subject | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [testDate, setTestDateState] = useState<TestDate | null>(null);

  useEffect(() => {
    const builtin = getSubject(subjectId);
    if (builtin) { setSubject(builtin); return; }
    const custom = getCustomSubjects().find((s) => s.id === subjectId);
    if (custom) setSubject(custom);
    else setNotFound(true);
  }, [subjectId]);

  useEffect(() => {
    setTestDateState(getTestDate(subjectId));
  }, [subjectId]);

  function handleTestDate(val: TestDate) {
    setTestDate(subjectId, val);
    setTestDateState(val);
  }

  if (notFound) return (
    <main className="max-w-3xl mx-auto px-5 py-20 text-center">
      <p style={{ color: "rgba(255,255,255,0.4)" }}>Subject not found.</p>
      <Link href="/" className="text-violet-400 hover:text-violet-300 mt-4 inline-block text-sm">← Home</Link>
    </main>
  );

  if (!subject) return null;

  const modes = subject.modes ?? DEFAULT_MODES;
  const activeButtons = MODE_CONFIG.filter((b) => modes.includes(b.mode));

  return (
    <main className="relative min-h-screen">
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-40" />
      <div className="orb w-[400px] h-[400px] top-0 right-0 opacity-50"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />

      <div className="relative max-w-3xl mx-auto px-5 py-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          All Subjects
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            {subject.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white/90">{subject.name}</h1>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {subject.topics.length} topics · pick one or run a full-subject session
            </p>
          </div>
        </div>

        {/* Test date picker */}
        <div className="mb-8 card-glow rounded-2xl p-5">
          <p className="text-sm font-medium text-white/60 mb-3">When is your test?</p>
          <div className="flex flex-wrap gap-2">
            {TEST_DATE_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => handleTestDate(opt.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={testDate === opt.value
                  ? { background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.6)", color: "#c4b5fd" }
                  : { background: "var(--surface-2)", border: "1px solid var(--border)", color: "rgba(255,255,255,0.4)" }}>
                <span>{opt.emoji}</span>{opt.label}
              </button>
            ))}
          </div>
          {testDate && testDate !== "later" && (
            <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>
              {testDate === "today" && "AI will focus on the most critical exam topics only."}
              {testDate === "tomorrow" && "AI will prioritise key concepts and common exam questions."}
              {testDate === "this_week" && "AI will balance depth with broad topic coverage."}
              {testDate === "next_week" && "AI will provide thorough, well-rounded content."}
            </p>
          )}
        </div>

        {/* Topics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {subject.topics.map((topic) => {
            const firstMode = modes[0];
            const topicHref = firstMode === "problems"
              ? `/${subject.id}/problems?topic=${topic.id}`
              : firstMode === "coding"
              ? `/${subject.id}/coding?topic=${topic.id}`
              : `/${subject.id}/quiz?topic=${topic.id}`;
            return (
              <Link key={topic.id} href={topicHref}
                className="card-glow rounded-xl p-4 flex items-start justify-between group">
                <div>
                  <p className="font-medium text-white/80 text-sm">{topic.name}</p>
                  {topic.description && (
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{topic.description}</p>
                  )}
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="shrink-0 mt-0.5 ml-3 transition-transform group-hover:translate-x-0.5"
                  style={{ color: "rgba(255,255,255,0.2)" }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className={`grid gap-3 ${activeButtons.length <= 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
          {activeButtons.map((btn) => (
            <Link key={btn.mode} href={btn.href(subject.id)}
              className={btn.primary ? "btn-primary" : "btn-secondary"}>
              {btn.icon}
              {btn.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
