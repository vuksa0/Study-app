"use client";

import { getSubject, getTopic } from "@/lib/subjects";
import { getCustomSubjects } from "@/lib/custom-subjects";
import { getTestDate } from "@/lib/test-date";
import type { Subject, Topic } from "@/lib/subjects";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { BottomNav } from "@/components/ui/bottom-nav";

interface Lesson {
  title: string;
  intro: string;
  sections: { heading: string; content: string }[];
  summary: string;
  keyTerms: { term: string; definition: string }[];
}

function LessonContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subjectId = params.subject as string;
  const topicId = searchParams.get("topic") ?? undefined;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(topicId);

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

  async function generateLesson(tid?: string) {
    if (!subject) return;
    setLoading(true);
    setError("");
    const resolvedTopicId = tid ?? selectedTopic;
    const resolvedTopic = resolvedTopicId
      ? (subject.topics.find((t) => t.id === resolvedTopicId) ?? null)
      : null;
    try {
      const res = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          topicId: resolvedTopicId,
          subjectName: subject.name,
          topicName: resolvedTopic?.name,
          topicDescription: resolvedTopic?.description,
          testDate: getTestDate(subjectId),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generating lesson");
      setLesson(data.lesson);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!subject) return null;

  return (
    <main className="relative min-h-screen bg-[#111111] text-white">
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-10" />

      <div className="relative max-w-5xl mx-auto px-8 py-14">
        <Link href={`/${subjectId}`} className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          {subject.name}
        </Link>

        {/* Setup / topic picker */}
        {!lesson && (
          <div className="card-glow rounded-2xl p-8 fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                {subject.emoji}
              </div>
              <div>
                <h1 className="font-semibold text-white/90">Lesson</h1>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>{subject.name}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs mb-3 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>CHOOSE TOPIC</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedTopic(undefined)}
                  className="py-2.5 px-3 rounded-xl text-sm font-medium transition-all text-left"
                  style={{
                    border: "1px solid",
                    borderColor: selectedTopic === undefined ? "rgba(139,92,246,0.5)" : "var(--border)",
                    background: selectedTopic === undefined ? "rgba(139,92,246,0.12)" : "transparent",
                    color: selectedTopic === undefined ? "#c4b5fd" : "rgba(255,255,255,0.4)",
                  }}>
                  All topics
                </button>
                {subject.topics.map((t) => (
                  <button key={t.id}
                    onClick={() => setSelectedTopic(t.id)}
                    className="py-2.5 px-3 rounded-xl text-sm font-medium transition-all text-left"
                    style={{
                      border: "1px solid",
                      borderColor: selectedTopic === t.id ? "rgba(139,92,246,0.5)" : "var(--border)",
                      background: selectedTopic === t.id ? "rgba(139,92,246,0.12)" : "transparent",
                      color: selectedTopic === t.id ? "#c4b5fd" : "rgba(255,255,255,0.4)",
                    }}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <button onClick={() => generateLesson()} disabled={loading} className="btn-primary w-full">
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="15"/>
                  </svg>
                  Generating lesson...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  Generate Lesson
                </>
              )}
            </button>
          </div>
        )}

        {/* Lesson content */}
        {lesson && (
          <div className="fade-up space-y-6">
            <div>
              <p className="text-xs font-medium mb-1 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                {subject.name}{topic ? ` · ${topic.name}` : ""}
              </p>
              <h1 className="text-2xl font-bold text-white/90 mb-3">{lesson.title}</h1>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{lesson.intro}</p>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {lesson.sections.map((section, i) => (
                <div key={i} className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <h2 className="font-semibold text-white/85 mb-2">{section.heading}</h2>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{section.content}</p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="rounded-xl p-5" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <h2 className="font-semibold text-violet-300 mb-2 text-sm">Key Takeaways</h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{lesson.summary}</p>
            </div>

            {/* Key terms */}
            {lesson.keyTerms && lesson.keyTerms.length > 0 && (
              <div>
                <h2 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Key Terms
                </h2>
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

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button onClick={() => { setLesson(null); }} className="btn-secondary">
                New Lesson
              </button>
              <Link href={`/${subjectId}/quiz${selectedTopic ? `?topic=${selectedTopic}` : ""}`} className="btn-primary">
                Take a Quiz
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}

export default function LessonPage() {
  return <Suspense><LessonContent /></Suspense>;
}
