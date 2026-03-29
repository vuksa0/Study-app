"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ThinkioLogo } from "@/components/ThinkioLogo";
import { ArrowLeft } from "lucide-react";

interface Answers {
  subjects: string[];
  goal: string;
  level: string;
  study_style: string;
}

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "English",
  "Computer Science",
];

const GOALS = [
  { value: "ace_exam",      label: "Ace an upcoming exam"       },
  { value: "learn_new",     label: "Learn something new"        },
  { value: "homework",      label: "Get help with homework"     },
  { value: "professional",  label: "Build professional skills"  },
];

const LEVELS = [
  { value: "high_school",   label: "High school"   },
  { value: "university",    label: "University"    },
  { value: "self_study",    label: "Self-study"    },
  { value: "professional",  label: "Professional"  },
];

const STUDY_STYLES = [
  { value: "quizzes",    label: "Quick quizzes"      },
  { value: "flashcards", label: "Flashcard drills"   },
  { value: "lessons",    label: "In-depth lessons"   },
  { value: "problems",   label: "Solving problems"   },
];

const STEPS = [
  { title: "Which subjects are you studying?",  sub: "Select all that apply."                          },
  { title: "What is your main goal?",           sub: "We will tailor your experience around this."     },
  { title: "What is your level?",               sub: "This helps us set the right difficulty."         },
  { title: "How do you prefer to study?",       sub: "Pick the format that works best for you."        },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState<Answers>({
    subjects: [],
    goal: "",
    level: "",
    study_style: "",
  });

  // If already logged in, check if they already have preferences
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setChecking(false);
      return;
    }
    fetch("/api/get-preferences")
      .then((r) => r.json())
      .then(({ preferences }) => {
        if (preferences?.goal) {
          // Already completed onboarding — go straight to dashboard
          router.replace("/dashboard");
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen bg-[#0D0D12] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  function canContinue() {
    if (step === 0) return answers.subjects.length > 0;
    if (step === 1) return answers.goal !== "";
    if (step === 2) return answers.level !== "";
    if (step === 3) return answers.study_style !== "";
    return false;
  }

  function handleSubjectToggle(subject: string) {
    setAnswers((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  }

  function handleSingleSelect(key: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  async function handleContinue() {
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }

    setSaving(true);

    if (isSignedIn) {
      // Already logged in — save directly to DB
      await fetch("/api/save-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      router.push("/dashboard");
    } else {
      // Not logged in — save to localStorage, go to signup
      localStorage.setItem("thinkio_onboarding", JSON.stringify(answers));
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D12] flex flex-col">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-6 py-5 md:px-10">
        <ThinkioLogo />
        <span className="text-[13px] text-[#475569]">Step {step + 1} of {STEPS.length}</span>
      </div>

      {/* Progress bar */}
      <div className="relative flex items-center justify-center gap-2 pb-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= step ? "w-8 bg-white" : "w-2 bg-[#1E293B]"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl">
          <h1 className="text-[28px] md:text-[36px] font-black text-white leading-tight tracking-tight mb-2">
            {STEPS[step].title}
          </h1>
          <p className="text-[#475569] text-sm mb-8">{STEPS[step].sub}</p>

          {step === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {SUBJECTS.map((subject) => {
                const selected = answers.subjects.includes(subject);
                return (
                  <button
                    key={subject}
                    onClick={() => handleSubjectToggle(subject)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left ${
                      selected
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-[#94A3B8] border-[#1E293B] hover:border-[#334155]"
                    }`}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {GOALS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleSingleSelect("goal", value)}
                  className={`px-5 py-4 rounded-2xl text-sm font-medium border text-left transition-all ${
                    answers.goal === value
                      ? "bg-white text-black border-white"
                      : "bg-[#111111] text-[#94A3B8] border-[#1E293B] hover:border-[#334155]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LEVELS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleSingleSelect("level", value)}
                  className={`px-5 py-4 rounded-2xl text-sm font-medium border text-left transition-all ${
                    answers.level === value
                      ? "bg-white text-black border-white"
                      : "bg-[#111111] text-[#94A3B8] border-[#1E293B] hover:border-[#334155]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {STUDY_STYLES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleSingleSelect("study_style", value)}
                  className={`px-5 py-4 rounded-2xl text-sm font-medium border text-left transition-all ${
                    answers.study_style === value
                      ? "bg-white text-black border-white"
                      : "bg-[#111111] text-[#94A3B8] border-[#1E293B] hover:border-[#334155]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!canContinue() || saving}
              className={`ml-auto h-12 px-8 rounded-full text-sm font-bold transition-all ${
                canContinue() && !saving
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-[#1E293B] text-[#334155] cursor-not-allowed"
              }`}
            >
              {saving ? "Saving..." : step === 3 ? (isSignedIn ? "Save and continue" : "Create account") : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
