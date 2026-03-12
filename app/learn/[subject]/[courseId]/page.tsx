"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { getSubject } from "@/lib/subjects";
import { getCustomSubjects } from "@/lib/custom-subjects";
import { getCourse, LEVEL_COLOR, LEVEL_LABEL } from "@/lib/courses";

export default function CourseDetailPage() {
  const params = useParams();
  const subjectId = params.subject as string;
  const courseId = params.courseId as string;
  const { isSignedIn } = useAuth();

  const subject = getSubject(subjectId) ?? getCustomSubjects().find((s) => s.id === subjectId);
  const course = getCourse(subjectId, courseId);

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isSignedIn) return;
    fetch(`/api/learn/progress?subject_id=${subjectId}&course_id=${courseId}`)
      .then((r) => r.json())
      .then((d) => {
        const ids = new Set<string>((d.progress ?? []).map((p: { lesson_id: string }) => p.lesson_id));
        setCompletedLessons(ids);
      })
      .catch(() => {});
  }, [isSignedIn, subjectId, courseId]);

  function toggleModule(moduleId: string) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  }

  if (!subject || !course) return null;

  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
  const completedCount = completedLessons.size;
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const lc = LEVEL_COLOR[course.level];

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />
      <div className="mx-auto max-w-3xl px-6 py-12">

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-[#94A3B8] flex-wrap">
          <Link href="/learn" className="hover:text-[#64748B] dark:hover:text-white transition-colors">Learn</Link>
          <span>/</span>
          <Link href={`/learn/${subjectId}`} className="hover:text-[#64748B] dark:hover:text-white transition-colors">{subject.name}</Link>
          <span>/</span>
          <span className="text-[#111111] dark:text-white font-medium">{course.title}</span>
        </div>

        {/* Course header */}
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-8 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
              style={{ background: lc.bg, color: lc.text, border: `1px solid ${lc.border}` }}
            >
              {LEVEL_LABEL[course.level]}
            </span>
            <span className="text-xs text-[#94A3B8]">{course.duration}</span>
            <span className="text-xs text-[#94A3B8]">{course.modules.length} modules · {totalLessons} lessons</span>
          </div>
          <h1 className="text-2xl font-black text-[#111111] dark:text-white mb-2">{course.title}</h1>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-6">{course.description}</p>

          {isSignedIn && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#94A3B8]">
                <span>{completedCount} of {totalLessons} lessons complete</span>
                <span className="font-bold text-[#111111] dark:text-white">{pct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#E2E8F0] dark:bg-[#2D3748] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#111111] dark:bg-white transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modules accordion */}
        <div className="space-y-3">
          {course.modules.map((mod, modIdx) => {
            const isOpen = openModules.has(mod.id);
            const modCompleted = mod.lessons.filter((l) => completedLessons.has(l.id)).length;
            return (
              <div
                key={mod.id}
                className="rounded-2xl border transition-all overflow-hidden"
                style={{ borderColor: isOpen ? "#111111" : "#E2E8F0" }}
              >
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left bg-white dark:bg-[#1A1A1A] hover:bg-[#F8FAFC] dark:hover:bg-[#222] transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F1F5F9] dark:bg-[#2D3748] flex items-center justify-center text-xs font-bold text-[#94A3B8]">
                    {modIdx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#111111] dark:text-white text-sm">{mod.title}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      {mod.lessons.length} lessons{isSignedIn && modCompleted > 0 ? ` · ${modCompleted} complete` : ""}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[#94A3B8] text-lg transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "none" }}>
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A]">
                    {mod.lessons.map((lesson, lessonIdx) => {
                      const done = completedLessons.has(lesson.id);
                      return (
                        <Link
                          key={lesson.id}
                          href={`/learn/${subjectId}/${courseId}/${lesson.id}`}
                          className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#F8FAFC] dark:hover:bg-[#222] transition-colors group"
                          style={{ borderBottom: lessonIdx < mod.lessons.length - 1 ? "1px solid #F1F5F9" : "none" }}
                        >
                          <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${done ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]" : "bg-[#F1F5F9] dark:bg-[#2D3748] text-[#94A3B8]"}`}>
                            {done ? <span className="material-symbols-outlined text-sm leading-none">check</span> : lessonIdx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#111111] dark:text-white group-hover:text-[#111111] dark:group-hover:text-white truncate">{lesson.title}</p>
                            <p className="text-xs text-[#94A3B8] truncate mt-0.5">{lesson.description}</p>
                          </div>
                          <span className="material-symbols-outlined text-[#CBD5E1] text-lg group-hover:text-[#94A3B8] transition-colors">chevron_right</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Start button */}
        <div className="mt-8">
          <Link
            href={`/learn/${subjectId}/${courseId}/${course.modules[0]?.lessons[0]?.id}`}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-bold py-4 hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined leading-none">play_arrow</span>
            {completedCount > 0 ? "Continue Learning" : "Start Course"}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
