"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { getSubject } from "@/lib/subjects";
import { getCustomSubjects } from "@/lib/custom-subjects";
import { getCoursesBySubject, LEVEL_COLOR, LEVEL_LABEL, type Course } from "@/lib/courses";
import { Spinner } from "@/components/ui/ios-spinner";

type Level = "all" | "beginner" | "intermediate" | "advanced";

export default function LearnSubjectPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subject as string;
  const { isSignedIn } = useAuth();

  const subject = getSubject(subjectId) ?? getCustomSubjects().find((s) => s.id === subjectId);
  const courses = getCoursesBySubject(subjectId);

  const [levelFilter, setLevelFilter] = useState<Level>("all");
  const [progress, setProgress] = useState<Record<string, number>>({}); // courseId → completed count
  const [loadingProgress, setLoadingProgress] = useState(false);

  const [askText, setAskText] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState("");

  // Load progress for all courses in this subject
  useEffect(() => {
    if (!isSignedIn) return;
    setLoadingProgress(true);
    fetch(`/api/learn/progress?subject_id=${subjectId}`)
      .then((r) => r.json())
      .then((d) => {
        const counts: Record<string, number> = {};
        for (const row of d.progress ?? []) {
          counts[row.course_id] = (counts[row.course_id] ?? 0) + 1;
        }
        setProgress(counts);
      })
      .catch(() => {})
      .finally(() => setLoadingProgress(false));
  }, [isSignedIn, subjectId]);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!askText.trim()) return;
    setAskLoading(true);
    setAskError("");
    router.push(`/learn/${subjectId}/custom?q=${encodeURIComponent(askText.trim())}`);
  }

  const filtered = courses.filter((c) => levelFilter === "all" || c.level === levelFilter);

  if (!subject) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-[#94A3B8]">
          <Link href="/learn" className="hover:text-[#64748B] dark:hover:text-white transition-colors">Learn</Link>
          <span>/</span>
          <span className="text-[#111111] dark:text-white font-medium">{subject.name}</span>
        </div>

        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F5F9] dark:bg-[#2D3748] text-3xl">
            {subject.emoji}
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#111111] dark:text-white">{subject.name}</h1>
            <p className="text-sm text-[#94A3B8] mt-0.5">{courses.length} courses · {courses.reduce((a, c) => a + c.modules.reduce((b, m) => b + m.lessons.length, 0), 0)} lessons</p>
          </div>
        </div>

        {/* Ask AI box */}
        <div className="mb-10 rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3">ASK AI ANYTHING</p>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-4">
            Describe what you want to learn in {subject.name} and AI will generate a custom lesson for you.
          </p>
          <form onSubmit={handleAsk} className="flex gap-3">
            <input
              type="text"
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              placeholder={`e.g. "Explain ${subject.topics[0]?.name ?? "a topic"} with examples"`}
              className="flex-1 rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#111111] px-4 py-3 text-sm text-[#111111] dark:text-white placeholder:text-[#94A3B8] outline-none focus:border-[#111111] dark:focus:border-white transition-colors"
            />
            <button
              type="submit"
              disabled={askLoading || !askText.trim()}
              className="flex items-center gap-2 rounded-xl bg-[#111111] dark:bg-white px-5 py-3 text-sm font-bold text-white dark:text-[#111111] hover:opacity-90 transition-all disabled:opacity-40"
            >
              {askLoading ? <Spinner size="sm" className="text-white dark:text-[#111111]" /> : <span className="material-symbols-outlined text-lg leading-none">auto_awesome</span>}
              Generate
            </button>
          </form>
          {askError && <p className="mt-2 text-xs text-red-500">{askError}</p>}
        </div>

        {/* Level filter */}
        <div className="flex items-center gap-2 mb-6">
          {(["all", "beginner", "intermediate", "advanced"] as Level[]).map((l) => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className="rounded-full px-4 py-1.5 text-xs font-bold capitalize transition-all border"
              style={{
                background: levelFilter === l ? "#111111" : "transparent",
                borderColor: levelFilter === l ? "#111111" : "#E2E8F0",
                color: levelFilter === l ? "#fff" : "#64748B",
              }}
            >
              {l === "all" ? "All levels" : l}
            </button>
          ))}
        </div>

        {/* Courses grid */}
        {filtered.length === 0 ? (
          <p className="text-center py-16 text-[#94A3B8]">No courses at this level yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => {
              const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
              const completedCount = progress[course.id] ?? 0;
              const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
              const lc = LEVEL_COLOR[course.level];
              return (
                <Link key={course.id} href={`/learn/${subjectId}/${course.id}`}>
                  <div className="group flex flex-col rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-6 h-full transition-all hover:border-[#111111] dark:hover:border-white hover:shadow-sm cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: lc.bg, color: lc.text, border: `1px solid ${lc.border}` }}
                      >
                        {LEVEL_LABEL[course.level]}
                      </span>
                      {isSignedIn && completedCount > 0 && (
                        <span className="text-[10px] font-bold text-[#94A3B8]">{pct}%</span>
                      )}
                    </div>

                    <h3 className="font-bold text-[#111111] dark:text-white text-sm leading-snug mb-1">{course.title}</h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-4 line-clamp-2">{course.description}</p>

                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                        <span>{course.modules.length} modules · {totalLessons} lessons</span>
                        <span>{course.duration}</span>
                      </div>
                      {isSignedIn && completedCount > 0 && (
                        <div className="h-1 w-full rounded-full bg-[#F1F5F9] dark:bg-[#2D3748] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#111111] dark:bg-white transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
