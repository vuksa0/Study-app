import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { subjects } from "@/lib/subjects";
import { getCoursesBySubject } from "@/lib/courses";
import { SUBJECT_ICON_MAP } from "@/components/SubjectIcons";
import { SubjectShaderCard } from "@/components/SubjectShaderCard";

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-12">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">LEARN</div>
          <h1 className="text-4xl font-black tracking-tight text-[#111111] dark:text-white md:text-5xl">
            Pick a subject to study
          </h1>
          <p className="mt-3 max-w-xl text-base text-[#64748B] dark:text-[#94A3B8]">
            Structured courses at every level, with AI-generated lessons tailored to what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map((s) => {
            const courses = getCoursesBySubject(s.id);
            const levels = [...new Set(courses.map((c) => c.level))];
            const def = SUBJECT_ICON_MAP[s.id];
            return (
              <Link key={s.id} href={`/learn/${s.id}`}>
                <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-transparent h-full min-h-[180px] transition-all hover:shadow-lg cursor-pointer">
                  <SubjectShaderCard subjectId={s.id} />
                  <div className="relative z-10 flex flex-col p-6 h-full">
                    {def && (
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
                        <def.Icon className="h-5 w-5" />
                      </div>
                    )}
                    <h2 className="mb-1 text-base font-bold text-white">{s.name}</h2>
                    <p className="text-xs text-white/60 mb-4">{courses.length} courses</p>
                    <div className="mt-auto flex flex-wrap gap-1.5">
                      {levels.map((level) => (
                        <span
                          key={level}
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white"
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
