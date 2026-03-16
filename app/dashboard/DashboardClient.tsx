"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen, Upload, Library, TrendingUp, Settings,
  ArrowRight, Zap,
} from "lucide-react";
import { ThinkioLogo } from "@/components/ThinkioLogo";
import { UserButton } from "@clerk/nextjs";
import { SUBJECT_ICON_MAP } from "@/components/SubjectIcons";
import { SubjectShaderCard } from "@/components/SubjectShaderCard";

interface Props {
  firstName: string;
  totalCompleted: number;
  streak: number;
  weekly: number[];
  weeklyCompleted: number;
  weeklyPct: number;
  lastLesson: unknown;
}

const SUBJECTS = [
  { id: "mathematics",      name: "Mathematics"      },
  { id: "physics",          name: "Physics"          },
  { id: "chemistry",        name: "Chemistry"        },
  { id: "history",          name: "History"          },
  { id: "biology",          name: "Biology"          },
  { id: "geography",        name: "Geography"        },
  { id: "english",          name: "English"          },
  { id: "computer-science", name: "Computer Science" },
];

const NAV = [
  { label: "Subjects",   href: "/dashboard",  icon: BookOpen    },
  { label: "Upload",     href: "/upload",     icon: Upload      },
  { label: "Library",    href: "/library",    icon: Library     },
  { label: "Progress",   href: "/progress",   icon: TrendingUp  },
  { label: "Settings",   href: "/subscription", icon: Settings  },
];

export function DashboardClient({ firstName, streak, totalCompleted }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8FA] dark:bg-[#0D0D12]">

      {/* ── Sidebar ── */}
      <aside className="w-52 flex-shrink-0 bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-[#1E293B] flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1E293B]">
          <Link href="/"><ThinkioLogo /></Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                pathname === href
                  ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]"
                  : "text-gray-600 dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#1A1A2E]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Stats */}
        <div className="mx-3 mb-3 rounded-xl border border-gray-200 dark:border-[#1E293B] overflow-hidden">
          {[
            { label: "Lessons done", value: totalCompleted },
            { label: "Day streak",   value: `${streak}d`   },
          ].map((s, i) => (
            <div key={s.label} className={`flex items-center justify-between px-3 py-2.5 dark:bg-[#111111] ${i === 0 ? "border-b border-gray-100 dark:border-[#1E293B]" : ""}`}>
              <span className="text-[12px] text-gray-500 dark:text-[#64748B]">{s.label}</span>
              <span className="text-[13px] font-bold text-gray-900 dark:text-white">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="px-4 pb-4 flex items-center gap-2.5">
          <UserButton />
          <span className="text-[13px] font-medium text-gray-700 dark:text-[#CBD5E1] truncate">{firstName}</span>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">Hey, {firstName}</h1>
              <p className="text-sm text-gray-400 dark:text-[#64748B] mt-0.5">What are you studying today?</p>
            </div>
            <Link
              href="/upload"
              className="flex items-center gap-2 bg-[#111111] dark:bg-white hover:opacity-80 transition-opacity text-white dark:text-[#111111] text-sm font-semibold px-5 py-2.5 rounded-full"
            >
              <Upload className="h-4 w-4" />
              Upload notes
            </Link>
          </div>

          {/* Upload banner */}
          <Link href="/upload" className="flex items-center gap-4 bg-[#111111] dark:bg-[#1A1A2E] border border-transparent dark:border-[#1E293B] hover:opacity-90 transition-opacity rounded-2xl px-6 py-4 mb-8 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Upload your notes → instant quiz, flashcards or problems</p>
              <p className="text-xs text-white/50 mt-0.5">PDF, photo, or any document. Results in seconds.</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white/80 transition-colors" />
          </Link>

          {/* Subject grid */}
          <h2 className="text-sm font-bold text-gray-400 dark:text-[#475569] uppercase tracking-widest mb-4">Subjects</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SUBJECTS.map((s) => {
              const def = SUBJECT_ICON_MAP[s.id];
              return (
                <Link key={s.id} href={`/subject/${s.id}`}>
                  <div className="group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-xl">
                    <SubjectShaderCard subjectId={s.id} />
                    <div className="relative z-10 flex flex-col p-5 min-h-[150px] justify-between">
                      <div>
                        {def && (
                          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
                            <def.Icon className="h-4 w-4" />
                          </div>
                        )}
                        <h3 className="text-[14px] font-bold text-white leading-tight">{s.name}</h3>
                      </div>
                      <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors flex items-center gap-1">
                        Start <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}
