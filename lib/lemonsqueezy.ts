import crypto from "crypto";

export function getLSCheckoutUrl(variantId: string, email?: string, userId?: string) {
  const slug = process.env.LEMONSQUEEZY_STORE_SLUG!;
  const url = new URL(`https://${slug}.lemonsqueezy.com/checkout/buy/${variantId}`);
  if (email) url.searchParams.set("checkout[email]", email);
  if (userId) url.searchParams.set("checkout[custom][user_id]", userId);
  // After payment, redirect back to subscription page
  url.searchParams.set("checkout[success_url]", `${process.env.NEXT_PUBLIC_APP_URL}/subscription?success=true`);
  return url.toString();
}

export function verifyLSWebhook(body: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hash = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return hash === signature;
}

export async function getLSCustomerPortalUrl(customerId: string): Promise<string | null> {
  const res = await fetch(`https://api.lemonsqueezy.com/v1/customers/${customerId}`, {
    headers: { Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}` },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.attributes?.portal_url ?? null;
}

export const LS_PLANS: Record<string, { name: string; variantId: string; plan: "plus" | "pro" }> = {
  plus: { name: "Plus", variantId: process.env.LEMONSQUEEZY_PLUS_VARIANT_ID!, plan: "plus" },
  pro:  { name: "Pro",  variantId: process.env.LEMONSQUEEZY_PRO_VARIANT_ID!,  plan: "pro"  },
};
