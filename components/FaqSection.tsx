"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    q: "Is Thinkio free to use?",
    a: "Yes — you can start for free with 3 AI-generated sessions per week across 1 subject. Upgrade to Plus for 20 sessions per week, or Pro for unlimited access across all 8 subjects.",
  },
  {
    q: "How does AI content generation work?",
    a: "You choose a subject and topic (or upload your own notes), and our AI generates tailored quizzes, flashcards, lessons, and practice problems in seconds using the latest language models.",
  },
  {
    q: "Can I upload my own notes and textbooks?",
    a: "Absolutely. You can upload PDFs, images, or paste raw text. The AI reads your material and creates study content directly based on what you uploaded.",
  },
  {
    q: "What subjects are supported?",
    a: "We currently support Mathematics, Physics, Chemistry, Biology, History, Geography, English, and Computer Science — with more subjects coming soon.",
  },
  {
    q: "Is my progress saved?",
    a: "Yes. Create a free account and all your completed lessons, quiz results, flashcard sets, and library items are saved to your profile and synced across devices.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel at any time from your account settings. You keep access until the end of your billing period with no additional charges.",
  },
  {
    q: "What is the exam roadmap feature?",
    a: "Tell us your exam date and subject, and we build a personalized day-by-day study plan with lessons, quizzes, and flashcards timed so you peak on exam day.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-6 py-16 md:py-24 bg-white dark:bg-[#111111]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-12 md:flex-row md:gap-20">

          {/* Left */}
          <div className="md:w-72 shrink-0">
            <h2 className="text-3xl font-black tracking-[-0.02em] text-[#111111] dark:text-white md:text-4xl leading-tight">
              Questions<br />and<br />answers
            </h2>
            <p className="mt-4 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Can&apos;t find the answer here?
            </p>
            <Link
              href="mailto:support@thinkio.app"
              className="mt-1 text-sm text-[#111111] dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Contact support
            </Link>
          </div>

          {/* Right — accordion */}
          <div className="flex-1 divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
            {faqs.map((faq, i) => (
              <div key={i} className="py-5">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between text-left gap-4"
                >
                  <span className="text-base font-medium text-[#111111] dark:text-white">
                    {faq.q}
                  </span>
                  <span className="shrink-0 text-[#94A3B8]">
                    {open === i
                      ? <ChevronUp className="h-4 w-4" />
                      : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>
                {open === i && (
                  <p className="mt-4 text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
