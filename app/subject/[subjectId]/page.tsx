"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap, Clock, Calendar, AlertTriangle, Smile } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const subjectData: Record<string, { name: string; color: string; description: string; emoji: string; topics: { name: string; lessons: number; quizzes: number; difficulty: string }[] }> = {
  mathematics: {
    name: "Mathematics", color: "#3B82F6", emoji: "📐",
    description: "Master mathematical concepts from algebra to advanced calculus.",
    topics: [
      { name: "Algebra", lessons: 24, quizzes: 45, difficulty: "Beginner" },
      { name: "Calculus I", lessons: 32, quizzes: 58, difficulty: "Intermediate" },
      { name: "Calculus II", lessons: 28, quizzes: 52, difficulty: "Advanced" },
      { name: "Statistics", lessons: 20, quizzes: 38, difficulty: "Intermediate" },
      { name: "Geometry", lessons: 18, quizzes: 35, difficulty: "Beginner" },
      { name: "Trigonometry", lessons: 16, quizzes: 30, difficulty: "Intermediate" },
    ],
  },
  biology: {
    name: "Biology", color: "#22C55E", emoji: "🧬",
    description: "Explore the living world from cells to ecosystems.",
    topics: [
      { name: "Cell Biology", lessons: 22, quizzes: 40, difficulty: "Beginner" },
      { name: "Genetics", lessons: 26, quizzes: 48, difficulty: "Intermediate" },
      { name: "Ecology", lessons: 18, quizzes: 32, difficulty: "Beginner" },
      { name: "Anatomy", lessons: 30, quizzes: 55, difficulty: "Intermediate" },
      { name: "Evolution", lessons: 15, quizzes: 28, difficulty: "Intermediate" },
      { name: "Microbiology", lessons: 20, quizzes: 36, difficulty: "Advanced" },
    ],
  },
  history: {
    name: "History", color: "#F59E0B", emoji: "📜",
    description: "Journey through time and understand the events that shaped our world.",
    topics: [
      { name: "Ancient Civilizations", lessons: 20, quizzes: 38, difficulty: "Beginner" },
      { name: "Medieval History", lessons: 18, quizzes: 34, difficulty: "Beginner" },
      { name: "World War I", lessons: 14, quizzes: 28, difficulty: "Intermediate" },
      { name: "World War II", lessons: 16, quizzes: 32, difficulty: "Intermediate" },
      { name: "Cold War", lessons: 12, quizzes: 24, difficulty: "Intermediate" },
      { name: "Modern History", lessons: 10, quizzes: 20, difficulty: "Advanced" },
    ],
  },
  physics: {
    name: "Physics", color: "#A855F7", emoji: "⚛️",
    description: "Discover the fundamental laws of nature.",
    topics: [
      { name: "Classical Mechanics", lessons: 28, quizzes: 50, difficulty: "Beginner" },
      { name: "Thermodynamics", lessons: 22, quizzes: 42, difficulty: "Intermediate" },
      { name: "Electromagnetism", lessons: 26, quizzes: 48, difficulty: "Intermediate" },
      { name: "Optics", lessons: 16, quizzes: 30, difficulty: "Intermediate" },
      { name: "Quantum Physics", lessons: 20, quizzes: 36, difficulty: "Advanced" },
      { name: "Relativity", lessons: 14, quizzes: 26, difficulty: "Advanced" },
    ],
  },
  chemistry: {
    name: "Chemistry", color: "#14B8A6", emoji: "🧪",
    description: "Understand matter at the molecular level.",
    topics: [
      { name: "Atomic Structure", lessons: 18, quizzes: 34, difficulty: "Beginner" },
      { name: "Chemical Bonding", lessons: 20, quizzes: 38, difficulty: "Beginner" },
      { name: "Organic Chemistry", lessons: 30, quizzes: 56, difficulty: "Advanced" },
      { name: "Thermochemistry", lessons: 16, quizzes: 30, difficulty: "Intermediate" },
      { name: "Electrochemistry", lessons: 14, quizzes: 26, difficulty: "Advanced" },
      { name: "Acids & Bases", lessons: 12, quizzes: 22, difficulty: "Intermediate" },
    ],
  },
  literature: {
    name: "Literature", color: "#EC4899", emoji: "📚",
    description: "Explore the power of storytelling and great works.",
    topics: [
      { name: "Poetry Analysis", lessons: 16, quizzes: 28, difficulty: "Beginner" },
      { name: "Shakespeare", lessons: 20, quizzes: 36, difficulty: "Intermediate" },
      { name: "Modern Fiction", lessons: 18, quizzes: 32, difficulty: "Intermediate" },
      { name: "Literary Devices", lessons: 14, quizzes: 26, difficulty: "Beginner" },
      { name: "Essay Writing", lessons: 12, quizzes: 20, difficulty: "Intermediate" },
      { name: "Classic Literature", lessons: 22, quizzes: 40, difficulty: "Advanced" },
    ],
  },
  economics: {
    name: "Economics", color: "#6366F1", emoji: "📊",
    description: "Understand how markets work and apply economic thinking.",
    topics: [
      { name: "Microeconomics", lessons: 22, quizzes: 42, difficulty: "Beginner" },
      { name: "Macroeconomics", lessons: 20, quizzes: 38, difficulty: "Intermediate" },
      { name: "Supply & Demand", lessons: 14, quizzes: 26, difficulty: "Beginner" },
      { name: "Market Structures", lessons: 16, quizzes: 30, difficulty: "Intermediate" },
      { name: "Finance", lessons: 18, quizzes: 34, difficulty: "Intermediate" },
      { name: "International Trade", lessons: 12, quizzes: 22, difficulty: "Advanced" },
    ],
  },
  "computer-science": {
    name: "Computer Science", color: "#F97316", emoji: "💻",
    description: "Learn programming, algorithms, and software engineering.",
    topics: [
      { name: "Programming Basics", lessons: 28, quizzes: 52, difficulty: "Beginner" },
      { name: "Data Structures", lessons: 24, quizzes: 46, difficulty: "Intermediate" },
      { name: "Algorithms", lessons: 26, quizzes: 50, difficulty: "Intermediate" },
      { name: "Web Development", lessons: 30, quizzes: 56, difficulty: "Intermediate" },
      { name: "Databases", lessons: 18, quizzes: 34, difficulty: "Intermediate" },
      { name: "System Design", lessons: 16, quizzes: 28, difficulty: "Advanced" },
    ],
  },
};

