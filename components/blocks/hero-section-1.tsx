'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { cn } from '@/lib/utils';

const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { type: 'spring' as const, bounce: 0.3, duration: 1.5 },
    },
  },
};

export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: { transition: { delayChildren: 1 } },
                },
                item: {
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { type: 'spring' as const, bounce: 0.3, duration: 2 },
                  },
                },
              }}
              className="absolute inset-0 -z-20"
            >
              <img
                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                alt="background"
                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                width="3276"
                height="4095"
              />
            </AnimatedGroup>

            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
            />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] animate-appear text-white drop-shadow-2xl">
                    Master Any Subject with AI
                  </h1>
                  <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                    Upload your study materials and get interactive quizzes, smart flashcards, and personalized lessons generated instantly.
                  </p>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                    <Button asChild size="lg" className="rounded-xl px-5 text-base">
                      <Link href="/library">
                        <span className="text-nowrap">Start Learning Free</span>
                      </Link>
                    </Button>
                  </div>
                  <Button asChild size="lg" variant="ghost" className="h-10.5 rounded-xl px-5">
                    <Link href="/upload">
                      <span className="text-nowrap">Upload Your Notes</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } },
                },
                ...transitionVariants,
              }}
            >
              <div className="mx-auto max-w-5xl px-6 mt-16 md:mt-24">
                <p className="text-center text-sm text-muted-foreground mb-6">Pick a subject and start learning</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: "functions", label: "Mathematics", color: "from-blue-500/20 to-blue-600/5", href: "/mathematics" },
                    { icon: "science", label: "Physics", color: "from-violet-500/20 to-violet-600/5", href: "/physics" },
                    { icon: "biotech", label: "Biology", color: "from-green-500/20 to-green-600/5", href: "/biology" },
                    { icon: "history_edu", label: "History", color: "from-amber-500/20 to-amber-600/5", href: "/history" },
                    { icon: "language", label: "Languages", color: "from-cyan-500/20 to-cyan-600/5", href: "/languages" },
                    { icon: "menu_book", label: "Literature", color: "from-rose-500/20 to-rose-600/5", href: "/literature" },
                    { icon: "public", label: "Geography", color: "from-teal-500/20 to-teal-600/5", href: "/geography" },
                    { icon: "psychology", label: "Psychology", color: "from-pink-500/20 to-pink-600/5", href: "/psychology" },
                  ].map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      className={`group flex flex-col items-center gap-3 rounded-2xl border border-white/[0.07] bg-gradient-to-br ${s.color} p-5 text-center transition-all duration-300 hover:border-[#895af6]/40 hover:shadow-[0_0_24px_rgba(137,90,246,0.12)] hover:-translate-y-0.5`}
                    >
                      <span className="material-symbols-outlined text-3xl text-[#895af6] group-hover:scale-110 transition-transform">{s.icon}</span>
                      <span className="text-sm font-medium text-white/80">{s.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        <section className="bg-background pb-24 pt-16 md:pb-36">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
              {[
                {
                  icon: "bolt",
                  title: "Ready in seconds",
                  desc: "Upload your notes or pick a subject — AI generates a full quiz, flashcard deck, or lesson in under 10 seconds.",
                },
                {
                  icon: "target",
                  title: "Learns what you need",
                  desc: "Tell it when your test is and it focuses on the hardest concepts first, so you don't waste time on what you already know.",
                },
                {
                  icon: "emoji_events",
                  title: "Actually works",
                  desc: "Active recall through quizzes and flashcards is proven to be 2× more effective than re-reading notes.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-background p-8 flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#895af6]/10 border border-[#895af6]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl text-[#895af6]">{item.icon}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const menuItems = [
  { name: 'Features', href: '#features' },
  { name: 'Library', href: '/library' },
  { name: 'Upload', href: '/upload' },
  { name: 'About', href: '#' },
];

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <nav data-state={menuState && 'active'} className="fixed z-20 w-full px-2 group">
        <div className={cn(
          'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
          isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5'
        )}>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <StudyFlowLogo />
              </Link>
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href} className="text-muted-foreground hover:text-accent-foreground block duration-150">
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link href={item.href} className="text-muted-foreground hover:text-accent-foreground block duration-150">
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild variant="outline" size="sm" className={cn(isScrolled && 'lg:hidden')}>
                  <Link href="/library"><span>Browse Library</span></Link>
                </Button>
                <Button asChild size="sm" className={cn(isScrolled && 'lg:hidden')}>
                  <Link href="/upload"><span>Get Started</span></Link>
                </Button>
                <Button asChild size="sm" className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                  <Link href="/upload"><span>Get Started</span></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const StudyFlowLogo = ({ className }: { className?: string }) => (
  <span className={cn('font-bold text-lg tracking-tight flex items-center gap-2', className)}>
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="url(#hero-thinkio-grad)" />
      <path d="M10 14c0-2.2 1.8-4 4-4 .4 0 .8.1 1.1.2C15.6 8.9 17 8 18.5 8c2.5 0 4.5 2 4.5 4.5 0 .6-.1 1.2-.3 1.7.8.7 1.3 1.7 1.3 2.8 0 2.2-1.8 4-4 4h-1v1.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V21h-.5c-2.2 0-4-1.8-4-4 0-1.1.4-2.1 1.1-2.8C10.2 13.8 10 13 10 12.5" fill="white" opacity="0.95" />
      <defs>
        <linearGradient id="hero-thinkio-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#895af6" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
    Thinkio
  </span>
);
