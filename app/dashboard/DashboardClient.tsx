"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Brain, TrendingUp, Settings,
  Zap, Play, Bookmark, RefreshCw, Trophy,
  Timer, BarChart2, ChevronRight, Code2, FlaskConical, Sigma, ExternalLink,
} from "lucide-react";
import { ThinkioLogo } from "@/components/ThinkioLogo";
import { UserButton } from "@clerk/nextjs";
import { SUBJECT_ICON_MAP } from "@/components/SubjectIcons";
import { SubjectShaderCard } from "@/components/SubjectShaderCard";
import { Navigation } from "@/components/Navigation";

type Tab = "dashboard" | "lessons" | "quizzes" | "progress" | "settings";

type LastLesson = { title: string; courseTitle: string; subjectName: string; href: string; progress: number } | null;

interface Props {
  firstName: string;
  totalCompleted: number;
  streak: number;
  weekly: number[];
  weeklyCompleted: number;
  weeklyPct: number;
  lastLesson: LastLesson;
}

const SUBJECT_ITEMS = [
  { id: "mathematics",      name: "Mathematics",      courses: 7 },
  { id: "physics",          name: "Physics",          courses: 6 },
  { id: "chemistry",        name: "Chemistry",        courses: 6 },
  { id: "history",          name: "History",          courses: 6 },
  { id: "biology",          name: "Biology",          courses: 6 },
  { id: "geography",        name: "Geography",        courses: 5 },
  { id: "english",          name: "English",          courses: 6 },
  { id: "computer-science", name: "Computer Science", courses: 7 },
];

const RECOMMENDED_QUIZZES = [
  { icon: <Sigma className="h-6 w-6" />, iconBg: "rgba(59,130,246,0.12)", iconColor: "#3B82F6", title: "Calculus Foundations", meta: "15m · Hard", desc: "Master derivatives and integration rules with our adaptive assessment engine.", href: "/mathematics/quiz" },
  { icon: <FlaskConical className="h-6 w-6" />, iconBg: "rgba(16,185,129,0.12)", iconColor: "#10B981", title: "Chemical Reactions", meta: "10m · Medium", desc: "Test your knowledge of reaction types, balancing equations and reaction rates.", href: "/chemistry/quiz" },
  { icon: <Code2 className="h-6 w-6" />, iconBg: "rgba(249,115,22,0.12)", iconColor: "#F97316", title: "Algorithms & Data Structures", meta: "20m · Expert", desc: "Test sorting algorithms, Big-O notation, trees, graphs and dynamic programming.", href: "/computer-science/quiz" },
];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: "lessons",   label: "Lessons",   icon: <BookOpen className="h-5 w-5" /> },
  { id: "quizzes",   label: "Quizzes",   icon: <Brain className="h-5 w-5" /> },
  { id: "progress",  label: "Progress",  icon: <TrendingUp className="h-5 w-5" /> },
  { id: "settings",  label: "Settings",  icon: <Settings className="h-5 w-5" /> },
];

