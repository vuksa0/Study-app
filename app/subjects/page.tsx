import Link from "next/link";
import { Search, Calculator, Atom, FlaskConical, Landmark, Dna, BookText, TrendingUp, Terminal } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import type { ReactNode } from "react";

const subjects: { id: string; name: string; subtopics: string; accentColor: string; topics: number; icon: ReactNode }[] = [
  { id: "mathematics", name: "Mathematics", subtopics: "Algebra, Calculus, Statistics, Geometry", accentColor: "#3B82F6", topics: 145, icon: <Calculator className="h-6 w-6" /> },
  { id: "biology", name: "Biology", subtopics: "Cell Biology, Genetics, Ecology, Anatomy", accentColor: "#22C55E", topics: 98, icon: <Dna className="h-6 w-6" /> },
  { id: "history", name: "History", subtopics: "World History, US History, Ancient Civilizations", accentColor: "#F59E0B", topics: 76, icon: <Landmark className="h-6 w-6" /> },
  { id: "physics", name: "Physics", subtopics: "Mechanics, Thermodynamics, Electromagnetism", accentColor: "#A855F7", topics: 112, icon: <Atom className="h-6 w-6" /> },
  { id: "chemistry", name: "Chemistry", subtopics: "Organic, Inorganic, Physical, Analytical", accentColor: "#14B8A6", topics: 89, icon: <FlaskConical className="h-6 w-6" /> },
  { id: "literature", name: "Literature", subtopics: "Poetry, Prose, Drama, Literary Analysis", accentColor: "#EC4899", topics: 67, icon: <BookText className="h-6 w-6" /> },
  { id: "economics", name: "Economics", subtopics: "Microeconomics, Macroeconomics, Finance", accentColor: "#6366F1", topics: 54, icon: <TrendingUp className="h-6 w-6" /> },
  { id: "computer-science", name: "Computer Science", subtopics: "Programming, Data Structures, Algorithms", accentColor: "#F97316", topics: 132, icon: <Terminal className="h-6 w-6" /> },
];

export default function Subjects() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-[-0.02em] text-[#111111] dark:text-white md:text-6xl">
            Browse Subjects
          </h1>
          <p className="max-w-2xl text-lg text-[#64748B] dark:text-[#94A3B8]">
            Choose a subject to start learning. Each subject contains hundreds of topics, quizzes, and study materials.
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search subjects..."
              className="w-full rounded-full border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] py-3 pl-12 pr-4 text-sm text-[#111111] dark:text-white placeholder:text-[#94A3B8] focus:border-[#111111] dark:focus:border-white focus:outline-none"
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/subject/${subject.id}`}>
              <div className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] transition-all hover:border-[#CBD5E1] dark:hover:border-[#4A5568] hover:shadow-lg">
                <div
                  className="absolute left-0 top-0 h-full w-1"
                  style={{ backgroundColor: subject.accentColor }}
                />
                <div className="p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1F5F9] dark:bg-[#2D3748]" style={{ color: subject.accentColor }}>
                    {subject.icon}
                  </div>
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-2xl font-bold text-[#111111] dark:text-white">{subject.name}</h3>
                    <div className="rounded-full bg-[#F8FAFC] dark:bg-[#2D3748] px-3 py-1 text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
                      {subject.topics} topics
                    </div>
                  </div>
                  <p className="mb-6 text-sm text-[#64748B] dark:text-[#94A3B8]">{subject.subtopics}</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#111111] dark:text-white">
                    Start learning
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-12 text-center">
          <h2 className="mb-4 text-2xl font-black text-[#111111] dark:text-white">Can&apos;t find your subject?</h2>
          <p className="mb-6 text-[#64748B] dark:text-[#94A3B8]">
            Upload your own notes and let AI create a custom study plan for any subject.
          </p>
          <Link
            href="/upload"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#111111] dark:bg-white px-8 text-sm font-bold text-white dark:text-[#111111] hover:bg-[#111111]/90 dark:hover:bg-white/90"
          >
            Upload notes →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