type TestTiming = "today" | "tomorrow" | "this_week" | "next_week" | "later";

const TEST_OPTIONS: { value: TestTiming; label: string; sublabel: string; icon: React.ReactNode; color: string }[] = [
  { value: "today",     label: "Today",        sublabel: "I need to study right now", icon: <AlertTriangle className="h-5 w-5" />, color: "#EF4444" },
  { value: "tomorrow",  label: "Tomorrow",     sublabel: "Last chance to prepare",    icon: <Zap className="h-5 w-5" />,           color: "#F97316" },
  { value: "this_week", label: "This week",    sublabel: "A few days to get ready",   icon: <Clock className="h-5 w-5" />,         color: "#F59E0B" },
  { value: "next_week", label: "Next week",    sublabel: "Good amount of time",       icon: <Calendar className="h-5 w-5" />,      color: "#3B82F6" },
  { value: "later",     label: "Not soon",     sublabel: "Building a strong base",    icon: <Smile className="h-5 w-5" />,         color: "#22C55E" },
];

type StudyDay = { day: string; sessions: string[] };

function generatePlan(timing: TestTiming, subject: { name: string; topics: { name: string }[] }): { title: string; description: string; days: StudyDay[]; tip: string } {
  const topicNames = subject.topics.map((t) => t.name);

  switch (timing) {
    case "today":
      return {
        title: "🚨 Emergency Cram Plan",
        description: "Focused on the highest-yield topics. No time to waste.",
        days: [
          { day: "Today — Morning", sessions: [`Quick overview: ${topicNames[0]}`, `Key formulas & facts: ${topicNames[1] ?? topicNames[0]}`] },
          { day: "Today — Afternoon", sessions: [`Practice quizzes: ${topicNames[0]}`, `Review mistakes & weak spots`] },
          { day: "Today — Evening", sessions: [`Final flashcard pass on all topics`, `Skim summaries, rest well`] },
        ],
        tip: "Focus only on what's most likely to appear. Skip deep dives — review summaries and do practice questions.",
      };
    case "tomorrow":
      return {
        title: "⚡ Rapid Prep Plan",
        description: "Two focused sessions today to cover the essentials.",
        days: [
          { day: "Today — Morning", sessions: [`Core concepts: ${topicNames[0]}`, `Core concepts: ${topicNames[1] ?? topicNames[0]}`] },
          { day: "Today — Afternoon", sessions: [`Practice quiz: ${topicNames[2] ?? topicNames[0]}`, `Flashcard review`] },
          { day: "Tomorrow — Before test", sessions: [`Quick 30-min review of weak areas`, `Confidence check: easy questions first`] },
        ],
        tip: "Prioritize understanding over memorization. Use the quiz mode to spot gaps quickly.",
      };
    case "this_week":
      return {
        title: "📅 Focused Week Plan",
        description: "Steady daily sessions to cover all key topics.",
        days: [
          { day: "Day 1", sessions: [`Lessons: ${topicNames[0]}`, `Quiz: ${topicNames[0]}`] },
          { day: "Day 2", sessions: [`Lessons: ${topicNames[1] ?? topicNames[0]}`, `Flashcards review`] },
          { day: "Day 3", sessions: [`Lessons: ${topicNames[2] ?? topicNames[0]}`, `Mixed practice quiz`] },
          { day: "Day 4–5", sessions: [`Weak areas revision`, `Full mock quiz`] },
        ],
        tip: "One topic per day keeps it manageable. Review flashcards each morning before the new session.",
      };
    case "next_week":
      return {
        title: "🗓️ Balanced Study Plan",
        description: "Thorough coverage with time to revisit and consolidate.",
        days: [
          { day: "Days 1–2", sessions: [`${topicNames[0]} — lessons + quiz`, `${topicNames[1] ?? topicNames[0]} — lessons + quiz`] },
          { day: "Days 3–4", sessions: [`${topicNames[2] ?? topicNames[0]} — deep dive`, `${topicNames[3] ?? topicNames[0]} — practice`] },
          { day: "Days 5–6", sessions: [`Remaining topics overview`, `Spaced repetition flashcards`] },
          { day: "Day 7", sessions: [`Full mock test`, `Review all mistakes`] },
        ],
        tip: "Spaced repetition works best here. Review earlier topics every 2–3 days to lock them in long-term.",
      };
    default:
      return {
        title: "😌 Comprehensive Plan",
        description: "Build a rock-solid foundation at a comfortable pace.",
        days: [
          { day: "Week 1", sessions: [`Master ${topicNames[0]}`, `Master ${topicNames[1] ?? topicNames[0]}`] },
          { day: "Week 2", sessions: [`Master ${topicNames[2] ?? topicNames[0]}`, `Master ${topicNames[3] ?? topicNames[0]}`] },
          { day: "Week 3", sessions: [`Advanced topics + problem sets`, `Full subject review`] },
          { day: "Ongoing", sessions: [`Daily flashcard review`, `Weekly mock tests`] },
        ],
        tip: "You have the luxury of time — use it for deep understanding, not just memorization.",
      };
  }
}

