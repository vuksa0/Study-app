import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subjects, goal, level, study_style } = await req.json() as {
    subjects: string[];
    goal: string;
    level: string;
    study_style: string;
  };

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("user_preferences").upsert({
    user_id: userId,
    subjects,
    goal,
    level,
    study_style,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
