import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

const DAILY_LIMITS = { free: 50, plus: 500 };

/**
 * Call at the top of every AI route handler.
 * Returns a NextResponse (error) if the request should be blocked, or null to proceed.
 */
export async function guardAI(): Promise<NextResponse | null> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const plan = (user.publicMetadata as { plan?: string })?.plan ?? "free";

  if (plan === "pro") return null;

  const limit = plan === "plus" ? DAILY_LIMITS.plus : DAILY_LIMITS.free;
  const supabase = getSupabaseAdmin();
  const dayStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("ai_usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", dayStart);

  if ((count ?? 0) >= limit) {
    return NextResponse.json(
      {
        error: `Daily AI limit reached (${limit} requests/day on ${plan} plan). Upgrade to Pro for unlimited access.`,
        limitReached: true,
      },
      { status: 429 }
    );
  }

  await supabase.from("ai_usage_logs").insert({ user_id: userId });
  return null;
}
