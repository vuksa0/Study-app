import Stripe from "stripe";

export function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

export const PLANS = {
  plus: {
    name: "Plus",
    priceId: process.env.STRIPE_PLUS_PRICE_ID!,
    price: 9.99,
    currency: "USD",
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    price: 24.99,
    currency: "USD",
  },
} as const;
