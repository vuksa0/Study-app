"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Navigation } from "@/components/Navigation";
import { subjects } from "@/lib/subjects";
import { ArrowRight, TrendingUp, Flame, BookOpen, Trophy } from "lucide-react";

type ProgressRecord = {
  subject_id: string;
  course_id: string;
  lesson_id: string;
  completed_at: string;
};

type LibraryItem = {
  subject_id: string | null;
  type: string;
  created_at: string;
};

type SubjectStat = {
  subject: (typeof subjects)[0];
  lessonsCompleted: number;
  quizzesTaken: number;
  score: number;
};

export default function ProgressPage() {
  const { userId, isSignedIn } = useAuth();
  const [progressRecords, setProgressRecords] = useState<ProgressRecord[]>([]);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) { setLoading(false); return; }
    Promise.all([
      fetch("/api/learn/progress/all").then((r) => r.json()).catch(() => ({ records: [] })),
      fetch("/api/library").then((r) => r.json()).catch(() => []),
    ]).then(([prog, lib]) => {
      setProgressRecords(prog.records ?? []);
      setLibraryItems(Array.isArray(lib) ? lib : []);
      setLoading(false);
    });
  }, [isSignedIn]);

  const subjectStats: SubjectStat[] = subjects.map((s) => {
    const lessons = progressRecords.filter((r) => r.subject_id === s.id).length;
    const quizzes = libraryItems.filter((i) => i.subject_id === s.id && i.type === "quiz").length;
    const score = lessons > 0 ? Math.min(100, Math.round(50 + lessons * 5 + quizzes * 3)) : 0;
    return { subject: s, lessonsCompleted: lessons, quizzesTaken: quizzes, score };
  });

  const totalLessons = progressRecords.length;
  const totalQuizzes = libraryItems.filter((i) => i.type === "quiz").length;
  const avgScore = subjectStats.filter((s) => s.score > 0).reduce((a, b) => a + b.score, 0) /
    Math.max(1, subjectStats.filter((s) => s.score > 0).length);
  const activeSubjects = subjectStats.filter((s) => s.score > 0).length;

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">PROGRESS</div>
          <h1 className="text-4xl font-black tracking-[-0.02em] text-[#111111] dark:text-white md:text-5xl">
            See where you stand
          </h1>
          <p className="mt-3 text-[#64748B] dark:text-[#94A3B8]">
            Track your performance across all subjects and courses.
          </p>
        </div>

        {!isSignedIn ? (
          <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-12 text-center">
            <Trophy className="mx-auto mb-4 h-10 w-10 text-[#94A3B8]" />
            <h2 className="mb-2 text-xl font-bold text-[#111111] dark:text-white">Sign in to track your progress</h2>
            <p className="mb-6 text-sm text-[#64748B] dark:text-[#94A3B8]">Your scores, lessons completed, and quiz history all in one place.</p>
            <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#111111] dark:bg-white px-6 py-2.5 text-sm font-bold text-white dark:text-[#111111]">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#111111] dark:border-[#2D3748] dark:border-t-white" />
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { icon: <BookOpen className="h-5 w-5" />, label: "Lessons completed", value: totalLessons, color: "#3B82F6" },
                { icon: <TrendingUp className="h-5 w-5" />, label: "Quizzes taken", value: totalQuizzes, color: "#8B5CF6" },
                { icon: <Trophy className="h-5 w-5" />, label: "Avg. score", value: avgScore > 0 ? `${Math.round(avgScore)}%` : "—", color: "#F59E0B" },
                { icon: <Flame className="h-5 w-5" />, label: "Active subjects", value: activeSubjects, color: "#10B981" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${stat.color}15`, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-black text-[#111111] dark:text-white">{stat.value}</div>
                  <div className="mt-0.5 text-xs text-[#94A3B8]">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Subject breakdown */}
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-6">
              <h2 className="mb-6 text-lg font-bold text-[#111111] dark:text-white">Subject breakdown</h2>
              <div className="flex flex-col gap-5">
                {subjectStats.sort((a, b) => b.score - a.score).map(({ subject: s, lessonsCompleted, quizzesTaken, score }) => (
                  <Link key={s.id} href={`/subject/${s.id}`} className="group flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${s.iconColor}15` }}>
                      <span className="material-symbols-outlined text-xl leading-none" style={{ color: s.iconColor }}>{s.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#111111] dark:text-white group-hover:underline">{s.name}</span>
                        <span className="text-xs font-bold" style={{ color: score > 0 ? s.iconColor : "#94A3B8" }}>
                          {score > 0 ? `${score}%` : "Not started"}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#F1F5F9] dark:bg-[#2D3748]">
                        <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${score}%`, background: s.iconColor, opacity: score > 0 ? 1 : 0 }} />
                      </div>
                      <div className="mt-1 flex gap-3">
                        <span className="text-[10px] text-[#94A3B8]">{lessonsCompleted} lessons</span>
                        <span className="text-[10px] text-[#94A3B8]">{quizzesTaken} quizzes</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#CBD5E1] group-hover:text-[#64748B] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
