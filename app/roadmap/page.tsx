"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { setTestDate } from "@/lib/test-date";
import type { TestDate } from "@/lib/test-date";
import { Navigation } from "@/components/Navigation";
import { SUBJECT_ICON_MAP } from "@/components/SubjectIcons";
import { SubjectShaderCard } from "@/components/SubjectShaderCard";
import MotionButton from "@/components/ui/motion-button";

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

                <div className="grid grid-cols-2 gap-3">
                  {subjectItems.map((s) => {
                    const def = SUBJECT_ICON_MAP[s.id];
                    return (
                      <button
                        key={s.id}
                        onClick={() => { setSelectedSubject(s.id); setStep("date"); }}
                        className="group relative overflow-hidden rounded-2xl text-left transition-all hover:shadow-lg"
                        style={{ minHeight: 120 }}
                      >
                        <SubjectShaderCard subjectId={s.id} />
                        <div className="relative z-10 flex flex-col p-4 h-full" style={{ minHeight: 120 }}>
                          {def && (
                            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
                              <def.Icon className="h-4 w-4" />
                            </div>
                          )}
                          <span className="mt-auto text-sm font-bold text-white">{s.name}</span>
                        </div>
                      </button>
                    );
                  })}
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

                <div className="flex flex-col gap-3">
                  {testDateOptions.map((opt) => (
                    <div key={opt.value} className="flex flex-col gap-0.5">
                      <p className="text-xs text-[#94A3B8] pl-1">{opt.sublabel}</p>
                      <MotionButton
                        label={opt.label}
                        onClick={() => handleTestDatePick(opt.value)}
                      />
                    </div>
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
