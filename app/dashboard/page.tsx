import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { getLesson } from "@/lib/courses";
import { DashboardClient } from "./DashboardClient";

type ProgressRecord = { subject_id: string; course_id: string; lesson_id: string; completed_at: string };

const SUBJECT_NAMES: Record<string, string> = {
  mathematics: "Mathematics", physics: "Physics", chemistry: "Chemistry",
  history: "History", biology: "Biology", geography: "Geography",
  english: "English", "computer-science": "Computer Science",
};

function computeStreak(records: ProgressRecord[]): number {
  if (records.length === 0) return 0;
  const days = new Set(records.map((r) => r.completed_at.slice(0, 10)));
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (days.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function computeWeeklyActivity(records: ProgressRecord[]): number[] {
  const activity = new Array(7).fill(0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const r of records) {
    const d = new Date(r.completed_at);
    d.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - d.getTime()) / 86_400_000);
    if (diff >= 0 && diff < 7) activity[6 - diff]++;
  }
  return activity;
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const user = await currentUser();
  const firstName = user?.firstName || user?.username || "Student";

  const supabase = getSupabaseAdmin();
  const [{ data }, { data: prefsData }] = await Promise.all([
    supabase
      .from("learn_progress")
      .select("subject_id, course_id, lesson_id, completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false }),
    supabase
      .from("user_preferences")
      .select("subjects, goal, study_style, level")
      .eq("user_id", userId)
      .single(),
  ]);

  const records: ProgressRecord[] = data ?? [];
  const streak = computeStreak(records);
  const weekly = computeWeeklyActivity(records);
  const weeklyCompleted = weekly.reduce((a, b) => a + b, 0);
  const weeklyGoal = 10;
  const weeklyPct = Math.min(100, Math.round((weeklyCompleted / weeklyGoal) * 100));
  const totalCompleted = records.length;

  const last = records[0];
  let lastLesson = null as null | { title: string; courseTitle: string; subjectName: string; href: string; progress: number };
  if (last) {
    const info = getLesson(last.subject_id, last.course_id, last.lesson_id);
    if (info) {
      const totalInCourse = info.course.modules.flatMap((m) => m.lessons).length;
      const completedInCourse = records.filter((r) => r.course_id === last.course_id).length;
      lastLesson = {
        title: info.lesson.title,
        courseTitle: info.course.title,
        subjectName: SUBJECT_NAMES[last.subject_id] ?? last.subject_id,
        href: `/learn/${last.subject_id}/${last.course_id}/${last.lesson_id}`,
        progress: Math.min(100, Math.round((completedInCourse / totalInCourse) * 100)),
      };
    }
  }

  return (
    <DashboardClient
      firstName={firstName}
      totalCompleted={totalCompleted}
      streak={streak}
      weekly={weekly}
      weeklyCompleted={weeklyCompleted}
      weeklyPct={weeklyPct}
      lastLesson={lastLesson}
      preferredSubjects={prefsData?.subjects ?? []}
      goal={prefsData?.goal ?? null}
      studyStyle={prefsData?.study_style ?? null}
    />
  );
}
