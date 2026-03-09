"use client";

import { subjects } from "@/lib/subjects";
import type { Subject } from "@/lib/subjects";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ElegantShape } from "@/components/ui/shape-landing-hero";
import { TEST_DATE_OPTIONS, setTestDate } from "@/lib/test-date";
import type { TestDate } from "@/lib/test-date";

const SUBJECT_COLORS: Record<string, string> = {
  mathematics:      "linear-gradient(135deg,#1d4ed8,#3b82f6)",
  physics:          "linear-gradient(135deg,#7c3aed,#a855f7)",
  chemistry:        "linear-gradient(135deg,#15803d,#22c55e)",
  history:          "linear-gradient(135deg,#b45309,#f59e0b)",
  biology:          "linear-gradient(135deg,#065f46,#10b981)",
  geography:        "linear-gradient(135deg,#0e7490,#22d3ee)",
  english:          "linear-gradient(135deg,#3730a3,#6366f1)",
  "computer-science":"linear-gradient(135deg,#334155,#64748b)",
};

const FEATURES = [
  { icon: "🧠", title: "AI Quizzes",        desc: "Multiple-choice questions with instant feedback and detailed explanations." },
  { icon: "🃏", title: "Flash Cards",        desc: "Smart flip cards that reinforce what you know and surface what you don't." },
  { icon: "📖", title: "Structured Lessons", desc: "Generated lessons with key concepts, examples, and takeaways." },
  { icon: "✏️",  title: "Practice Problems",  desc: "Step-by-step math & science problems with hints and full solutions." },
  { icon: "📝", title: "Essay Grader",       desc: "Detailed feedback on grammar, structure, clarity, and argumentation." },
  { icon: "💻", title: "Coding Exercises",   desc: "Real problems with test cases, hints, and reference solutions." },
];

const STEPS = [
  { n: "01", title: "Pick a subject",   desc: "Choose from 8 built-in subjects — or upload your own notes." },
  { n: "02", title: "Select a mode",    desc: "Quiz, flash cards, lesson, problems, essay, or coding." },
  { n: "03", title: "Study with AI",    desc: "Fresh, personalised content is generated every single time." },
];

