import Link from "next/link";
import { Zap, BookOpen, Lightbulb, GraduationCap, Upload, Grid3x3, Star, ArrowRight, Calculator, Atom, FlaskConical, Landmark, Dna, BookText, TrendingUp, Terminal } from "lucide-react";
import { BadgePill } from "@/components/BadgePill";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { PricingSection } from "@/components/blocks/pricing-section";
import { FloatingShapes } from "@/components/ui/shape-landing-hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] relative overflow-x-hidden">
      <FloatingShapes />
      <Navigation />

      {/* Hero Section */}
      <section className="px-6 pb-20 pt-16 md:pb-32 md:pt-24">
        <div className="mx-auto max-w-[896px] text-center">
          <div className="mb-6 flex justify-center">
            <BadgePill icon={<Zap className="h-4 w-4" />}>
              AI Study Platform
            </BadgePill>
          </div>

          <h1 className="mb-6 text-[42px] font-black leading-[1.05] tracking-[-0.03em] text-[#111111] dark:text-white md:text-[80px]">
            Study{" "}
            <span className="relative inline-block">
              smarter
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8c20-4 40-6 60-4s40 6 60 4 40-6 60-4"
                  stroke="#FDE047"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            ,<br />
            not harder
          </h1>

          <p className="mx-auto mb-8 max-w-[560px] text-base text-[#64748B] dark:text-[#94A3B8]">
            Master any subject with AI-powered quizzes, flashcards, and personalized lessons.
            Upload your notes and start learning in seconds.
          </p>


          <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
            <Link href="/subjects" className="group relative overflow-hidden rounded-full bg-[#111111] dark:bg-white px-8 h-12 flex items-center justify-center text-sm font-bold text-white dark:text-[#111111] w-full md:w-auto">
              <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">Browse subjects</span>
              <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-white dark:text-[#111111] opacity-0 transition-all duration-300 group-hover:opacity-100 translate-x-12 group-hover:translate-x-0">
                <span>Browse subjects</span><ArrowRight className="h-4 w-4" />
              </div>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white/30 dark:bg-[#111111]/30 transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:translate-y-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-white/10" />
            </Link>
            <Link href="/upload" className="group relative overflow-hidden rounded-full border border-[#111111] dark:border-white bg-white dark:bg-transparent px-8 h-12 flex items-center justify-center text-sm font-bold text-[#111111] dark:text-white w-full md:w-auto">
              <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">Upload your notes</span>
              <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 translate-x-12 group-hover:translate-x-0">
                <span>Upload your notes</span><ArrowRight className="h-4 w-4" />
              </div>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#111111] dark:bg-white transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:translate-y-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.8]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll Animation Mockup */}
      <ContainerScroll titleComponent={<></>}>
        <div className="h-full w-full overflow-y-auto bg-[#06060a] p-6 font-sans">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Mathematics · Calculus I</p>
              <h2 className="text-base font-bold text-white">Quiz — Chapter 4</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(137,90,246,0.15)", color: "#c4b5fd" }}>7 / 10</div>
              <div className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)" }}>4:32</div>
            </div>
          </div>
          <div className="mb-6 h-1 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full w-[70%] rounded-full" style={{ background: "linear-gradient(90deg,#7c3aed,#06b6d4)" }} />
          </div>
          <div className="mb-5 rounded-2xl p-5" style={{ background: "#0d0d12", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(137,90,246,0.8)" }}>Question 7</p>
            <p className="text-sm font-semibold leading-relaxed text-white/85">What is the derivative of f(x) = x³ + 2x² − 5x + 3?</p>
          </div>
          <div className="space-y-2">
            {[
              { label: "A", text: "f′(x) = 3x² + 4x − 5", correct: true, selected: true },
              { label: "B", text: "f′(x) = 3x² + 2x − 5", correct: false, selected: false },
              { label: "C", text: "f′(x) = x² + 4x − 5", correct: false, selected: false },
              { label: "D", text: "f′(x) = 3x³ + 4x − 5", correct: false, selected: false },
            ].map((opt) => (
              <div key={opt.label} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium" style={{
                background: opt.selected && opt.correct ? "rgba(34,197,94,0.08)" : opt.selected ? "rgba(239,68,68,0.08)" : "transparent",
                border: `1px solid ${opt.selected && opt.correct ? "rgba(34,197,94,0.4)" : opt.selected ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.07)"}`,
                color: opt.selected && opt.correct ? "#86efac" : opt.selected ? "#fca5a5" : "rgba(255,255,255,0.45)",
              }}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: opt.selected && opt.correct ? "rgba(34,197,94,0.2)" : opt.selected ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)" }}>{opt.label}</span>
                <span className="flex-1">{opt.text}</span>
                {opt.selected && opt.correct && <span className="text-[10px] font-bold text-green-400">✓</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl p-4" style={{ background: "rgba(137,90,246,0.06)", border: "1px solid rgba(137,90,246,0.18)" }}>
            <p className="mb-1 text-[10px] font-bold" style={{ color: "#a78bfa" }}>AI Explanation</p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Using the power rule: d/dx[xⁿ] = nxⁿ⁻¹. So x³ → 3x², 2x² → 4x, and −5x → −5. Constant vanishes.</p>
          </div>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#895af6,#7c3aed)" }}>
            Next Question
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </ContainerScroll>

      {/* Stats Bar */}
      <section className="border-y border-[#E2E8F0] dark:border-[#2D3748] px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { num: "8", label: "Core subjects" },
              { num: "4", label: "Study modes" },
              { num: "< 10s", label: "To generate content" },
              { num: "Free", label: "To get started" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="mb-1 text-3xl font-black text-[#111111] dark:text-white">{s.num}</div>
                <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section id="subjects" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">SUBJECTS</div>
          <h2 className="mb-12 text-3xl font-black tracking-[-0.02em] text-[#111111] dark:text-white md:text-5xl">
            Pick a subject. Jump in.
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { id: "mathematics", name: "Mathematics", topics: 145, icon: <Calculator className="h-5 w-5" /> },
              { id: "physics", name: "Physics", topics: 112, icon: <Atom className="h-5 w-5" /> },
              { id: "chemistry", name: "Chemistry", topics: 89, icon: <FlaskConical className="h-5 w-5" /> },
              { id: "history", name: "History", topics: 76, icon: <Landmark className="h-5 w-5" /> },
              { id: "biology", name: "Biology", topics: 98, icon: <Dna className="h-5 w-5" /> },
              { id: "literature", name: "Literature", topics: 67, icon: <BookText className="h-5 w-5" /> },
              { id: "economics", name: "Economics", topics: 54, icon: <TrendingUp className="h-5 w-5" /> },
              { id: "computer-science", name: "Computer Science", topics: 132, icon: <Terminal className="h-5 w-5" /> },
            ].map((s) => (
              <Link key={s.id} href={`/subject/${s.id}`}>
                <div className="group flex flex-col rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-6 transition-all hover:border-[#CBD5E1] dark:hover:border-[#4A5568] hover:shadow-sm">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F5F9] dark:bg-[#2D3748] text-[#111111] dark:text-white">
                    {s.icon}
                  </div>
                  <span className="mb-1 text-base font-bold text-[#111111] dark:text-white">{s.name}</span>
                  <span className="text-xs text-[#94A3B8]">{s.topics} topics</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-[#F8FAFC] dark:bg-[#0D0D0D] px-6 py-16 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">HOW IT WORKS</div>
          <h2 className="mb-12 text-3xl font-black tracking-[-0.02em] text-[#111111] dark:text-white md:text-5xl">
            Start studying in 3 steps
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              { n: "01.", title: "Choose your subject", desc: "Pick from 8 core subjects or upload your own notes to create a custom study plan." },
              { n: "02.", title: "Learn with AI", desc: "Our AI generates personalized quizzes, flashcards, and lessons tailored to your learning style." },
              { n: "03.", title: "Track progress", desc: "Monitor your improvement with detailed analytics and adaptive difficulty levels." },
            ].map((step) => (
              <div key={step.n}>
                <div className="mb-4 font-serif text-6xl italic text-[#E2E8F0] dark:text-[#2D3748]">{step.n}</div>
                <h3 className="mb-3 text-xl font-bold text-[#111111] dark:text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-16 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">FEATURES</div>
          <h2 className="mb-12 text-3xl font-black tracking-[-0.02em] text-[#111111] dark:text-white md:text-5xl">
            Everything you need to excel
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={<BookOpen />} title="Quiz Mode" description="Test your knowledge with adaptive quizzes that adjust to your skill level in real-time." />
            <FeatureCard icon={<Zap />} title="Flashcards" description="Memorize key concepts with spaced repetition flashcards powered by AI." />
            <FeatureCard icon={<Lightbulb />} title="Lessons" description="Learn complex topics step-by-step with interactive lessons and examples." />
            <FeatureCard icon={<GraduationCap />} title="Practice Problems" description="Solve unlimited practice problems with instant feedback and detailed explanations." />
            <FeatureCard icon={<Upload />} title="Instant Upload" description="Upload your notes, PDFs, or images and get AI-generated study materials instantly." />
            <FeatureCard icon={<Grid3x3 />} title="8 Core Subjects" description="Comprehensive coverage of Math, Science, History, and more with expert-curated content." />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="border-y border-[#E2E8F0] dark:border-[#2D3748] px-6 py-16 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">REVIEWS</div>
          <h2 className="mb-6 text-3xl font-black tracking-[-0.02em] text-[#111111] dark:text-white md:text-5xl">
            Students love Thinkio.
          </h2>
          <div className="mb-12 flex items-center gap-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">4.9 from 281 reviews</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <TestimonialCard quote="Thinkio helped me ace my calculus final. The AI quizzes adapted to exactly what I needed to practice." name="Sarah Chen" role="Engineering Student" />
            <TestimonialCard quote="I went from a C to an A in biology thanks to the flashcards and practice problems. Game changer!" name="Marcus Johnson" role="Pre-Med Student" />
            <TestimonialCard quote="The instant upload feature is incredible. I can study from my lecture notes in seconds." name="Emily Rodriguez" role="Business Major" />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* CTA Banner */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-[#111111] dark:bg-white px-8 py-16 text-center md:px-24 md:py-24">
            <h2 className="mb-8 text-3xl font-black text-white dark:text-[#111111] md:text-5xl">
              Ready to study smarter?
            </h2>
            <div className="mb-6 flex flex-col items-center justify-center gap-3 md:flex-row">
              <Link href="/get-started" className="group relative overflow-hidden rounded-full bg-white dark:bg-[#111111] px-8 h-12 flex items-center justify-center text-sm font-bold text-[#111111] dark:text-white w-full md:w-auto">
                <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">Get started free</span>
                <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-[#111111] dark:text-white opacity-0 transition-all duration-300 group-hover:opacity-100 translate-x-12 group-hover:translate-x-0">
                  <span>Get started free</span><ArrowRight className="h-4 w-4" />
                </div>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#111111]/15 transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:translate-y-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-[#111111]/10" />
              </Link>
              <Link href="/subjects" className="group relative overflow-hidden rounded-full border border-white dark:border-[#111111] bg-transparent px-8 h-12 flex items-center justify-center text-sm font-bold text-white dark:text-[#111111] w-full md:w-auto">
                <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">Browse subjects</span>
                <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-white dark:text-[#111111] opacity-0 transition-all duration-300 group-hover:opacity-100 translate-x-12 group-hover:translate-x-0">
                  <span>Browse subjects</span><ArrowRight className="h-4 w-4" />
                </div>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white/30 dark:bg-[#111111]/30 transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:translate-y-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.8]" />
              </Link>
            </div>
            <p className="text-sm text-[#94A3B8] dark:text-[#64748B]">No credit card required · Cancel anytime</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
