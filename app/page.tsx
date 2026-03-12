import { Zap, BookOpen, Lightbulb, GraduationCap, Upload, Grid3x3, ArrowRight } from "lucide-react";
import { BadgePill } from "@/components/BadgePill";
import { FeatureCard } from "@/components/FeatureCard";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { PricingSection } from "@/components/blocks/pricing-section";
import { FloatingShapes } from "@/components/ui/shape-landing-hero";
import { subjects } from "@/lib/subjects";
import { SmartLink } from "@/components/SmartLink";
import Link from "next/link";
import MotionButton from "@/components/ui/motion-button";

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
            Think{" "}
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


          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <Link href="/subjects">
              <MotionButton label="Get started" />
            </Link>
            <Link href="/upload">
              <MotionButton label="Upload your notes" />
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll Animation Mockup */}
      <ContainerScroll titleComponent={<></>}>
        <div className="h-full w-full overflow-y-auto bg-[#111111] p-6 font-sans">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Mathematics · Calculus I</p>
              <h2 className="text-base font-bold text-white">Quiz — Chapter 4</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" }}>7 / 10</div>
              <div className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)" }}>4:32</div>
            </div>
          </div>
          <div className="mb-6 h-1 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full w-[70%] rounded-full bg-white" />
          </div>
          <div className="mb-5 rounded-2xl p-5" style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Question 7</p>
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
          <div className="mt-4 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="mb-1 text-[10px] font-bold text-white/50">AI Explanation</p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Using the power rule: d/dx[xⁿ] = nxⁿ⁻¹. So x³ → 3x², 2x² → 4x, and −5x → −5. Constant vanishes.</p>
          </div>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-[#111111] bg-white">
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

      {/* Social Proof Cards */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Left — Grade improvement */}
            <div className="relative overflow-hidden rounded-3xl bg-[#1D4ED8] p-8 md:p-10">
              <h3 className="mb-10 text-2xl font-black leading-tight text-white md:text-[28px]">
                Improve your grade or<br/>get your money back
              </h3>

              {/* Grade scale */}
              <div className="relative mb-8">
                {/* Arrow labels */}
                <div className="mb-3 flex items-end justify-between px-2">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-center text-[11px] font-semibold leading-tight text-white/75">Your Current<br/>Grade</span>
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                      <path d="M8 0 L8 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M3 10 L8 16 L13 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-center text-[11px] font-semibold leading-tight text-white/75">Your Grade<br/>with Thinkio</span>
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                      <path d="M8 0 L8 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M3 10 L8 16 L13 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                </div>

                {/* Dots + line */}
                <div className="relative flex items-center justify-between px-1">
                  <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-white/30" />
                  {["F","D","C","B","A+"].map((g, i) => (
                    <div key={g} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`h-4 w-4 rounded-full border-2 border-white ${i === 1 ? "bg-white scale-125" : i === 4 ? "bg-white scale-125" : "bg-[#1D4ED8]"}`} />
                      <span className="text-[11px] font-bold text-white/60">{g}</span>
                    </div>
                  ))}
                </div>

                {/* Swoosh arrow */}
                <div className="mt-3 flex justify-center">
                  <svg width="220" height="40" viewBox="0 0 220 40" fill="none">
                    <path d="M30 30 Q110 5 185 22" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M178 15 L186 22 L177 27" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              </div>

              <p className="text-2xl font-black text-white">2 grade levels up —</p>
              <p className="text-2xl font-black text-[#F59E0B]">guaranteed</p>
            </div>

            {/* Right — Price comparison */}
            <div className="relative overflow-hidden rounded-3xl bg-[#F59E0B] p-8 md:p-10">
              <h3 className="mb-8 text-2xl font-black leading-tight text-[#0f2a50] md:text-[28px]">
                AI tutoring vs.<br/>Traditional Tutoring
              </h3>

              {/* Bar chart */}
              <div className="flex items-end gap-8 px-4" style={{ height: "200px" }}>
                {/* Traditional — tall bar */}
                <div className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-center text-[11px] font-bold leading-tight text-[#0f2a50]/70">Traditional<br/>Tutoring Costs</span>
                  <div className="w-full flex-1 rounded-t-xl bg-[#1D4ED8]" style={{ minHeight: "160px" }} />
                </div>
                {/* Thinkio — very short bar */}
                <div className="flex flex-1 flex-col items-center justify-end gap-2" style={{ height: "100%" }}>
                  <span className="text-center text-[11px] font-bold leading-tight text-[#0f2a50]/70">Thinkio AI</span>
                  <div className="w-full rounded-t-xl bg-white" style={{ height: "11px" }} />
                </div>
              </div>

              {/* Arrow + label */}
              <div className="mt-4 flex items-center gap-3">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 4 L14 20" stroke="#0f2a50" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M7 14 L14 22 L21 14" stroke="#0f2a50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                <div>
                  <p className="text-4xl font-black text-[#0f2a50]">19× cheaper</p>
                  <p className="text-sm font-semibold text-[#0f2a50]/60">than a private tutor</p>
                </div>
              </div>
            </div>

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
            {subjects.map((s) => (
              <SmartLink key={s.id} href={`/subject/${s.id}`}>
                <div className="group flex flex-col rounded-2xl border p-6 transition-all hover:shadow-md" style={{ background: `${s.iconColor}12`, borderColor: `${s.iconColor}30` }}>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${s.iconColor}25` }}>
                    <span className="material-symbols-outlined text-2xl leading-none" style={{ color: s.iconColor }}>{s.icon}</span>
                  </div>
                  <span className="mb-1 text-base font-bold text-[#111111] dark:text-white">{s.name}</span>
                  <span className="text-xs text-[#94A3B8]">{s.topics.length} topics</span>
                </div>
              </SmartLink>
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
              { n: "03.", title: "Save your results", desc: "Save generated quizzes, flashcards, lessons, and problems to your personal library for later review." },
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

      {/* Exam Prep */}
      <section className="bg-[#0D0D0D] px-6 py-16 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
            {/* Left */}
            <div className="flex-1">
              <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[#F59E0B]">EXAM PREP</div>
              <h2 className="mb-5 text-3xl font-black leading-tight tracking-[-0.02em] text-white md:text-5xl">
                Your personalized<br />
                <span className="text-[#F59E0B]">study roadmap.</span>
              </h2>
              <p className="mb-8 max-w-md text-sm leading-relaxed text-[#94A3B8]">
                Tell us your exam date and subject. Our AI builds a day-by-day plan with lessons, quizzes, and flashcards timed perfectly so you peak on exam day.
              </p>
              <Link href="/roadmap">
                <MotionButton label="Build my roadmap" />
              </Link>
            </div>

            {/* Right — Realistic Phone mockups */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative h-[580px] w-full max-w-[480px]">

                {/* Glow blobs */}
                <div className="pointer-events-none absolute inset-0">
                  <div style={{ position:"absolute", top:"15%", left:"20%", width:"260px", height:"260px", background:"radial-gradient(ellipse, rgba(139,92,246,0.35) 0%, rgba(59,130,246,0.15) 50%, transparent 75%)", filter:"blur(45px)" }} />
                  <div style={{ position:"absolute", top:"30%", right:"10%", width:"200px", height:"200px", background:"radial-gradient(ellipse, rgba(16,185,129,0.2) 0%, transparent 65%)", filter:"blur(35px)" }} />
                </div>

                {/* ── BACK PHONE (left, tilted -12°) ── */}
                <div style={{ position:"absolute", left:"2%", top:"30px", zIndex:10, transform:"rotate(-12deg) scale(1.28)", transformOrigin:"top left", filter:"drop-shadow(-8px 24px 40px rgba(139,92,246,0.35))" }}>
                  {/* Titanium frame outer */}
                  <div style={{ background:"linear-gradient(145deg,#c8c8ca 0%,#636366 30%,#48484a 55%,#636366 75%,#c8c8ca 100%)", borderRadius:"44px", padding:"2.5px", position:"relative" }}>
                    {/* Volume buttons */}
                    <div style={{ position:"absolute", left:"-4px", top:"80px", width:"3px", height:"28px", background:"linear-gradient(180deg,#8e8e93,#636366)", borderRadius:"2px 0 0 2px" }} />
                    <div style={{ position:"absolute", left:"-4px", top:"118px", width:"3px", height:"28px", background:"linear-gradient(180deg,#8e8e93,#636366)", borderRadius:"2px 0 0 2px" }} />
                    {/* Power button */}
                    <div style={{ position:"absolute", right:"-4px", top:"96px", width:"3px", height:"36px", background:"linear-gradient(180deg,#8e8e93,#636366)", borderRadius:"0 2px 2px 0" }} />
                    {/* Screen */}
                    <div style={{ background:"#0a0a0a", borderRadius:"42px", overflow:"hidden", width:"210px" }}>
                      {/* Dynamic Island */}
                      <div style={{ display:"flex", justifyContent:"center", paddingTop:"10px", paddingBottom:"4px", background:"#0a0a0a" }}>
                        <div style={{ height:"22px", width:"88px", background:"#000", borderRadius:"20px" }} />
                      </div>
                      {/* Status bar */}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"2px 20px 0" }}>
                        <span style={{ fontSize:"10px", fontWeight:"700", color:"rgba(255,255,255,0.75)" }}>9:41</span>
                        <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                          <svg width="11" height="9" viewBox="0 0 10 8" fill="none"><rect x="0" y="2" width="2" height="6" rx="0.5" fill="white" fillOpacity="0.5"/><rect x="3" y="1" width="2" height="7" rx="0.5" fill="white" fillOpacity="0.7"/><rect x="6" y="0" width="2" height="8" rx="0.5" fill="white"/></svg>
                          <svg width="14" height="9" viewBox="0 0 14 8" fill="none"><rect x="0" y="1" width="11" height="6" rx="1.5" stroke="white" strokeOpacity="0.5" strokeWidth="1"/><rect x="12" y="2.5" width="1.5" height="3" rx="0.75" fill="white" fillOpacity="0.4"/><rect x="1" y="2" width="7" height="4" rx="0.5" fill="white"/></svg>
                        </div>
                      </div>
                      {/* Calendar strip */}
                      <div style={{ padding:"8px 12px 6px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between" }}>
                          {[["Thu","20"],["Fri","21"],["Sat","22"],["Sun","23"],["Mon","24"],["Tue","25"],["Wed","26"]].map(([d,n]) => (
                            <div key={d} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2px", borderRadius:"10px", padding:"4px 3px", background: n==="23" ? "rgba(255,255,255,0.12)" : "transparent" }}>
                              <span style={{ fontSize:"7px", fontWeight:"600", color:"rgba(255,255,255,0.35)" }}>{d}</span>
                              {n==="23"
                                ? <span style={{ display:"flex", height:"16px", width:"16px", alignItems:"center", justifyContent:"center", borderRadius:"50%", background:"#10B981", fontSize:"8px", fontWeight:"900", color:"#fff" }}>✓</span>
                                : <span style={{ fontSize:"9px", fontWeight:"700", color:"rgba(255,255,255,0.65)" }}>{n}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Notification pill */}
                      <div style={{ margin:"0 12px 8px", display:"flex", alignItems:"center", justifyContent:"space-between", borderRadius:"12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", padding:"6px 10px" }}>
                        <span style={{ fontSize:"8px", fontWeight:"600", color:"rgba(255,255,255,0.55)" }}>Share with classmates</span>
                        <span style={{ fontSize:"9px", color:"rgba(255,255,255,0.25)" }}>×</span>
                      </div>
                      {/* Title */}
                      <div style={{ padding:"0 16px 8px" }}>
                        <p style={{ fontSize:"13px", fontWeight:"900", color:"#fff", lineHeight:"1.3", margin:"0 0 3px" }}>Derivatives —<br/>Calculus I</p>
                        <p style={{ fontSize:"9px", fontWeight:"600", color:"#F59E0B", margin:0 }}>Exam in 14 days</p>
                      </div>
                      {/* Tabs */}
                      <div style={{ margin:"0 12px 10px", display:"flex", gap:"3px", borderRadius:"20px", background:"rgba(255,255,255,0.05)", padding:"3px" }}>
                        <span style={{ flex:1, borderRadius:"16px", background:"rgba(255,255,255,0.15)", padding:"4px 0", textAlign:"center", fontSize:"8px", fontWeight:"700", color:"#fff" }}>Study Topics</span>
                        <span style={{ flex:1, borderRadius:"16px", padding:"4px 0", textAlign:"center", fontSize:"8px", fontWeight:"600", color:"rgba(255,255,255,0.35)" }}>Progress <span style={{ color:"#10B981" }}>30%</span></span>
                      </div>
                      {/* Topic grid */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px", padding:"0 12px 18px" }}>
                        {[
                          { label:"Limits", pct:76, color:"#3B82F6" },
                          { label:"Derivatives", pct:11, color:"#8B5CF6" },
                          { label:"Integrals", pct:0, color:"#6B7280" },
                          { label:"Chain Rule", pct:0, color:"#6B7280" },
                        ].map((t) => (
                          <div key={t.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", borderRadius:"16px", padding:"10px 6px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
                            <div style={{ position:"relative", height:"34px", width:"34px" }}>
                              <svg viewBox="0 0 36 36" style={{ height:"34px", width:"34px", transform:"rotate(-90deg)" }}>
                                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3"/>
                                <circle cx="18" cy="18" r="14" fill="none" stroke={t.color} strokeWidth="3" strokeDasharray={`${2*Math.PI*14}`} strokeDashoffset={`${2*Math.PI*14*(1-t.pct/100)}`} strokeLinecap="round"/>
                              </svg>
                              <span style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"8px", fontWeight:"900", color:"#fff" }}>{t.pct}%</span>
                            </div>
                            <span style={{ fontSize:"7px", fontWeight:"600", color:"rgba(255,255,255,0.55)", textAlign:"center", lineHeight:"1.2" }}>{t.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── FRONT PHONE (right, tilted +10°) ── */}
                <div style={{ position:"absolute", right:"2%", top:"50px", zIndex:20, transform:"rotate(10deg) scale(1.28)", transformOrigin:"top right", filter:"drop-shadow(8px 28px 44px rgba(59,130,246,0.4))" }}>
                  {/* Titanium frame outer */}
                  <div style={{ background:"linear-gradient(145deg,#c8c8ca 0%,#636366 30%,#48484a 55%,#636366 75%,#c8c8ca 100%)", borderRadius:"44px", padding:"2.5px", position:"relative" }}>
                    {/* Volume buttons */}
                    <div style={{ position:"absolute", left:"-4px", top:"80px", width:"3px", height:"28px", background:"linear-gradient(180deg,#8e8e93,#636366)", borderRadius:"2px 0 0 2px" }} />
                    <div style={{ position:"absolute", left:"-4px", top:"118px", width:"3px", height:"28px", background:"linear-gradient(180deg,#8e8e93,#636366)", borderRadius:"2px 0 0 2px" }} />
                    {/* Power button */}
                    <div style={{ position:"absolute", right:"-4px", top:"96px", width:"3px", height:"36px", background:"linear-gradient(180deg,#8e8e93,#636366)", borderRadius:"0 2px 2px 0" }} />
                    {/* Screen */}
                    <div style={{ background:"#111111", borderRadius:"42px", overflow:"hidden", width:"210px" }}>
                      {/* Dynamic Island */}
                      <div style={{ display:"flex", justifyContent:"center", paddingTop:"10px", paddingBottom:"4px", background:"#111111" }}>
                        <div style={{ height:"22px", width:"88px", background:"#000", borderRadius:"20px" }} />
                      </div>
                      {/* Status bar */}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"2px 20px 0" }}>
                        <span style={{ fontSize:"10px", fontWeight:"700", color:"rgba(255,255,255,0.75)" }}>9:41</span>
                        <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                          <svg width="11" height="9" viewBox="0 0 10 8" fill="none"><rect x="0" y="2" width="2" height="6" rx="0.5" fill="white" fillOpacity="0.5"/><rect x="3" y="1" width="2" height="7" rx="0.5" fill="white" fillOpacity="0.7"/><rect x="6" y="0" width="2" height="8" rx="0.5" fill="white"/></svg>
                          <svg width="14" height="9" viewBox="0 0 14 8" fill="none"><rect x="0" y="1" width="11" height="6" rx="1.5" stroke="white" strokeOpacity="0.5" strokeWidth="1"/><rect x="12" y="2.5" width="1.5" height="3" rx="0.75" fill="white" fillOpacity="0.4"/><rect x="1" y="2" width="7" height="4" rx="0.5" fill="white"/></svg>
                        </div>
                      </div>
                      {/* Top bar */}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 16px 4px" }}>
                        <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)" }}>‹</span>
                        <div style={{ display:"flex", gap:"6px" }}>
                          <span style={{ borderRadius:"20px", background:"rgba(255,255,255,0.07)", padding:"3px 8px", fontSize:"8px", fontWeight:"600", color:"rgba(255,255,255,0.5)" }}>○ Ask</span>
                          <span style={{ borderRadius:"20px", background:"rgba(255,255,255,0.07)", padding:"3px 8px", fontSize:"8px", fontWeight:"600", color:"rgba(255,255,255,0.5)" }}>⋮ More</span>
                        </div>
                      </div>
                      {/* Quiz header */}
                      <div style={{ padding:"4px 16px 10px" }}>
                        <p style={{ fontSize:"7px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(255,255,255,0.3)", margin:"0 0 3px" }}>Mathematics · Calculus I</p>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                          <p style={{ fontSize:"13px", fontWeight:"900", color:"#fff", margin:0 }}>Quiz — Chapter 4</p>
                          <span style={{ borderRadius:"20px", background:"rgba(255,255,255,0.1)", padding:"3px 8px", fontSize:"9px", fontWeight:"700", color:"rgba(255,255,255,0.85)" }}>7 / 10</span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div style={{ margin:"0 16px 10px", height:"3px", borderRadius:"4px", background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
                        <div style={{ height:"100%", width:"70%", background:"#fff", borderRadius:"4px" }} />
                      </div>
                      {/* Question card */}
                      <div style={{ margin:"0 12px 8px", borderRadius:"14px", background:"#1a1a1a", border:"1px solid rgba(255,255,255,0.07)", padding:"10px 12px" }}>
                        <p style={{ fontSize:"7px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.1em", color:"rgba(255,255,255,0.35)", margin:"0 0 5px" }}>Question 7</p>
                        <p style={{ fontSize:"10px", fontWeight:"600", color:"rgba(255,255,255,0.85)", margin:0, lineHeight:"1.4" }}>What is the derivative of f(x) = x³ + 2x² − 5x + 3?</p>
                      </div>
                      {/* Answers */}
                      <div style={{ display:"flex", flexDirection:"column", gap:"5px", padding:"0 12px 10px" }}>
                        {[
                          { l:"A", t:"f′(x) = 3x² + 4x − 5", ok:true, sel:true },
                          { l:"B", t:"f′(x) = 3x² + 2x − 5", ok:false, sel:false },
                          { l:"C", t:"f′(x) = x² + 4x − 5", ok:false, sel:false },
                        ].map((o) => (
                          <div key={o.l} style={{ display:"flex", alignItems:"center", gap:"8px", borderRadius:"10px", padding:"6px 10px", background: o.sel&&o.ok ? "rgba(34,197,94,0.08)" : "transparent", border:`1px solid ${o.sel&&o.ok ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.07)"}` }}>
                            <span style={{ display:"flex", height:"18px", width:"18px", alignItems:"center", justifyContent:"center", borderRadius:"50%", background: o.sel&&o.ok ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)", fontSize:"8px", fontWeight:"700", color: o.sel&&o.ok ? "#86efac" : "rgba(255,255,255,0.4)", flexShrink:0 }}>{o.l}</span>
                            <span style={{ fontSize:"8px", color: o.sel&&o.ok ? "#86efac" : "rgba(255,255,255,0.45)", flex:1 }}>{o.t}</span>
                            {o.sel&&o.ok && <span style={{ fontSize:"8px", color:"#4ade80" }}>✓</span>}
                          </div>
                        ))}
                      </div>
                      {/* AI explanation */}
                      <div style={{ margin:"0 12px 8px", borderRadius:"12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", padding:"8px 10px" }}>
                        <p style={{ fontSize:"7px", fontWeight:"700", color:"rgba(255,255,255,0.4)", margin:"0 0 3px", textTransform:"uppercase", letterSpacing:"0.08em" }}>AI Explanation</p>
                        <p style={{ fontSize:"8px", color:"rgba(255,255,255,0.45)", margin:0, lineHeight:"1.5" }}>Power rule: d/dx[xⁿ] = nxⁿ⁻¹. So x³→3x², 2x²→4x, −5x→−5.</p>
                      </div>
                      {/* Next button */}
                      <div style={{ padding:"0 12px 20px" }}>
                        <div style={{ borderRadius:"20px", background:"#fff", padding:"9px 0", textAlign:"center", fontSize:"10px", fontWeight:"800", color:"#111" }}>Next Question →</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* See Where You Stand */}
      <section className="bg-[#F8FAFC] dark:bg-[#0D0D0D] px-6 py-16 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
            {/* Left — mock progress dashboard */}
            <div className="flex-1 order-2 md:order-1">
              <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-6 shadow-lg">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#111111] dark:text-white">Your Performance</span>
                  <span className="rounded-full bg-[#F0FDF4] dark:bg-[#052e16] px-3 py-1 text-xs font-semibold text-[#16A34A]">↑ Improving</span>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { name: "Mathematics", score: 87, color: "#3B82F6" },
                    { name: "Physics", score: 72, color: "#8B5CF6" },
                    { name: "Chemistry", score: 65, color: "#10B981" },
                    { name: "History", score: 91, color: "#F59E0B" },
                    { name: "Biology", score: 58, color: "#059669" },
                  ].map((s) => (
                    <div key={s.name}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{s.name}</span>
                        <span className="text-xs font-bold" style={{ color: s.color }}>{s.score}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#F1F5F9] dark:bg-[#2D3748]">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${s.score}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#E2E8F0] dark:border-[#2D3748] pt-5">
                  {[
                    { label: "Quizzes taken", value: "142" },
                    { label: "Avg. score", value: "74%" },
                    { label: "Day streak", value: "12 🔥" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-lg font-black text-[#111111] dark:text-white">{stat.value}</div>
                      <div className="text-[10px] text-[#94A3B8]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Right — copy */}
            <div className="flex-1 order-1 md:order-2">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">PROGRESS</div>
              <h2 className="mb-5 text-3xl font-black leading-tight tracking-[-0.02em] text-[#111111] dark:text-white md:text-5xl">
                See where<br />
                <span className="text-[#F59E0B]">you stand.</span>
              </h2>
              <p className="mb-8 max-w-md text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                Track your scores across every subject. Know exactly which topics need work and which ones you've mastered — so you study smarter, not harder.
              </p>
              <Link href="/progress">
                <MotionButton label="View my progress" />
              </Link>
            </div>
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

      {/* Pricing */}
      <PricingSection />

      {/* CTA Banner */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-[#111111] dark:bg-white px-8 py-16 text-center md:px-24 md:py-24">
            <h2 className="mb-8 text-3xl font-black text-white dark:text-[#111111] md:text-5xl">
              Ready to study smarter?
            </h2>
            <div className="mb-6 flex flex-col items-center justify-center gap-4 md:flex-row">
              <Link href="/subjects">
                <MotionButton label="Get started" />
              </Link>
              <Link href="/subjects">
                <MotionButton label="Browse subjects" />
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
