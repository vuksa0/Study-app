import Link from "next/link";
import { Search } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SUBJECT_ICON_MAP } from "@/components/SubjectIcons";
import MotionButton from "@/components/ui/motion-button";
import { SubjectShaderCard } from "@/components/SubjectShaderCard";

const subjects = [
  { id: "mathematics",      name: "Mathematics",      subtopics: "Algebra, Calculus, Statistics, Geometry",       topics: 145 },
  { id: "physics",          name: "Physics",          subtopics: "Mechanics, Thermodynamics, Electromagnetism",    topics: 112 },
  { id: "chemistry",        name: "Chemistry",        subtopics: "Organic, Inorganic, Physical, Analytical",       topics: 89  },
  { id: "history",          name: "History",          subtopics: "Ancient, Medieval, Modern, World War II",        topics: 76  },
  { id: "biology",          name: "Biology",          subtopics: "Cell Biology, Genetics, Ecology, Anatomy",       topics: 98  },
  { id: "geography",        name: "Geography",        subtopics: "Physical, Human, European, World Regions",       topics: 64  },
  { id: "english",          name: "English",          subtopics: "Grammar, Vocabulary, Reading, Writing",          topics: 58  },
  { id: "computer-science", name: "Computer Science", subtopics: "Programming, Data Structures, Algorithms",       topics: 132 },
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
          {subjects.map((subject) => {
            const def = SUBJECT_ICON_MAP[subject.id];
            return (
              <Link key={subject.id} href={`/subject/${subject.id}`}>
                <div className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] transition-all hover:border-[#CBD5E1] dark:hover:border-[#4A5568] hover:shadow-lg" style={{ minHeight: 220 }}>
                  <SubjectShaderCard subjectId={subject.id} />
                  <div className="relative z-10 p-8">
                    {def && (
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
                        <def.Icon className="h-6 w-6" />
                      </div>
                    )}
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="text-2xl font-bold text-white">{subject.name}</h3>
                      <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
                        {subject.topics} topics
                      </div>
                    </div>
                    <p className="mb-6 text-sm text-white/70">{subject.subtopics}</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      Start learning
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-12 text-center">
          <h2 className="mb-4 text-2xl font-black text-[#111111] dark:text-white">Can&apos;t find your subject?</h2>
          <p className="mb-6 text-[#64748B] dark:text-[#94A3B8]">
            Upload your own notes and let AI create a custom study plan for any subject.
          </p>
          <Link href="/upload">
            <MotionButton label="Upload notes" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
