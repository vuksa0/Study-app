"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Brain, TrendingUp, Settings,
  Play, Zap, Trophy, ExternalLink, ChevronRight, Plus,
  Bell, HelpCircle, Code2, FlaskConical, Sigma,
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
  { icon: <Sigma className="h-5 w-5" />, color: "#3B82F6", title: "Calculus Foundations", meta: "15m · Hard", href: "/mathematics/quiz" },
  { icon: <FlaskConical className="h-5 w-5" />, color: "#10B981", title: "Chemical Reactions", meta: "10m · Medium", href: "/chemistry/quiz" },
  { icon: <Code2 className="h-5 w-5" />, color: "#F97316", title: "Algorithms & Data Structures", meta: "20m · Expert", href: "/computer-science/quiz" },
];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard",  icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "lessons",   label: "Lessons",    icon: <BookOpen className="h-4 w-4" /> },
  { id: "quizzes",   label: "Quizzes",    icon: <Brain className="h-4 w-4" /> },
  { id: "progress",  label: "Progress",   icon: <TrendingUp className="h-4 w-4" /> },
  { id: "settings",  label: "Settings",   icon: <Settings className="h-4 w-4" /> },
];

const WHATS_NEW = [
  { label: "AI Lesson Generator" },
  { label: "Smart Flashcards" },
  { label: "Progress Tracking" },
];