export default function Home() {
  const router = useRouter();
  const [modalSubject, setModalSubject] = useState<Subject | null>(null);

  function handleSubjectClick(s: Subject) {
    setModalSubject(s);
  }

  function handleTestDatePick(value: TestDate) {
    if (!modalSubject) return;
    setTestDate(modalSubject.id, value);
    setModalSubject(null);
    router.push(`/upload?subject=${modalSubject.id}`);
  }

  return (
    <main className="relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb w-[600px] h-[600px] top-[-15%] left-[-10%]"
          style={{ background: "radial-gradient(circle,rgba(124,58,237,0.18),transparent 70%)" }} />
        <div className="orb w-[500px] h-[500px] bottom-[5%] right-[-10%]"
          style={{ background: "radial-gradient(circle,rgba(6,182,212,0.14),transparent 70%)" }} />
        <ElegantShape delay={0.3} width={560} height={130} rotate={12}  gradient="from-indigo-500/[0.12]" className="left-[-8%]  top-[22%]" />
        <ElegantShape delay={0.5} width={440} height={110} rotate={-15} gradient="from-rose-500/[0.12]"   className="right-[-4%] top-[68%]" />
        <ElegantShape delay={0.4} width={280} height={70}  rotate={-8}  gradient="from-violet-500/[0.12]" className="left-[8%]   bottom-[8%]" />
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative max-w-5xl mx-auto px-5 pt-28 pb-24 text-center">
        <div className="fade-up fade-up-1 inline-flex items-center gap-2 badge mb-7">
          <span>✨</span> AI for all school and university levels
        </div>

        <h1 className="fade-up fade-up-1 text-5xl sm:text-6xl md:text-[4.5rem] font-bold tracking-tight leading-[1.07] mb-5">
          Pass exams &amp; achieve<br />
          <span className="text-gradient">better grades — faster.</span>
        </h1>

        <p className="fade-up fade-up-3 text-base sm:text-lg max-w-xl mx-auto mb-10"
          style={{ color: "rgba(255,255,255,0.4)" }}>
          Upload your notes or pick a subject. LearnAI generates quizzes, flash cards,
          lessons, and more — fresh every time.
        </p>

        <div className="fade-up fade-up-3 flex items-center justify-center gap-3 flex-wrap mb-16">
          <a href="#subjects" className="btn-primary">
            Start Learning Free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <Link href="/upload" className="btn-secondary">Upload Your Notes</Link>
        </div>

        {/* Stats */}
        <div className="fade-up fade-up-3 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl mx-auto">
          {[
            { v: "8",    l: "Subjects" },
            { v: "6+",   l: "Study Modes" },
            { v: "∞",    l: "Questions" },
            { v: "100%", l: "AI Generated" },
          ].map(({ v, l }) => (
            <div key={l} className="text-center">
              <div className="text-3xl font-bold text-gradient mb-1">{v}</div>
              <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative max-w-5xl mx-auto px-5 pb-28">
        <div className="text-center mb-14">
          <p className="section-label">HOW IT WORKS</p>
          <h2 className="section-title">Three steps to better grades</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="card-glow rounded-2xl p-7 relative overflow-hidden">
              <div className="absolute top-4 right-5 text-4xl font-black select-none"
                style={{ color: "rgba(139,92,246,0.08)", fontVariantNumeric: "tabular-nums" }}>
                {s.n}
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-5"
                style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", color: "#c4b5fd" }}>
                {s.n}
              </div>
              <h3 className="font-semibold text-white/90 mb-2">{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" className="relative max-w-5xl mx-auto px-5 pb-28">
        <div className="text-center mb-14">
          <p className="section-label">LEARNING MODES</p>
          <h2 className="section-title">Everything you need to study</h2>
          <p className="section-sub">Six powerful modes, all powered by AI — tailored to your subject and topic.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-glow rounded-2xl p-7">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white/90 mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUBJECTS ─────────────────────────────────────────────────── */}
      <section id="subjects" className="relative max-w-5xl mx-auto px-5 pb-28">
        <div className="text-center mb-14">
          <p className="section-label">SUBJECTS</p>
          <h2 className="section-title">Pick your subject</h2>
          <p className="section-sub">All subjects include quizzes, flash cards, lessons, and more.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((s) => (
            <button key={s.id} onClick={() => handleSubjectClick(s)}
              className="relative rounded-2xl p-5 text-left group overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: SUBJECT_COLORS[s.id] ?? "var(--surface)" }}>
              {/* shine overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 60%)" }} />
              <div className="text-3xl mb-3">{s.emoji}</div>
              <h3 className="font-semibold text-white mb-0.5">{s.name}</h3>
              <p className="text-xs text-white/60">{s.topics.length} topics</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── UPLOAD CTA ───────────────────────────────────────────────── */}
      <section className="relative max-w-5xl mx-auto px-5 pb-28">
        <div className="card-glow rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.12) 0%,rgba(6,182,212,0.06) 100%)" }} />
          <p className="section-label mb-4">YOUR OWN MATERIAL</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-snug">
            Have your own notes?<br />
            <span className="text-gradient">Upload &amp; generate instantly.</span>
          </h2>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.35)" }}>
            Drop in a PDF, Word doc, image, or paste plain text — AI turns it into
            quizzes, flash cards, and lessons in seconds.
          </p>
          <Link href="/upload" className="btn-primary">
            Upload Your Notes
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ── TEST DATE MODAL ──────────────────────────────────────────── */}
      {modalSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setModalSubject(null)}>
          <div className="relative max-w-md w-full mx-4 rounded-3xl p-8 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}>
            {/* close */}
            <button onClick={() => setModalSubject(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
              style={{ background: "var(--surface-2)", color: "rgba(255,255,255,0.4)" }}>✕</button>

            {/* subject pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ background: SUBJECT_COLORS[modalSubject.id] ?? "var(--surface-2)" }}>
              <span>{modalSubject.emoji}</span>
              <span className="text-white">{modalSubject.name}</span>
            </div>

            <h2 className="text-2xl font-bold text-white/90 mb-2">Kada je tvoj test?</h2>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
              AI prilagođava sadržaj u zavisnosti od toga koliko vremena imaš.
            </p>

            <div className="flex flex-col gap-3">
              {TEST_DATE_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => handleTestDatePick(opt.value)}
                  className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-left font-medium transition-all group"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "rgba(255,255,255,0.7)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "#c4b5fd";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                  }}>
                  <span className="text-2xl">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-5 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>L</div>
              <span className="font-semibold tracking-tight text-white/90">LearnAI</span>
            </a>
            <div className="flex items-center gap-6">
              {[
                { href: "#how-it-works", label: "How it works" },
                { href: "#features",     label: "Features" },
                { href: "#subjects",     label: "Subjects" },
                { href: "/upload",       label: "Upload" },
              ].map(({ href, label }) => (
                <a key={label} href={href}
                  className="text-xs transition-colors hover:text-white/70"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  {label}
                </a>
              ))}
            </div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              © 2025 LearnAI · AI-powered study platform
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
