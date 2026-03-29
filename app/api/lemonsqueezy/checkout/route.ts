import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getLSCheckoutUrl, LS_PLANS } from "@/lib/lemonsqueezy";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan = "plus" } = await req.json().catch(() => ({}));
  const planConfig = LS_PLANS[plan];
  if (!planConfig) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;

  const url = getLSCheckoutUrl(planConfig.variantId, email, userId);
  return NextResponse.json({ url });
}
