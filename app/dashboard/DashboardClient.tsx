"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Brain, TrendingUp, Settings,
  Zap, Play, Bookmark, RefreshCw, Trophy,
  Timer, BarChart2, ChevronRight, Code2, FlaskConical, Sigma, ExternalLink,
  Plus, Bell, HelpCircle, Share2,
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
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "lessons",   label: "Lessons",   icon: <BookOpen className="h-4 w-4" /> },
  { id: "quizzes",   label: "Quizzes",   icon: <Brain className="h-4 w-4" /> },
  { id: "progress",  label: "Progress",  icon: <TrendingUp className="h-4 w-4" /> },
  { id: "settings",  label: "Settings",  icon: <Settings className="h-4 w-4" /> },
];

const WHATS_NEW = [
  "AI Lesson Generator",
  "Smart Flashcards",
  "Progress Tracking",
];

export function DashboardClient({ firstName, totalCompleted, streak, weekly, weeklyCompleted, weeklyPct, lastLesson }: Props) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const maxActivity = Math.max(...weekly, 1);

  // Build a simple donut for weekly goal
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const filled = (weeklyPct / 100) * circ;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8FA] dark:bg-[#0D0D12]">

      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-[#1E293B] flex flex-col sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1E293B]">
          <Link href="/"><ThinkioLogo /></Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-colors text-left ${
                tab === item.id
                  ? "bg-violet-600 text-white"
                  : "text-gray-600 dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#1A1A2E]"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* What's New */}
        <div className="mx-3 mb-3 rounded-xl border border-gray-200 dark:border-[#1E293B] overflow-hidden">
          <div className="px-3 py-2.5 bg-gray-50 dark:bg-[#1A1A2E] flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-violet-500" />
            <span className="text-[11px] font-bold text-gray-500 dark:text-[#64748B] uppercase tracking-widest">What&apos;s New</span>
          </div>
          {WHATS_NEW.map((item, i) => (
            <div key={item} className={`flex items-center justify-between px-3 py-2 dark:bg-[#111111] ${i < WHATS_NEW.length - 1 ? "border-b border-gray-100 dark:border-[#1E293B]" : ""}`}>
              <span className="text-[12px] text-gray-700 dark:text-[#CBD5E1]">{item}</span>
              <Plus className="h-3.5 w-3.5 text-violet-400 shrink-0" />
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navigation />

        <div className="flex-1 overflow-y-auto">

          {/* ── DASHBOARD TAB ── */}
          {tab === "dashboard" && (
            <div className="p-6 space-y-4">

              {/* Page header */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{firstName}</h1>
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A2E] text-gray-400"><Share2 className="h-4 w-4" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A2E] text-gray-400"><Bell className="h-4 w-4" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A2E] text-gray-400"><HelpCircle className="h-4 w-4" /></button>
                  <Link href="/subscription" className="ml-1 px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors">Upgrade</Link>
                </div>
              </div>

              {/* Banner */}
              <div className="flex items-center justify-between bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                    <Zap className="h-3.5 w-3.5 text-violet-600" />
                  </div>
                  <span className="text-sm text-violet-800 dark:text-violet-300">
                    {weeklyPct >= 100 ? "You've crushed your weekly goals!" : weeklyPct > 0 ? `You've completed ${weeklyPct}% of your weekly goal.` : "Start studying to hit your weekly goals."}
                  </span>
                </div>
                <button onClick={() => setTab("lessons")} className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-800">
                  Start lesson <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* 3-column layout */}
              <div className="grid grid-cols-12 gap-4">

                {/* Left: stacked stat cards */}
                <div className="col-span-12 md:col-span-3 bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1E293B] rounded-xl overflow-hidden">
                  {[
                    { label: "Lessons completed", value: totalCompleted },
                    { label: "This week",          value: weeklyCompleted },
                    { label: "Day streak",         value: streak },
                    { label: "Weekly goal",        value: `${weeklyPct}%` },
                    { label: "Total subjects",     value: 8 },
                  ].map((s, i, arr) => (
                    <div key={s.label} className={`flex items-center justify-between px-5 py-4 ${i < arr.length - 1 ? "border-b border-gray-100 dark:border-[#1E293B]" : ""}`}>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-[#334155]" />
                        <span className="text-[13px] text-gray-500 dark:text-[#94A3B8]">{s.label}</span>
                      </div>
                      <span className="text-[15px] font-bold text-gray-900 dark:text-white">{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* Center: progress visual + continue learning */}
                <div className="col-span-12 md:col-span-5 space-y-4">
                  {/* Weekly progress card */}
                  <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1E293B] rounded-xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Learning Progress</h3>
                        <p className="text-xs text-gray-400 dark:text-[#64748B] mt-0.5">Weekly goal completion</p>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-[#64748B] bg-gray-100 dark:bg-[#1E293B] px-2 py-1 rounded-lg">Last 7 days</span>
                    </div>

                    {/* Donut + bar chart side by side */}
                    <div className="flex items-center gap-6">
                      {/* Donut */}
                      <div className="relative flex-shrink-0">
                        <svg width="100" height="100" viewBox="0 0 100 100" className="[&>circle:first-child]:dark:stroke-[#1E293B]">
                          <circle cx="50" cy="50" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="12" />
                          <circle
                            cx="50" cy="50" r={radius}
                            fill="none" stroke="#7C3AED" strokeWidth="12"
                            strokeDasharray={`${filled} ${circ - filled}`}
                            strokeDashoffset={circ / 4}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-lg font-black text-gray-900 dark:text-white">{weeklyPct}%</span>
                          <span className="text-[9px] text-gray-400 dark:text-[#64748B] font-medium">of goal</span>
                        </div>
                      </div>

                      {/* Bar chart */}
                      <div className="flex-1">
                        <div className="flex items-end gap-1 h-16">
                          {weekly.map((count, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                              <div
                                className="w-full rounded-t-sm transition-colors"
                                style={{
                                  height: `${Math.max(4, Math.round((count / maxActivity) * 100))}%`,
                                  minHeight: 4,
                                  background: count > 0 ? "#7C3AED" : "#E5E7EB",
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex mt-1">
                          {DAY_LABELS.map((d) => (
                            <span key={d} className="flex-1 text-center text-[9px] text-gray-400 dark:text-[#475569]">{d}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-[#1E293B]">
                      {[
                        { label: "This week",  value: weeklyCompleted },
                        { label: "Streak",     value: `${streak}d` },
                        { label: "Total",      value: totalCompleted },
                      ].map((s) => (
                        <div key={s.label} className="text-center">
                          <p className="text-base font-bold text-gray-900 dark:text-white">{s.value}</p>
                          <p className="text-[10px] text-gray-400 dark:text-[#64748B]">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Continue learning */}
                  <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1E293B] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Continue Learning</h3>
                      <button onClick={() => setTab("lessons")} className="text-[11px] font-semibold text-violet-600 hover:underline flex items-center gap-0.5">
                        View all <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                    {lastLesson ? (
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold text-violet-500 uppercase tracking-wider mb-0.5">{lastLesson.subjectName}</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{lastLesson.courseTitle}</p>
                          <p className="text-xs text-gray-400 dark:text-[#64748B] truncate mb-2">{lastLesson.title}</p>
                          <div className="w-full h-1.5 bg-gray-100 dark:bg-[#1E293B] rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${lastLesson.progress}%` }} />
                          </div>
                          <p className="text-[10px] text-gray-400 dark:text-[#64748B] mt-1">{lastLesson.progress}% complete</p>
                        </div>
                        <Link href={lastLesson.href} className="flex-shrink-0 flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                          <Play className="h-3.5 w-3.5" /> Resume
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-5 border border-dashed border-gray-200 dark:border-[#1E293B] rounded-xl">
                        <p className="text-sm text-gray-400 dark:text-[#64748B] mb-2">No lessons started yet.</p>
                        <button onClick={() => setTab("lessons")} className="text-xs font-semibold text-violet-600 hover:underline">Browse courses →</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: activity + recommended */}
                <div className="col-span-12 md:col-span-4 space-y-4">
                  {/* Activity card */}
                  <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1E293B] rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1E293B]">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Activity</h3>
                      <p className="text-xs text-gray-400 dark:text-[#64748B] mt-0.5">Last 7 days vs previous</p>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-[#1E293B]">
                      {[
                        { label: "Lessons completed", value: weeklyCompleted, icon: <BookOpen className="h-3.5 w-3.5" />, up: weeklyCompleted > 0 },
                        { label: "Day streak",        value: streak,          icon: <Zap className="h-3.5 w-3.5" />,      up: streak > 0 },
                        { label: "Total lessons",     value: totalCompleted,  icon: <Trophy className="h-3.5 w-3.5" />,   up: totalCompleted > 0 },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between px-5 py-3">
                          <div className="flex items-center gap-2 text-gray-500 dark:text-[#64748B]">
                            {row.icon}
                            <span className="text-[12px]">{row.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {row.up && <span className="text-[10px] text-emerald-500 font-bold">↑</span>}
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{row.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-5 py-3 bg-gray-50 dark:bg-[#1A1A2E] border-t border-gray-100 dark:border-[#1E293B]">
                      <button onClick={() => setTab("progress")} className="text-[11px] font-semibold text-violet-600 hover:underline flex items-center gap-1">
                        View full progress <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Recommended quizzes */}
                  <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1E293B] rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1E293B] flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recommended Quizzes</h3>
                        <p className="text-xs text-gray-400 dark:text-[#64748B] mt-0.5">Based on your activity</p>
                      </div>
                      <button onClick={() => setTab("quizzes")} className="text-[11px] font-semibold text-violet-600 hover:underline">All</button>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-[#1E293B]">
                      {RECOMMENDED_QUIZZES.map((q) => (
                        <Link key={q.title} href={q.href} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-[#1A1A2E] transition-colors group">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: q.iconBg, color: q.iconColor }}>{q.icon}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-gray-800 dark:text-[#CBD5E1] truncate group-hover:text-violet-600 transition-colors">{q.title}</p>
                            <p className="text-[10px] text-gray-400 dark:text-[#64748B]">{q.meta}</p>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-[#334155] shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom: AI quizzes row (like Funding Rounds) */}
              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1E293B] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-[#1E293B]">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">AI-Recommended Quizzes</h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-[#1E293B]">
                  {RECOMMENDED_QUIZZES.map((q) => (
                    <div key={q.title} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: q.iconBg, color: q.iconColor }}>{q.icon}</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{q.title}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] text-gray-400 dark:text-[#64748B] flex items-center gap-1"><Timer className="h-3 w-3" />{q.meta.split("·")[0].trim()}</span>
                            <span className="text-[10px] text-gray-400 dark:text-[#64748B] flex items-center gap-1"><BarChart2 className="h-3 w-3" />{q.meta.split("·")[1].trim()}</span>
                          </div>
                        </div>
                      </div>
                      <Link href={q.href} className="px-4 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors">Start</Link>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ── LESSONS TAB ── */}
          {tab === "lessons" && (
            <div className="p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lessons</h2>
                <p className="text-sm text-gray-500 dark:text-[#64748B] mt-0.5">Pick a subject and dive into AI-generated courses.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            </div>
          )}

          {/* ── QUIZZES TAB ── */}
          {tab === "quizzes" && (
            <div className="p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quizzes</h2>
                <p className="text-sm text-gray-500 dark:text-[#64748B] mt-0.5">Test your knowledge with AI-generated quizzes.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            </div>
          )}

          {/* ── PROGRESS TAB ── */}
          {tab === "progress" && (
            <div className="p-6 space-y-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Progress</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Lessons", value: totalCompleted, sub: "completed" },
                  { label: "This Week",     value: weeklyCompleted, sub: "lessons" },
                  { label: "Day Streak",    value: streak, sub: streak === 1 ? "day" : "days" },
                ].map((s) => (
                  <div key={s.label} className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1E293B] rounded-xl p-6">
                    <p className="text-xs font-bold text-gray-400 dark:text-[#64748B] uppercase tracking-widest mb-2">{s.label}</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white">{s.value}</p>
                    <p className="text-xs text-gray-400 dark:text-[#64748B] mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1E293B] rounded-xl p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Learning Activity</h3>
                  <span className="text-xs text-gray-400 dark:text-[#64748B] bg-gray-100 dark:bg-[#1E293B] px-2.5 py-1 rounded-lg">Last 7 days</span>
                </div>
                <div className="h-52 flex items-end gap-3">
                  {weekly.map((count, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      {count > 0 && <span className="text-[10px] text-gray-400 dark:text-[#64748B]">{count}</span>}
                      <div className="w-full rounded-t-md" style={{ height: `${Math.max(4, Math.round((count / maxActivity) * 100))}%`, minHeight: 4, background: count > 0 ? "#7C3AED" : "#E5E7EB" }} />
                    </div>
                  ))}
                </div>
                <div className="flex mt-2">
                  {DAY_LABELS.map((d) => <span key={d} className="flex-1 text-center text-[10px] text-gray-400 dark:text-[#64748B]">{d}</span>)}
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === "settings" && (
            <div className="p-6 max-w-2xl space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1E293B] rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Account</h3>
                <div className="flex items-center gap-4">
                  <UserButton />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{firstName}</p>
                    <p className="text-xs text-gray-400 dark:text-[#64748B]">Click your avatar to manage account details</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1E293B] rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Subscription</h3>
                <p className="text-sm text-gray-500 dark:text-[#64748B] mb-4">Manage your plan and billing.</p>
                <Link href="/subscription" className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors">
                  Manage Subscription <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1E293B] rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Library",        href: "/library" },
                    { label: "Upload Notes",   href: "/upload" },
                    { label: "Build Roadmap",  href: "/roadmap" },
                    { label: "Browse Subjects",href: "/subjects" },
                  ].map((l) => (
                    <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 border border-gray-200 dark:border-[#1E293B] rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-[#94A3B8] hover:border-violet-400 hover:text-violet-600 transition-colors">
                      {l.label} <ExternalLink className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
