"use client";

import Link from "next/link";
import { Sun, Moon, ChevronDown, BookOpen, Brain, Zap, PenTool, Code2, FileText, Map } from "lucide-react";
import { SUBJECT_ICON_MAP } from "@/components/SubjectIcons";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { UserButton, Show } from "@clerk/nextjs";
import { SubscriptionTab } from "@/components/SubscriptionTab";
import { CreditCard } from "lucide-react";
import { ThinkioLogo } from "@/components/ThinkioLogo";
import { useLocale } from "@/components/LocaleProvider";
import { SUPPORTED_LANGUAGES, type LangCode } from "@/lib/i18n";

export function Navigation() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const subjectsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLocale();
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (subjectsRef.current && !subjectsRef.current.contains(e.target as Node)) {
        setSubjectsOpen(false);
      }
      if (featuresRef.current && !featuresRef.current.contains(e.target as Node)) setFeaturesOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const subjectItems = Object.entries(SUBJECT_ICON_MAP).map(([id, def]) => ({
    id,
    name: { mathematics: "Mathematics", physics: "Physics", chemistry: "Chemistry", history: "History", biology: "Biology", geography: "Geography", english: "English", "computer-science": "Computer Science" }[id] ?? id,
    color: def.color,
    Icon: def.Icon,
  }));

  const featureItems = [
    { href: "/learn", icon: <BookOpen className="h-4 w-4" />, color: "#6366F1", label: t('learn'), desc: "Structured AI-generated lessons" },
    { href: "#quizzes", icon: <Brain className="h-4 w-4" />, color: "#8B5CF6", label: t('quiz'), desc: "Test your knowledge fast" },
    { href: "#flashcards", icon: <Zap className="h-4 w-4" />, color: "#F59E0B", label: t('flashcards'), desc: "Active recall & spaced repetition" },
    { href: "#problems", icon: <PenTool className="h-4 w-4" />, color: "#10B981", label: t('problems'), desc: "Practice with worked solutions" },
    { href: "#coding", icon: <Code2 className="h-4 w-4" />, color: "#F97316", label: t('coding'), desc: "Write & run code challenges" },
    { href: "#essay", icon: <FileText className="h-4 w-4" />, color: "#3B82F6", label: t('essay'), desc: "AI-graded writing practice" },
    { href: "/roadmap", icon: <Map className="h-4 w-4" />, color: "#EC4899", label: t('roadmap'), desc: "Personalized study plan" },
  ];

  const isDark = theme === "dark";

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-[#E2E8F0] dark:border-[#2D3748] bg-white/90 dark:bg-[#111111]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/">
          <ThinkioLogo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Features dropdown */}
          <div className="relative" ref={featuresRef}>
            <button
              onClick={() => { setFeaturesOpen((o) => !o); setSubjectsOpen(false); setLangOpen(false); }}
              className="rounded-full border border-[#E2E8F0] dark:border-[#2D3748] px-4 py-1.5 text-sm text-[#64748B] dark:text-[#94A3B8] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white transition-colors flex items-center gap-1"
            >
              {t('features')}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${featuresOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-[#E2E8F0] dark:border-[#2D3748] shadow-xl shadow-black/10 dark:shadow-black/40 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${featuresOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"}`}>
              <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${featuresOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="px-4 pt-4 pb-2">
                    <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wide">{t('allFeatures')}</p>
                  </div>
                  <div className="px-2 pb-3">
                    {featureItems.map((f, index) => (
                      <Link
                        key={f.label}
                        href={f.href}
                        onClick={() => setFeaturesOpen(false)}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#252525] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group ${featuresOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                        style={{ transitionDelay: featuresOpen ? `${index * 50}ms` : "0ms" }}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${f.color}18`, color: f.color }}>
                          {f.icon}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1E293B] dark:text-[#E2E8F0] group-hover:text-[#111111] dark:group-hover:text-white transition-colors">{f.label}</p>
                          <p className="text-xs text-[#94A3B8] truncate">{f.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {[
            { href: "/#how-it-works", label: t('howItWorks') },
            { href: "/#pricing", label: t('pricing') },
            { href: "/progress", label: t('progress') },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-[#E2E8F0] dark:border-[#2D3748] px-4 py-1.5 text-sm text-[#64748B] dark:text-[#94A3B8] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}

          {/* Subjects dropdown */}
          <div className="relative" ref={subjectsRef}>
            <button
              onClick={() => { setSubjectsOpen((o) => !o); setFeaturesOpen(false); setLangOpen(false); }}
              className="rounded-full border border-[#E2E8F0] dark:border-[#2D3748] px-4 py-1.5 text-sm text-[#64748B] dark:text-[#94A3B8] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white transition-colors flex items-center gap-1"
            >
              {t('subjects')}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${subjectsOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-[#E2E8F0] dark:border-[#2D3748] shadow-xl shadow-black/10 dark:shadow-black/40 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${subjectsOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"}`}>
              <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${subjectsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="px-4 pt-4 pb-2">
                    <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wide">{t('allSubjects')}</p>
                  </div>
                  <div className="px-2 pb-3">
                    {subjectItems.map((s, index) => (
                      <Link
                        key={s.id}
                        href={`/subject/${s.id}`}
                        onClick={() => setSubjectsOpen(false)}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#252525] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group ${subjectsOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                        style={{ transitionDelay: subjectsOpen ? `${index * 50}ms` : "0ms" }}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${s.color}18`, color: s.color }}>
                          <s.Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium text-[#1E293B] dark:text-[#E2E8F0] group-hover:text-[#111111] dark:group-hover:text-white transition-colors">
                          {s.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right side — always visible */}
        <div className="flex items-center gap-3">
          {/* Lang */}
          {mounted && (
            <div className="relative" ref={langRef}>
              <button onClick={() => { setLangOpen((o) => !o); setFeaturesOpen(false); setSubjectsOpen(false); }} className="flex items-center gap-1.5 rounded-full border border-[#E2E8F0] dark:border-[#2D3748] px-3 py-1.5 text-sm text-[#64748B] dark:text-[#94A3B8] hover:border-[#111111] dark:hover:border-white transition-colors">
                <span className="text-base leading-none">{currentLang?.flag ?? "🌐"}</span>
                <span className="hidden sm:block text-xs font-medium">{currentLang?.code.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-[#E2E8F0] dark:border-[#2D3748] shadow-xl z-50">
                  <div className="p-2 max-h-72 overflow-y-auto">
                    <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide px-2 py-1.5">{t('language')}</p>
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button key={l.code} onClick={() => { setLanguage(l.code as LangCode); setLangOpen(false); }} className={["w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors", language === l.code ? "bg-[#F1F5F9] dark:bg-[#2D3748] font-semibold text-[#111111] dark:text-white" : "text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#252525]"].join(" ")}>
                        <span className="text-base">{l.flag}</span>
                        <span>{l.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="relative flex h-7 w-14 items-center rounded-full border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F1F5F9] dark:bg-[#1A1A1A] transition-colors duration-300"
            >
              <span className={`absolute flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-[#111111] shadow-sm transition-all duration-300 ${isDark ? "left-[30px]" : "left-[2px]"}`}>
                {isDark ? <Sun className="h-3 w-3 text-[#F59E0B]" /> : <Moon className="h-3 w-3 text-[#64748B]" />}
              </span>
            </button>
          )}
          <Show when="signed-out">
            <Link href="/login" className="hidden text-sm text-[#111111] dark:text-white hover:text-[#64748B] dark:hover:text-[#94A3B8] transition-colors md:block">{t('logIn')}</Link>
            <Link href="/login" className="hidden md:block">
              <InteractiveHoverButton text={t('getStarted')} className="h-9 py-0" />
            </Link>
            <Link href="/login" className="text-sm font-semibold text-[#111111] dark:text-white md:hidden">{t('logIn')}</Link>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard" className="hidden md:flex items-center gap-1.5 rounded-full border border-[#E2E8F0] dark:border-[#2D3748] px-4 py-1.5 text-sm text-[#64748B] dark:text-[#94A3B8] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white transition-colors">
              {t('dashboard')}
            </Link>
            <UserButton>
              <UserButton.UserProfilePage label="Subscription" url="subscription" labelIcon={<CreditCard size={16} />}>
                <SubscriptionTab />
              </UserButton.UserProfilePage>
            </UserButton>
          </Show>
        </div>
      </div>

    </nav>
  );
}