const STEM_SUBJECTS = ["mathematics", "physics", "chemistry", "biology", "computer-science"];

export default function SubjectDetail() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;
  const subject = subjectData[subjectId] ?? subjectData.mathematics;
  const isStem = STEM_SUBJECTS.includes(subjectId);

  const [timing, setTiming] = useState<TestTiming | null>(null);

  const plan = timing ? generatePlan(timing, subject) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />

      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Subject pill */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: subject.color + "18" }}>
            {subject.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#111111] dark:text-white">{subject.name}</h1>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{subject.description}</p>
          </div>
        </div>

        {!timing ? (
          /* Step 1 — pick test date */
          <div>
            <div className="mb-8 rounded-3xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-8">
              <h2 className="mb-1 text-xl font-black text-[#111111] dark:text-white">When do you have a test?</h2>
              <p className="mb-6 text-sm text-[#64748B]">Your study plan will be adjusted based on how much time you have.</p>

              <div className="flex flex-col gap-3">
                {TEST_OPTIONS.map((opt) => (
                  <InteractiveHoverButton
                    key={opt.value}
                    text={`${opt.label} — ${opt.sublabel}`}
                    variant="light"
                    onClick={() => setTiming(opt.value)}
                    className="w-full justify-center h-14 rounded-2xl text-left"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Step 2 — show plan */
          <div>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-xl font-black text-[#111111] dark:text-white">{plan!.title}</h2>
              <button
                onClick={() => setTiming(null)}
                className="ml-auto text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors underline underline-offset-2"
              >
                Change timing
              </button>
            </div>
            <p className="mb-6 text-sm text-[#64748B] dark:text-[#94A3B8]">{plan!.description}</p>

            {/* Plan days */}
            <div className="mb-6 space-y-3">
              {plan!.days.map((day, i) => (
                <div key={i} className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-5">
                  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{day.day}</div>
                  <div className="flex flex-col gap-2">
                    {day.sessions.map((session, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-[#111111] dark:text-white">
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: subject.color }} />
                        {session}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tip */}
            <div className="mb-8 rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-5">
              <div className="mb-1 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">AI Tip</div>
              <p className="text-sm text-[#111111] dark:text-white">{plan!.tip}</p>
            </div>

            {/* Upload note */}
            <div className="mb-6 rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] px-5 py-4 text-sm text-[#64748B] dark:text-[#94A3B8]">
              <span className="font-bold text-[#111111] dark:text-white">How it works: </span>
              Upload your notes or textbook pages and the AI generates personalized quizzes, problems, and flashcards based on your material — not from a pre-made test.
            </div>

            {/* Study mode CTAs */}
            <h3 className="mb-3 text-base font-black text-[#111111] dark:text-white">Start studying now</h3>
            <div className={`grid grid-cols-1 gap-3 ${isStem ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
              {[
                { key: "quiz",       title: "Quiz",        desc: "Test yourself" },
                { key: "flashcards", title: "Flashcards",  desc: "Memorize fast" },
                { key: "lesson",     title: "Lesson",      desc: "Step-by-step" },
                ...(isStem ? [{ key: "problems", title: "Problems", desc: "Practice exercises" }] : []),
              ].map((mode) => (
                <InteractiveHoverButton
                  key={mode.key}
                  text={`${mode.title} · ${mode.desc}`}
                  variant="light"
                  onClick={() => router.push(`/upload?subject=${subjectId}&mode=${mode.key}`)}
                  className="w-full justify-center h-14 rounded-2xl"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
