"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Brain, Zap, Code2, FileText, Upload, BookOpen } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { getSubject } from "@/lib/subjects";
import { SUBJECT_ICON_MAP } from "@/components/SubjectIcons";
import { SubjectShaderCard } from "@/components/SubjectShaderCard";

const ALL_MODES = [
  { key: "problems",   label: "Problems",   icon: Code2,    desc: "Solve practice problems" },
  { key: "quiz",       label: "Quiz",        icon: Brain,    desc: "Test yourself with AI questions" },
  { key: "flashcards", label: "Flashcards",  icon: Zap,      desc: "Memorize key concepts fast" },
  { key: "lesson",     label: "Lesson",      icon: BookOpen, desc: "Learn step-by-step with AI" },
  { key: "essay",      label: "Essay",       icon: FileText, desc: "Practice writing & analysis" },
  { key: "coding",     label: "Coding",      icon: Code2,    desc: "Solve coding challenges" },
];

export default function SubjectDetail() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;
  const subject = getSubject(subjectId);
  const def = SUBJECT_ICON_MAP[subjectId];

  if (!subject) return null;

  const allowedModes = subject.modes ?? ["quiz", "flashcards", "lesson"];
  const modes = ALL_MODES.filter((m) => allowedModes.includes(m.key as never));

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0D0D12]">
      <Navigation />

      <div className="mx-auto max-w-lg px-5 py-10">

        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>

        {/* Subject hero */}
        <div className="relative overflow-hidden rounded-2xl mb-8" style={{ minHeight: 120 }}>
          <SubjectShaderCard subjectId={subjectId} />
          <div className="relative z-10 flex items-center gap-4 p-6">
            {def && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.15)" }}>
                <def.Icon className="h-6 w-6 text-white" />
              </div>
            )}
            <h1 className="text-2xl font-black text-white">{subject.name}</h1>
          </div>
        </div>

        {/* Upload button */}
        <button
          onClick={() => router.push(`/upload?subject=${subjectId}`)}
          className="w-full flex items-center gap-4 bg-[#111111] dark:bg-white hover:opacity-90 transition-opacity rounded-2xl p-5 mb-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 dark:bg-black/10">
            <Upload className="h-5 w-5 text-white dark:text-[#111111]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white dark:text-[#111111]">Upload your notes</p>
            <p className="text-xs text-white/60 dark:text-[#111111]/60 mt-0.5">PDF, photo, or document → instant study content</p>
          </div>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200 dark:bg-[#1E293B]" />
          <span className="text-xs text-gray-400 dark:text-[#475569] font-medium">or start without notes</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-[#1E293B]" />
        </div>

        {/* Mode buttons */}
        <div className="grid grid-cols-1 gap-3">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => router.push(`/${subjectId}/${m.key}`)}
              className="flex items-center gap-4 bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1E293B] hover:border-[#111111] dark:hover:border-white hover:bg-gray-50 dark:hover:bg-[#1A1A2E] transition-all rounded-2xl p-5 group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-[#1A1A2E] group-hover:bg-[#111111] dark:group-hover:bg-white transition-colors">
                <m.icon className="h-5 w-5 text-gray-500 dark:text-[#64748B] group-hover:text-white dark:group-hover:text-[#111111] transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#111111] dark:text-white">{m.label}</p>
                <p className="text-xs text-gray-400 dark:text-[#64748B] mt-0.5">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
