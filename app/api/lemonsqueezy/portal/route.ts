import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { getLSCustomerPortalUrl } from "@/lib/lemonsqueezy";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("ls_customer_id")
    .eq("user_id", userId)
    .single();

  if (!sub?.ls_customer_id) {
    return NextResponse.json({ error: "No subscription found" }, { status: 404 });
  }

  const portalUrl = await getLSCustomerPortalUrl(sub.ls_customer_id);
  if (!portalUrl) return NextResponse.json({ error: "Could not get portal URL" }, { status: 500 });

  return NextResponse.json({ url: portalUrl });
}
