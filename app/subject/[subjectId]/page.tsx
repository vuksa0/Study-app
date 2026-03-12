"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Brain, Zap, Code2, FileText } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { getSubject } from "@/lib/subjects";
import { SUBJECT_ICON_MAP } from "@/components/SubjectIcons";
import { SubjectShaderCard } from "@/components/SubjectShaderCard";

const MODES = [
  { key: "quiz",       label: "Quiz",        icon: Brain,    desc: "Test yourself with AI questions" },
  { key: "lesson",     label: "Lesson",      icon: BookOpen, desc: "Learn step-by-step with AI" },
  { key: "flashcards", label: "Flashcards",  icon: Zap,      desc: "Memorize key concepts fast" },
  { key: "problems",   label: "Problems",    icon: Code2,    desc: "Solve practice problems" },
  { key: "essay",      label: "Essay",       icon: FileText, desc: "Practice writing & analysis" },
];

const STEM = ["mathematics", "physics", "chemistry", "biology", "computer-science"];

export default function SubjectDetail() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;
  const subject = getSubject(subjectId);
  const def = SUBJECT_ICON_MAP[subjectId];
  const isStem = STEM.includes(subjectId);

  const modes = MODES.filter((m) => {
    if (m.key === "problems") return isStem;
    if (m.key === "essay") return !isStem;
    return true;
  });

  if (!subject) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/subjects" className="mb-10 inline-flex items-center gap-2 text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Browse subjects
        </Link>

        {/* Subject hero */}
        <div className="relative overflow-hidden rounded-3xl mb-10" style={{ minHeight: 160 }}>
          <SubjectShaderCard subjectId={subjectId} />
          <div className="relative z-10 flex items-center gap-5 p-8">
            {def && (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl" style={{ background: "rgba(255,255,255,0.15)" }}>
                <def.Icon className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-black text-white mb-1">{subject.name}</h1>
              <p className="text-white/70 text-sm">{subject.topics.length} topics available</p>
            </div>
          </div>
        </div>

        {/* Topics */}
        <h2 className="text-xl font-black text-[#111111] dark:text-white mb-4">Pick a topic</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {subject.topics.map((topic) => (
            <div
              key={topic.id}
              className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-5"
            >
              <h3 className="text-sm font-bold text-[#111111] dark:text-white mb-1">{topic.name}</h3>
              <p className="text-xs text-[#94A3B8] mb-4 line-clamp-2">{topic.description}</p>
              <div className="flex flex-wrap gap-2">
                {modes.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => router.push(`/${subjectId}/${m.key}?topic=${topic.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-[#E2E8F0] dark:border-[#2D3748] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#111111] dark:hover:bg-white hover:text-white dark:hover:text-[#111111] hover:border-[#111111] dark:hover:border-white transition-all"
                  >
                    <m.icon className="h-3 w-3" />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Study all topics */}
        <h2 className="text-xl font-black text-[#111111] dark:text-white mb-4">Or jump in — all topics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => router.push(`/${subjectId}/${m.key}`)}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-5 hover:bg-[#111111] dark:hover:bg-white hover:border-[#111111] dark:hover:border-white transition-all"
            >
              <m.icon className="h-6 w-6 text-[#64748B] dark:text-[#94A3B8] group-hover:text-white dark:group-hover:text-[#111111] transition-colors" />
              <span className="text-sm font-bold text-[#111111] dark:text-white group-hover:text-white dark:group-hover:text-[#111111] transition-colors">{m.label}</span>
              <span className="text-[11px] text-[#94A3B8] group-hover:text-white/70 dark:group-hover:text-[#111111]/60 transition-colors text-center">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
