"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, BookOpen, Brain, Zap, Code2, Lightbulb, Clock, Upload, X, FileText, Lock, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
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

const testDateOptions = [
  { value: "today",     label: "Today",     sublabel: "I need to study right now",  days: 0  },
  { value: "tomorrow",  label: "Tomorrow",  sublabel: "Last chance to prepare",     days: 1  },
  { value: "this_week", label: "This week", sublabel: "A few days to get ready",    days: 5  },
  { value: "next_week", label: "Next week", sublabel: "Good amount of time",        days: 10 },
  { value: "later",     label: "Not soon",  sublabel: "Building a strong base",     days: 30 },
];

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  lesson:     BookOpen,
  quiz:       Brain,
  flashcards: Zap,
  problems:   Code2,
};

interface Activity { type: string; title: string; duration: string; }
interface DayPlan   { day: number; dayLabel: string; focus: string; activities: Activity[]; totalTime: string; }
interface Roadmap   { subject: string; daysUntilExam: number; overview: string; dailyPlan: DayPlan[]; keyAreas: string[]; tip: string; }

function toExamDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function RoadmapPage() {
  const router = useRouter();
  const [step, setStep] = useState<"subject" | "date" | "upload" | "loading" | "result">("subject");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [examDays, setExamDays] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openDay, setOpenDay] = useState<number | null>(0);
  const [dragging, setDragging] = useState(false);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const storageKey = `roadmap_completed_${selectedSubject}`;

  const loadCompleted = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCompletedDays(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
  }, [storageKey]);

  useEffect(() => { if (step === "result") loadCompleted(); }, [step, loadCompleted]);

  function completeDay(dayNum: number) {
    setCompletedDays((prev) => {
      const next = new Set([...prev, dayNum]);
      try { localStorage.setItem(storageKey, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  }

  // idx=0 always unlocked; idx=N unlocked when day N (1-based) is completed
  function isDayUnlockedByIdx(idx: number) {
    if (idx === 0) return true;
    return completedDays.has(idx);
  }

  const subject = subjectItems.find((s) => s.id === selectedSubject);

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      const added = Array.from(newFiles).filter((f) => !existing.has(f.name));
      return [...prev, ...added];
    });
  }

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }

  async function generateRoadmap() {
    if (!subject) return;
    setStep("loading");
    setError(null);
    const examDate = toExamDate(examDays);

    const formData = new FormData();
    formData.append("subjectId", subject.id);
    formData.append("subjectName", subject.name);
    formData.append("examDate", examDate);
    for (const file of files) formData.append("files", file);

    try {
      const res = await fetch("/api/generate-roadmap", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.roadmap) throw new Error(data.error || "Failed to generate roadmap");
      setRoadmap(data.roadmap);
      setOpenDay(0);
      setStep("result");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStep("upload");
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-[#111111]">
        <div className="mx-auto max-w-2xl px-6 py-16">

          {/* STEP 1 — Subject picker */}
          {step === "subject" && (
            <>
              <Link href="/" className="inline-flex items-center gap-1 text-sm text-[#94A3B8] hover:text-[#64748B] dark:hover:text-white transition-colors mb-10">
                <ChevronLeft className="h-4 w-4" />
                Home
              </Link>
              <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-8 shadow-sm">
                <h1 className="text-xl font-bold text-[#111111] dark:text-white mb-1">Build your study roadmap</h1>
                <p className="text-sm text-[#94A3B8] mb-6">Pick a subject to get a personalised day-by-day plan.</p>
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

          {/* STEP 2 — Date picker */}
          {step === "date" && subject && (
            <>
              <button onClick={() => setStep("subject")} className="inline-flex items-center gap-1 text-sm text-[#94A3B8] hover:text-[#64748B] dark:hover:text-white transition-colors mb-10">
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-8 shadow-sm">
                {(() => { const def = SUBJECT_ICON_MAP[subject.id]; return def ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mb-6" style={{ background: `${def.color}18`, color: def.color }}>
                    <def.Icon className="h-4 w-4" />
                    {subject.name}
                  </div>
                ) : null; })()}
                <h1 className="text-xl font-bold text-[#111111] dark:text-white mb-1">When is your exam?</h1>
                <p className="text-sm text-[#94A3B8] mb-6">We'll build a day-by-day plan based on how much time you have.</p>
                <div className="flex flex-col gap-3">
                  {testDateOptions.map((opt) => (
                    <div key={opt.value} className="flex flex-col gap-0.5">
                      <p className="text-xs text-[#94A3B8] pl-1">{opt.sublabel}</p>
                      <MotionButton
                        label={opt.label}
                        onClick={() => { setExamDays(opt.days); setStep("upload"); }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 3 — Upload notes */}
          {step === "upload" && subject && (
            <>
              <button onClick={() => setStep("date")} className="inline-flex items-center gap-1 text-sm text-[#94A3B8] hover:text-[#64748B] dark:hover:text-white transition-colors mb-10">
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              {error && (
                <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-8 shadow-sm">
                {(() => { const def = SUBJECT_ICON_MAP[subject.id]; return def ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mb-6" style={{ background: `${def.color}18`, color: def.color }}>
                    <def.Icon className="h-4 w-4" />
                    {subject.name}
                  </div>
                ) : null; })()}

                <h1 className="text-xl font-bold text-[#111111] dark:text-white mb-1">Upload your notes</h1>
                <p className="text-sm text-[#94A3B8] mb-6">Your roadmap will be personalised based on what you're actually studying. Supports PDF, images, Word docs, and text files.</p>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
                  onClick={() => inputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors mb-4 py-10 ${
                    dragging
                      ? "border-[#111111] dark:border-white bg-[#F8FAFC] dark:bg-[#222]"
                      : "border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#CBD5E1] dark:hover:border-[#4A5568]"
                  }`}
                >
                  <Upload className="h-8 w-8 text-[#CBD5E1] dark:text-[#4A5568]" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#111111] dark:text-white">Drop files here or click to browse</p>
                    <p className="text-xs text-[#94A3B8] mt-1">PDF, PNG, JPG, DOCX, TXT · Max 20MB each</p>
                  </div>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.docx,.txt,.md"
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />

                {/* File list */}
                {files.length > 0 && (
                  <div className="flex flex-col gap-2 mb-6">
                    {files.map((f) => (
                      <div key={f.name} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] px-4 py-3">
                        <FileText className="h-4 w-4 text-[#94A3B8] shrink-0" />
                        <span className="text-sm text-[#111111] dark:text-white flex-1 truncate">{f.name}</span>
                        <span className="text-xs text-[#94A3B8] shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                        <button onClick={() => removeFile(f.name)} className="text-[#CBD5E1] hover:text-red-500 transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {files.length > 0 ? (
                  <MotionButton label="Generate My Roadmap" onClick={generateRoadmap} />
                ) : (
                  <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#E2E8F0] dark:border-[#2D3748] py-4 text-sm text-[#CBD5E1] dark:text-[#4A5568] select-none">
                    <Upload className="h-4 w-4" />
                    Upload a file to continue
                  </div>
                )}
              </div>
            </>
          )}

          {/* STEP 4 — Loading */}
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="h-12 w-12 rounded-full border-4 border-[#E2E8F0] dark:border-[#2D3748] border-t-[#111111] dark:border-t-white animate-spin" />
              <p className="text-sm text-[#94A3B8]">Analysing your notes and building your roadmap…</p>
            </div>
          )}

          {/* STEP 5 — Roadmap result */}
          {step === "result" && roadmap && subject && (
            <>
              <button onClick={() => setStep("upload")} className="inline-flex items-center gap-1 text-sm text-[#94A3B8] hover:text-[#64748B] dark:hover:text-white transition-colors mb-10">
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              {/* Header */}
              <div className="relative overflow-hidden rounded-3xl mb-6" style={{ minHeight: 140 }}>
                <SubjectShaderCard subjectId={selectedSubject} />
                <div className="relative z-10 p-8">
                  {(() => { const def = SUBJECT_ICON_MAP[selectedSubject]; return def ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl mb-3" style={{ background: "rgba(255,255,255,0.15)" }}>
                      <def.Icon className="h-6 w-6 text-white" />
                    </div>
                  ) : null; })()}
                  <h1 className="text-2xl font-black text-white mb-1">{roadmap.subject} Roadmap</h1>
                  <p className="text-white/70 text-sm">{roadmap.daysUntilExam} day{roadmap.daysUntilExam !== 1 ? "s" : ""} until exam · {roadmap.dailyPlan.length}-day plan</p>
                </div>
              </div>

              {/* Overview */}
              <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-6 mb-4">
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{roadmap.overview}</p>
              </div>

              {/* Key areas */}
              <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-6 mb-4">
                <h2 className="text-sm font-bold text-[#111111] dark:text-white mb-3">Key areas to master</h2>
                <div className="flex flex-wrap gap-2">
                  {roadmap.keyAreas.map((area, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] dark:bg-[#2D3748] text-[#64748B] dark:text-[#94A3B8]">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#FAFAFA] dark:bg-[#1A1A1A] p-5 mb-6 flex gap-3">
                <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{roadmap.tip}</p>
              </div>

              {/* Staircase daily plan */}
              <h2 className="text-lg font-black text-[#111111] dark:text-white mb-6">Your day-by-day plan</h2>
              <div className="relative">
                {roadmap.dailyPlan.map((day, idx) => {
                  const unlocked = isDayUnlockedByIdx(idx);
                  const done = completedDays.has(day.day);
                  const isOpen = openDay === idx;
                  const STEP = 24;
                  const maxOffset = Math.min(idx * STEP, 160);

                  return (
                    <div key={day.day} className="relative flex gap-0" style={{ marginLeft: maxOffset, marginBottom: 0 }}>
                      {/* Vertical connector line */}
                      {idx < roadmap.dailyPlan.length - 1 && (
                        <div
                          className="absolute left-5 top-[52px] w-px bg-[#E2E8F0] dark:bg-[#2D3748]"
                          style={{ height: isOpen ? "auto" : "32px", bottom: isOpen ? "-8px" : undefined }}
                        />
                      )}

                      <div className="flex-1 mb-3">
                        {/* Day header button */}
                        <button
                          onClick={() => unlocked && setOpenDay(isOpen ? null : idx)}
                          disabled={!unlocked}
                          className={`w-full flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-left transition-all ${
                            done
                              ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                              : unlocked
                              ? "border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] hover:shadow-md hover:border-[#CBD5E1] dark:hover:border-[#4A5568]"
                              : "border-[#F1F5F9] dark:border-[#1E2530] bg-[#FAFAFA] dark:bg-[#161616] cursor-not-allowed opacity-60"
                          }`}
                        >
                          {/* Circle */}
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black ${
                            done
                              ? "border-green-500 bg-green-500 text-white"
                              : unlocked
                              ? "border-[#111111] dark:border-white bg-[#111111] dark:bg-white text-white dark:text-[#111111]"
                              : "border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] text-[#CBD5E1] dark:text-[#4A5568]"
                          }`}>
                            {done ? <CheckCircle2 className="h-5 w-5" /> : !unlocked ? <Lock className="h-4 w-4" /> : day.day}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${unlocked ? "text-[#111111] dark:text-white" : "text-[#CBD5E1] dark:text-[#4A5568]"}`}>
                              {day.focus}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3 text-[#94A3B8]" />
                              <span className="text-xs text-[#94A3B8]">{day.totalTime}</span>
                              {done && <span className="text-xs text-green-500 font-semibold ml-1">✓ Done</span>}
                              {!unlocked && <span className="text-xs text-[#CBD5E1] dark:text-[#4A5568] ml-1">Complete Day {idx} first</span>}
                            </div>
                          </div>

                          {unlocked && !done && (
                            isOpen ? <ChevronUp className="h-4 w-4 text-[#94A3B8] shrink-0" /> : <ChevronDown className="h-4 w-4 text-[#94A3B8] shrink-0" />
                          )}
                        </button>

                        {/* Expanded activities */}
                        {isOpen && unlocked && (
                          <div className="mt-2 rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] px-5 py-4 flex flex-col gap-2">
                            {day.activities.map((act, ai) => {
                              const Icon = ACTIVITY_ICONS[act.type] ?? BookOpen;
                              return (
                                <Link
                                  key={ai}
                                  href={`/${selectedSubject}/${act.type}`}
                                  className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] px-4 py-3 hover:bg-[#F8FAFC] dark:hover:bg-[#222] transition-colors group"
                                >
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9] dark:bg-[#2D3748] group-hover:bg-[#111111] dark:group-hover:bg-white transition-colors">
                                    <Icon className="h-4 w-4 text-[#64748B] dark:text-[#94A3B8] group-hover:text-white dark:group-hover:text-[#111111] transition-colors" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[#111111] dark:text-white truncate">{act.title}</p>
                                    <p className="text-xs text-[#94A3B8] capitalize">{act.type}</p>
                                  </div>
                                  <span className="text-xs text-[#94A3B8] shrink-0">{act.duration}</span>
                                </Link>
                              );
                            })}

                            {!done && (
                              <button
                                onClick={() => { completeDay(day.day); setOpenDay(idx + 1 < roadmap.dailyPlan.length ? idx + 1 : null); }}
                                className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Mark Day {day.day} Complete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>
      </main>
    </>
  );
}
