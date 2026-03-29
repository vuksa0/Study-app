import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

const DAILY_LIMITS = { free: 50, plus: 500, pro: Infinity };

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const plan = (user.publicMetadata as { plan?: string })?.plan ?? "free";

  const supabase = getSupabaseAdmin();
  const dayStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("ai_usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", dayStart);

  const limit = plan === "pro" ? null : DAILY_LIMITS[plan as "free" | "plus"] ?? 50;

  return NextResponse.json({ plan, usedToday: count ?? 0, limit });
}
