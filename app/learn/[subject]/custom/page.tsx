"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Spinner } from "@/components/ui/ios-spinner";
import { getSubject } from "@/lib/subjects";
import { getCustomSubjects } from "@/lib/custom-subjects";

interface LessonData {
  title: string;
  intro: string;
  sections: { heading: string; content: string }[];
  summary: string;
  keyTerms: { term: string; definition: string }[];
}

function CustomLessonContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subjectId = params.subject as string;
  const query = searchParams.get("q") ?? "";

  const subject = getSubject(subjectId) ?? getCustomSubjects().find((s) => s.id === subjectId);

  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    setLoading(true);
    setError("");
    fetch("/api/generate-lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjectId,
        subjectName: subject?.name,
        topicName: query,
        topicDescription: `The user wants to learn: "${query}". Generate a focused lesson covering this topic.`,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.lesson) setLessonData(d.lesson);
        else throw new Error(d.error || "Failed to generate lesson");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, query]);

  function toggleSection(i: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  if (!subject) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />

      {loading && (
        <div className="fixed top-16 left-0 right-0 z-40 h-0.5 bg-[#E2E8F0] dark:bg-white/10">
          <div className="h-full bg-[#111111] dark:bg-white/60 animate-pulse w-3/4" />
        </div>
      )}

      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs text-[#94A3B8] flex-wrap">
          <Link href="/learn" className="hover:text-[#64748B] dark:hover:text-white transition-colors">Learn</Link>
          <span>/</span>
          <Link href={`/learn/${subjectId}`} className="hover:text-[#64748B] dark:hover:text-white transition-colors">{subject.name}</Link>
          <span>/</span>
          <span className="text-[#111111] dark:text-white font-medium truncate max-w-[200px]">{query}</span>
        </div>

        {!query ? (
          <div className="text-center py-20">
            <p className="text-[#94A3B8] mb-4">No topic specified.</p>
            <Link href={`/learn/${subjectId}`} className="text-[#111111] dark:text-white font-bold underline">
              Back to {subject.name}
            </Link>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="lg" className="text-[#111111] dark:text-white" />
            <p className="text-sm text-[#94A3B8]">Generating lesson on &ldquo;{query}&rdquo;...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-sm font-bold text-[#64748B] hover:text-[#111111] dark:hover:text-white transition-colors">
              Try again
            </button>
          </div>
        ) : lessonData && (
          <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">AI Custom Lesson</span>
                <span className="text-[#CBD5E1]">·</span>
                <span className="text-xs text-[#94A3B8]">{subject.name}</span>
              </div>
              <h1 className="text-2xl font-bold text-[#111111] dark:text-white mb-3">{lessonData.title}</h1>
              <p className="text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">{lessonData.intro}</p>
            </div>

            {/* Sections */}
            <div className="space-y-2">
              {lessonData.sections.map((s, i) => {
                const isOpen = openSections.has(i);
                return (
                  <div key={i} className="rounded-xl border overflow-hidden transition-all"
                    style={{ borderColor: isOpen ? "#111111" : "#E2E8F0" }}>
                    <button
                      onClick={() => toggleSection(i)}
                      className="w-full flex items-center gap-3 px-5 py-4 text-left bg-white dark:bg-[#1A1A1A] hover:bg-[#F8FAFC] dark:hover:bg-[#222] transition-colors"
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isOpen ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]" : "bg-[#F1F5F9] dark:bg-[#2D3748] text-[#94A3B8]"}`}>
                        {i + 1}
                      </div>
                      <span className="flex-1 font-semibold text-sm text-[#111111] dark:text-white">{s.heading}</span>
                      <span className="material-symbols-outlined text-[#94A3B8] text-lg transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "none" }}>
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-[#F1F5F9] dark:border-[#2D3748]">
                        <p className="text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8] ml-9">{s.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Key Takeaways */}
            <div className="rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-3">Key Takeaways</h2>
              <p className="text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">{lessonData.summary}</p>
            </div>

            {/* Key Terms */}
            {lessonData.keyTerms?.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-3">Key Terms</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {lessonData.keyTerms.map((item, i) => (
                    <div key={i} className="rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-3">
                      <p className="text-sm font-semibold text-[#111111] dark:text-white">{item.term}</p>
                      <p className="text-xs mt-0.5 text-[#94A3B8] leading-relaxed">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href={`/learn/${subjectId}`}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-bold py-4 hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined leading-none">arrow_back</span>
                Back to {subject.name} courses
              </Link>
              <Link
                href={`/learn/${subjectId}?ask=${encodeURIComponent(query)}`}
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] text-[#64748B] dark:text-[#94A3B8] font-bold py-3 hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white transition-all text-sm"
              >
                <span className="material-symbols-outlined text-lg leading-none">auto_awesome</span>
                Ask something else
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CustomLessonPage() {
  return <Suspense><CustomLessonContent /></Suspense>;
}