export function DashboardClient({ firstName, totalCompleted, streak, weekly, weeklyCompleted, weeklyPct, lastLesson }: Props) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const maxActivity = Math.max(...weekly, 1);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="px-4 py-4 border-b border-gray-100">
          <Link href="/"><ThinkioLogo /></Link>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                tab === item.id
                  ? "bg-indigo-50 text-indigo-600 border-l-2 border-indigo-600 rounded-l-none pl-[10px]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* What's New */}
        <div className="mx-3 mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">What&apos;s New</span>
          </div>
          {WHATS_NEW.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-200 last:border-0">
              <span className="text-xs text-gray-600">{item.label}</span>
              <Plus className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
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
            <div className="p-6 space-y-5 max-w-7xl mx-auto w-full">

              {/* Page title */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName}</h1>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><Bell className="h-4 w-4" /></button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><HelpCircle className="h-4 w-4" /></button>
                </div>
              </div>

              {/* Banner */}
              {weeklyPct < 100 && (
                <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-sm text-indigo-800 font-medium">
                      {weeklyPct === 0
                        ? "Start studying to hit your weekly goals."
                        : `You've completed ${weeklyPct}% of your weekly goal. Keep going!`}
                    </span>
                  </div>
                  <button onClick={() => setTab("lessons")} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    Start lesson <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* 3-column grid */}
              <div className="grid grid-cols-12 gap-5">

                {/* Left: stat cards */}
                <div className="col-span-12 md:col-span-3 space-y-3">
                  {[
                    { label: "Lessons completed", value: totalCompleted },
                    { label: "This week",          value: weeklyCompleted },
                    { label: "Day streak",         value: streak },
                    { label: "Weekly goal",        value: `${weeklyPct}%` },
                  ].map((s) => (
                    <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">{s.label}</span>
                      <span className="text-xl font-bold text-gray-900">{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* Center: activity chart + continue learning */}
                <div className="col-span-12 md:col-span-6 space-y-5">
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Learning Activity</h3>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">Last 7 days</span>
                    </div>
                    <div className="h-40 flex items-end gap-2">
                      {weekly.map((count, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t-md transition-colors"
                            style={{
                              height: `${Math.max(6, Math.round((count / maxActivity) * 100))}%`,
                              minHeight: 6,
                              background: count > 0 ? "#6366F1" : "#E5E7EB",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-3">
                      {DAY_LABELS.map((d) => (
                        <span key={d} className="flex-1 text-center text-[10px] text-gray-400 font-medium">{d}</span>
                      ))}
                    </div>
                  </div>

                  {/* Continue learning */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Continue Learning</h3>
                      <button onClick={() => setTab("lessons")} className="text-xs text-indigo-600 font-semibold hover:underline">View all</button>
                    </div>
                    {lastLesson ? (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 mb-0.5">{lastLesson.subjectName}</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">{lastLesson.courseTitle}</p>
                          <p className="text-xs text-gray-500 truncate mb-3">{lastLesson.title}</p>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${lastLesson.progress}%` }} />
                          </div>
                          <p className="text-[10px] text-gray-400">{lastLesson.progress}% complete</p>
                        </div>
                        <Link href={lastLesson.href} className="flex-shrink-0 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors">
                          <Play className="h-3.5 w-3.5" /> Resume
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-400 mb-3">No lessons started yet.</p>
                        <button onClick={() => setTab("lessons")} className="text-xs font-semibold text-indigo-600 hover:underline">Browse courses →</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: activity feed */}
                <div className="col-span-12 md:col-span-3 space-y-3">
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Activity</h3>
                    <p className="text-xs text-gray-400 mb-4">Last 7 days</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Lessons done</p>
                          <p className="text-lg font-bold text-gray-900">{weeklyCompleted}</p>
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-indigo-500" />
                        </div>
                      </div>
                      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Day streak</p>
                          <p className="text-lg font-bold text-gray-900">{streak}</p>
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-orange-400" />
                        </div>
                      </div>
                      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Total lessons</p>
                          <p className="text-lg font-bold text-gray-900">{totalCompleted}</p>
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-emerald-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommended quizzes */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">Recommended</h3>
                      <button onClick={() => setTab("quizzes")} className="text-xs text-indigo-600 font-semibold hover:underline">All</button>
                    </div>
                    <div className="space-y-2.5">
                      {RECOMMENDED_QUIZZES.map((q) => (
                        <Link key={q.title} href={q.href} className="flex items-center gap-3 group">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${q.color}18`, color: q.color }}>{q.icon}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">{q.title}</p>
                            <p className="text-[10px] text-gray-400">{q.meta}</p>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── LESSONS TAB ── */}
          {tab === "lessons" && (
            <div className="p-6 max-w-7xl mx-auto w-full space-y-5">
              <h1 className="text-2xl font-bold text-gray-900">Lessons</h1>
              <p className="text-sm text-gray-500 -mt-3">Pick a subject and dive into AI-generated courses.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {SUBJECT_ITEMS.map((s) => {
                  const def = SUBJECT_ICON_MAP[s.id];
                  return (
                    <Link key={s.id} href={`/learn/${s.id}`}>
                      <div className="group relative flex flex-col overflow-hidden rounded-xl h-full min-h-[120px] transition-all hover:shadow-md cursor-pointer">
                        <SubjectShaderCard subjectId={s.id} />
                        <div className="relative z-10 flex flex-col p-5 h-full">
                          {def && <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}><def.Icon className="h-5 w-5" /></div>}
                          <h3 className="text-sm font-semibold text-white mb-0.5">{s.name}</h3>
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
            <div className="p-6 max-w-7xl mx-auto w-full space-y-5">
              <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
              <p className="text-sm text-gray-500 -mt-3">Test your knowledge with AI-generated quizzes.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {SUBJECT_ITEMS.map((s) => {
                  const def = SUBJECT_ICON_MAP[s.id];
                  return (
                    <Link key={s.id} href={`/${s.id}/quiz`}>
                      <div className="group relative flex flex-col overflow-hidden rounded-xl h-full min-h-[120px] transition-all hover:shadow-md cursor-pointer">
                        <SubjectShaderCard subjectId={s.id} />
                        <div className="relative z-10 flex flex-col p-5 h-full">
                          {def && <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}><def.Icon className="h-5 w-5" /></div>}
                          <h3 className="text-sm font-semibold text-white mb-0.5">{s.name}</h3>
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
            <div className="p-6 max-w-7xl mx-auto w-full space-y-5">
              <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Lessons", value: totalCompleted, sub: "completed" },
                  { label: "This Week",     value: weeklyCompleted, sub: "lessons" },
                  { label: "Day Streak",    value: streak, sub: streak === 1 ? "day" : "days" },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{s.label}</p>
                    <p className="text-4xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-gray-900">Learning Activity</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">Last 7 days</span>
                </div>
                <div className="h-52 flex items-end gap-3">
                  {weekly.map((count, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      {count > 0 && <span className="text-[10px] text-gray-400 font-medium">{count}</span>}
                      <div
                        className="w-full rounded-t-md"
                        style={{
                          height: `${Math.max(6, Math.round((count / maxActivity) * 100))}%`,
                          minHeight: 6,
                          background: count > 0 ? "#6366F1" : "#E5E7EB",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex mt-3">
                  {DAY_LABELS.map((d) => (
                    <span key={d} className="flex-1 text-center text-[10px] text-gray-400 font-medium">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === "settings" && (
            <div className="p-6 max-w-3xl mx-auto w-full space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Account</h3>
                <div className="flex items-center gap-4">
                  <UserButton />
                  <div>
                    <p className="font-semibold text-gray-900">{firstName}</p>
                    <p className="text-xs text-gray-400">Click your avatar to manage account details</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Subscription</h3>
                <p className="text-sm text-gray-500 mb-4">Manage your plan and billing.</p>
                <Link href="/subscription" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                  Manage Subscription <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Library",         href: "/library" },
                    { label: "Upload Notes",     href: "/upload" },
                    { label: "Build Roadmap",    href: "/roadmap" },
                    { label: "Browse Subjects",  href: "/subjects" },
                  ].map((l) => (
                    <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
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
