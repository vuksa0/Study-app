import { NextRequest, NextResponse } from "next/server";
import { verifyLSWebhook, LS_PLANS } from "@/lib/lemonsqueezy";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { clerkClient } from "@clerk/nextjs/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-signature") ?? "";

  if (!verifyLSWebhook(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const eventName: string = event.meta?.event_name;
  const userId: string | undefined = event.meta?.custom_data?.user_id;
  const attrs = event.data?.attributes;

  if (!userId || !attrs) return NextResponse.json({ received: true });

  const supabase = getSupabaseAdmin();
  const clerk = await clerkClient();

  // Find which plan this variant belongs to
  const planEntry = Object.values(LS_PLANS).find(
    (p) => String(p.variantId) === String(attrs.variant_id)
  );

  switch (eventName) {
    case "subscription_created":
    case "subscription_updated": {
      const isActive = attrs.status === "active" || attrs.status === "on_trial";
      const plan = isActive ? (planEntry?.plan ?? "plus") : "free";

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        ls_customer_id: String(attrs.customer_id),
        ls_subscription_id: String(event.data.id),
        plan,
        status: attrs.status,
        current_period_end: attrs.renews_at ?? attrs.ends_at,
      }, { onConflict: "user_id" });

      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { plan },
      });

      if (eventName === "subscription_created") {
        const userEmail = attrs.user_email ?? "unknown";
        await resend.emails.send({
          from: "Thinkio <onboarding@resend.dev>",
          to: process.env.NOTIFICATION_EMAIL!,
          subject: `New ${plan.toUpperCase()} subscriber!`,
          text: `New subscription!\n\nPlan: ${plan}\nEmail: ${userEmail}\nStatus: ${attrs.status}`,
        });
      }
      break;
    }

    case "subscription_cancelled":
    case "subscription_expired": {
      await supabase.from("subscriptions").upsert({
        user_id: userId,
        plan: "free",
        status: attrs.status,
      }, { onConflict: "user_id" });

      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { plan: "free" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
