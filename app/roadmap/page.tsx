"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { setTestDate } from "@/lib/test-date";
import type { TestDate } from "@/lib/test-date";
import { Navigation } from "@/components/Navigation";
import { SUBJECT_ICON_MAP } from "@/components/SubjectIcons";

const subjectItems = [
  { id: "mathematics",      name: "Mathematics"      },
  { id: "physics",          name: "Physics"          },
  { id: "chemistry",        name: "Chemistry"        },
  { id: "history",          name: "History"          },
  { id: "biology",          name: "Biology"          },
  { id: "geography",        name: "Geography"        },
  { id: "english",          name: "English"          },
  { id: "computer-science", name: "Computer Science" },
];

const testDateOptions: { value: TestDate; label: string; sublabel: string }[] = [
  { value: "today",     label: "Today",     sublabel: "I need to study right now" },
  { value: "tomorrow",  label: "Tomorrow",  sublabel: "Last chance to prepare" },
  { value: "this_week", label: "This week", sublabel: "A few days to get ready" },
  { value: "next_week", label: "Next week", sublabel: "Good amount of time" },
  { value: "later",     label: "Not soon",  sublabel: "Building a strong base" },
];

export default function RoadmapPage() {
  const router = useRouter();
  const [step, setStep] = useState<"subject" | "date">("subject");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const subject = subjectItems.find((s) => s.id === selectedSubject);

  function handleTestDatePick(value: TestDate) {
    setTestDate(selectedSubject, value);
    router.push(`/upload?subject=${selectedSubject}`);
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-[#111111]">
        <div className="mx-auto max-w-lg px-6 py-16">

          {step === "subject" && (
            <>
              <Link href="/" className="inline-flex items-center gap-1 text-sm text-[#94A3B8] hover:text-[#64748B] dark:hover:text-white transition-colors mb-10">
                <ChevronLeft className="h-4 w-4" />
                Home
              </Link>

              <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-8 shadow-sm">
                <h1 className="text-xl font-bold text-[#111111] dark:text-white mb-1">Pick a subject</h1>
                <p className="text-sm text-[#94A3B8] mb-6">Choose what you want to study for.</p>

                <div className="grid grid-cols-2 gap-2">
                  {subjectItems.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedSubject(s.id); setStep("date"); }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium text-sm text-[#1E293B] dark:text-[#E2E8F0] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#CBD5E1] dark:hover:border-[#4A5568] hover:bg-[#F8FAFC] dark:hover:bg-[#252525] transition-all"
                    >
                      {(() => { const def = SUBJECT_ICON_MAP[s.id]; return def ? <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${def.color}18`, color: def.color }}><def.Icon className="h-4 w-4" /></span> : null; })()}
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === "date" && subject && (
            <>
              <button
                onClick={() => setStep("subject")}
                className="inline-flex items-center gap-1 text-sm text-[#94A3B8] hover:text-[#64748B] dark:hover:text-white transition-colors mb-10"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-8 shadow-sm">
                {/* Subject badge */}
                {(() => { const def = SUBJECT_ICON_MAP[subject.id]; return def ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mb-6" style={{ background: `${def.color}18`, color: def.color }}>
                    <def.Icon className="h-4 w-4" />
                    {subject.name}
                  </div>
                ) : null; })()}

                <h1 className="text-xl font-bold text-[#111111] dark:text-white mb-1">When do you have a test?</h1>
                <p className="text-sm text-[#94A3B8] mb-6">Your study plan will be adjusted based on how much time you have.</p>

                <div className="flex flex-col gap-2">
                  {testDateOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleTestDatePick(opt.value)}
                      className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-left border border-[#E2E8F0] dark:border-[#2D3748] hover:bg-[#111111] dark:hover:bg-white hover:border-[#111111] dark:hover:border-white hover:text-white dark:hover:text-[#111111] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#CBD5E1] dark:bg-[#4A5568] group-hover:bg-white dark:group-hover:bg-[#111111] transition-colors shrink-0" />
                        <span className="text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] group-hover:text-white dark:group-hover:text-[#111111] transition-colors">
                          {opt.label}
                          <span className="font-normal group-hover:text-white/80 dark:group-hover:text-[#111111]/70 text-[#94A3B8] transition-colors"> — {opt.sublabel}</span>
                        </span>
                      </div>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </>
  );
}