export function DashboardClient({ firstName, totalCompleted, streak, weekly, weeklyCompleted, weeklyPct, lastLesson }: Props) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const maxActivity = Math.max(...weekly, 1);

  return (
    <div className="flex min-h-screen bg-[#F6F6F8] dark:bg-[#0D0D12] font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#111111] flex flex-col justify-between p-4 sticky top-0 h-screen overflow-y-auto">
        <div className="flex flex-col gap-8">
          <div className="px-2 pt-2">
            <Link href="/"><ThinkioLogo /></Link>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full text-left transition-colors ${
                  tab === item.id
                    ? "bg-[#6366F1] text-white"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1A1A1A]"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <div className="my-3 border-t border-slate-200 dark:border-[#1E293B]" />
            <button
              onClick={() => setTab("settings")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full text-left transition-colors ${
                tab === "settings"
                  ? "bg-[#6366F1] text-white"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1A1A1A]"
              }`}
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
          </nav>
        </div>

        <div className="bg-[#6366F1]/10 dark:bg-[#6366F1]/5 p-4 rounded-xl border border-[#6366F1]/20">
          <p className="text-xs font-bold text-[#6366F1] uppercase tracking-wider mb-1">Pro Plan</p>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-3">Unlock unlimited AI study sessions and analytics.</p>
          <Link href="/subscription" className="block w-full bg-[#6366F1] text-white text-xs font-bold py-2 rounded-lg text-center hover:bg-[#4F46E5] transition-colors">
            Upgrade Now
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <Navigation />

        {/* Tab Content */}
        <div className="p-8 max-w-6xl mx-auto w-full space-y-8">

          {/* ── DASHBOARD TAB ── */}
          {tab === "dashboard" && (
            <>
              <section className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-[#111111] dark:text-white tracking-tight">Welcome back, {firstName}! 👋</h2>
                  <p className="text-[#64748B] dark:text-[#94A3B8]">
                    {weeklyPct >= 100 ? "You've crushed your weekly goals. Incredible work!" : weeklyPct >= 50 ? `You've completed ${weeklyPct}% of your weekly goals. Keep it up!` : "Start studying to hit your weekly goals."}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-[#1A1A1A] p-2 rounded-xl border border-slate-200 dark:border-[#2D3748]">
                  <div className="p-2 bg-[#6366F1]/20 rounded-lg text-[#6366F1]"><Zap className="h-5 w-5" /></div>
                  <div className="pr-4">
                    <p className="text-[10px] uppercase font-bold text-[#94A3B8]">Current Streak</p>
                    <p className="text-lg font-black text-[#111111] dark:text-white leading-none">{streak} {streak === 1 ? "Day" : "Days"}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#111111] dark:text-white">Continue Learning</h3>
                  <button onClick={() => setTab("lessons")} className="text-[#6366F1] text-sm font-semibold hover:underline">View all courses</button>
                </div>
                {lastLesson ? (
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] p-[1px] shadow-xl shadow-[#6366F1]/20">
                    <div className="bg-white dark:bg-[#111111] rounded-[11px] p-6 flex flex-col md:flex-row gap-6 items-center">
                      <div className="flex-1 space-y-4">
                        <div>
                          <span className="px-2 py-1 rounded-md bg-[#6366F1]/10 text-[#6366F1] text-[10px] font-bold uppercase tracking-widest">In Progress</span>
                          <h4 className="text-2xl font-bold text-[#111111] dark:text-white mt-2">{lastLesson.courseTitle}</h4>
                          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mt-1">{lastLesson.subjectName} · {lastLesson.title}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-[#94A3B8]">Course Progress</span>
                            <span className="text-[#6366F1]">{lastLesson.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-[#2D3748] rounded-full overflow-hidden">
                            <div className="h-full bg-[#6366F1] rounded-full" style={{ width: `${lastLesson.progress}%` }} />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Link href={lastLesson.href} className="flex items-center gap-2 bg-[#6366F1] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#4F46E5] transition-colors">
                            <Play className="h-4 w-4" /> Resume Lesson
                          </Link>
                          <button onClick={() => setTab("lessons")} className="p-2.5 rounded-xl border border-slate-200 dark:border-[#2D3748] text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1A1A1A] transition-colors">
                            <Bookmark className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="w-full md:w-72 aspect-video bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 dark:from-[#6366F1]/10 dark:to-[#8B5CF6]/10 rounded-xl flex items-center justify-center">
                        <div className="h-14 w-14 bg-[#6366F1]/20 rounded-full flex items-center justify-center">
                          <Play className="h-7 w-7 text-[#6366F1]" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#E2E8F0] dark:border-[#2D3748] p-10 text-center">
                    <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mb-4">You haven&apos;t started any lessons yet.</p>
                    <button onClick={() => setTab("lessons")} className="inline-flex items-center gap-2 bg-[#6366F1] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#4F46E5] transition-colors">
                      <BookOpen className="h-4 w-4" /> Browse Courses
                    </button>
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#111111] dark:text-white">AI-Recommended Quizzes</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-tight border border-emerald-500/20">Based on performance</span>
                  </div>
                  <button onClick={() => setTab("quizzes")} className="text-[#94A3B8] hover:text-[#6366F1] transition-colors"><RefreshCw className="h-4 w-4" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {RECOMMENDED_QUIZZES.map((q) => (
                    <div key={q.title} className="bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2D3748] rounded-xl p-5 hover:border-[#6366F1]/40 transition-all group">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: q.iconBg, color: q.iconColor }}>{q.icon}</div>
                      <h5 className="text-lg font-bold text-[#111111] dark:text-white mb-1">{q.title}</h5>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-4 line-clamp-2">{q.desc}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#2D3748]">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> {q.meta.split("·")[0].trim()}</span>
                          <span className="flex items-center gap-1"><BarChart2 className="h-3 w-3" /> {q.meta.split("·")[1].trim()}</span>
                        </div>
                        <Link href={q.href} className="text-[#6366F1] font-black text-xs group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                          START <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8">
                <div className="md:col-span-3 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2D3748] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-[#111111] dark:text-white">Learning Activity</h3>
                    <span className="bg-slate-100 dark:bg-[#2D3748] rounded-lg text-xs font-bold text-[#64748B] dark:text-[#94A3B8] py-1 px-3">Last 7 Days</span>
                  </div>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {weekly.map((count, i) => (
                      <div key={i} className="flex-1">
                        <div className="w-full bg-[#6366F1]/20 hover:bg-[#6366F1] transition-colors rounded-t-lg" style={{ height: `${Math.max(8, Math.round((count / maxActivity) * 100))}%`, minHeight: "8px" }} title={`${count} lessons`} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    {DAY_LABELS.map((d) => <span key={d}>{d}</span>)}
                  </div>
                </div>
                <div className="bg-[#6366F1] p-6 rounded-xl text-white flex flex-col justify-between shadow-lg shadow-[#6366F1]/30">
                  <div className="space-y-4">
                    <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center"><Trophy className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-medium text-white/80">Lessons Done</p>
                      <p className="text-3xl font-black tracking-tight">{totalCompleted}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/20">
                    <p className="text-xs font-bold">{weeklyCompleted} this week · {streak > 0 ? `${streak}d streak 🔥` : "Start your streak!"}</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── LESSONS TAB ── */}
          {tab === "lessons" && (
            <>
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-[#111111] dark:text-white tracking-tight">Lessons</h2>
                <p className="text-[#64748B] dark:text-[#94A3B8]">Pick a subject and dive into structured AI-generated courses.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
                {SUBJECT_ITEMS.map((s) => {
                  const def = SUBJECT_ICON_MAP[s.id];
                  return (
                    <Link key={s.id} href={`/learn/${s.id}`}>
                      <div className="group relative flex flex-col overflow-hidden rounded-2xl h-full min-h-[120px] transition-all hover:shadow-md cursor-pointer">
                        <SubjectShaderCard subjectId={s.id} />
                        <div className="relative z-10 flex flex-col p-5 h-full">
                          {def && <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}><def.Icon className="h-5 w-5" /></div>}
                          <h3 className="text-sm font-bold text-white mb-0.5">{s.name}</h3>
                          <p className="text-xs text-white/60">{s.courses} courses</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* ── QUIZZES TAB ── */}
          {tab === "quizzes" && (
            <>
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-[#111111] dark:text-white tracking-tight">Quizzes</h2>
                <p className="text-[#64748B] dark:text-[#94A3B8]">Test your knowledge with AI-generated quizzes for any subject.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
                {SUBJECT_ITEMS.map((s) => {
                  const def = SUBJECT_ICON_MAP[s.id];
                  return (
                    <Link key={s.id} href={`/${s.id}/quiz`}>
                      <div className="group relative flex flex-col overflow-hidden rounded-2xl h-full min-h-[120px] transition-all hover:shadow-md cursor-pointer">
                        <SubjectShaderCard subjectId={s.id} />
                        <div className="relative z-10 flex flex-col p-5 h-full">
                          {def && <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}><def.Icon className="h-5 w-5" /></div>}
                          <h3 className="text-sm font-bold text-white mb-0.5">{s.name}</h3>
                          <p className="text-xs text-white/60">Start a quiz</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* ── PROGRESS TAB ── */}
          {tab === "progress" && (
            <>
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-[#111111] dark:text-white tracking-tight">Your Progress</h2>
                <p className="text-[#64748B] dark:text-[#94A3B8]">Track your learning activity and achievements.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Lessons", value: totalCompleted, sub: "completed" },
                  { label: "This Week", value: weeklyCompleted, sub: "lessons" },
                  { label: "Day Streak", value: streak, sub: streak === 1 ? "day" : "days" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2D3748] rounded-xl p-6">
                    <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className="text-4xl font-black text-[#111111] dark:text-white">{stat.value}</p>
                    <p className="text-xs text-[#64748B] mt-1">{stat.sub}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2D3748] rounded-xl p-6 pb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-[#111111] dark:text-white">Learning Activity</h3>
                  <span className="bg-slate-100 dark:bg-[#2D3748] rounded-lg text-xs font-bold text-[#64748B] dark:text-[#94A3B8] py-1 px-3">Last 7 Days</span>
                </div>
                <div className="h-56 flex items-end justify-between gap-3">
                  {weekly.map((count, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-bold text-[#94A3B8]">{count > 0 ? count : ""}</span>
                      <div className="w-full bg-[#6366F1]/20 hover:bg-[#6366F1] transition-colors rounded-t-lg" style={{ height: `${Math.max(6, Math.round((count / maxActivity) * 100))}%`, minHeight: "6px" }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                  {DAY_LABELS.map((d) => <span key={d}>{d}</span>)}
                </div>
              </div>
            </>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === "settings" && (
            <>
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-[#111111] dark:text-white tracking-tight">Settings</h2>
                <p className="text-[#64748B] dark:text-[#94A3B8]">Manage your account and preferences.</p>
              </div>

              <div className="space-y-4 pb-8">
                <div className="bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2D3748] rounded-xl p-6">
                  <h3 className="font-bold text-[#111111] dark:text-white mb-4">Account</h3>
                  <div className="flex items-center gap-4">
                    <UserButton />
                    <div>
                      <p className="font-semibold text-[#111111] dark:text-white">{firstName}</p>
                      <p className="text-xs text-[#94A3B8]">Click your avatar to manage account details</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2D3748] rounded-xl p-6">
                  <h3 className="font-bold text-[#111111] dark:text-white mb-1">Subscription</h3>
                  <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-4">Manage your plan and billing.</p>
                  <Link href="/subscription" className="inline-flex items-center gap-2 bg-[#6366F1] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#4F46E5] transition-colors">
                    Manage Subscription <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>

                <div className="bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2D3748] rounded-xl p-6">
                  <h3 className="font-bold text-[#111111] dark:text-white mb-1">Study Tools</h3>
                  <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-4">Access all Thinkio features.</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Library", href: "/library" },
                      { label: "Upload Notes", href: "/upload" },
                      { label: "Build Roadmap", href: "/roadmap" },
                      { label: "Browse Subjects", href: "/subjects" },
                    ].map((l) => (
                      <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 border border-[#E2E8F0] dark:border-[#2D3748] rounded-lg px-3 py-1.5 text-sm text-[#64748B] dark:text-[#94A3B8] hover:border-[#6366F1] hover:text-[#6366F1] transition-colors">
                        {l.label} <ExternalLink className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
