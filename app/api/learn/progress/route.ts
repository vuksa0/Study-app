import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const subject_id = searchParams.get("subject_id");
  const course_id = searchParams.get("course_id");

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("learn_progress")
    .select("lesson_id, course_id, subject_id, completed_at")
    .eq("user_id", userId);

  if (subject_id) query = query.eq("subject_id", subject_id);
  if (course_id) query = query.eq("course_id", course_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ progress: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subject_id, course_id, lesson_id } = await req.json();
  if (!subject_id || !course_id || !lesson_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("learn_progress")
    .upsert({ user_id: userId, subject_id, course_id, lesson_id }, { onConflict: "user_id,subject_id,course_id,lesson_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
