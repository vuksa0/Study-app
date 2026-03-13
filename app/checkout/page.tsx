"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Check, Zap, Shield, ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";

const PLANS = [
  {
    id: "plus",
    name: "Plus",
    price: 9,
    priceYearly: 86,
    description: "For serious students",
    icon: Zap,
    color: "bg-[#111111] dark:bg-white",
    iconColor: "text-white dark:text-[#111111]",
    highlight: true,
    badge: "Most Popular",
    features: [
      "20 AI generations per week",
      "All subjects & modes",
      "Quiz, flashcards & lessons",
      "Full Learn section + courses",
      "Exam Prep roadmap",
      "Personal library (save results)",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 25,
    priceYearly: 240,
    description: "For power users",
    icon: Shield,
    color: "bg-[#F8FAFC] dark:bg-[#1A1A1A]",
    iconColor: "text-[#111111] dark:text-white",
    highlight: false,
    badge: null,
    features: [
      "Unlimited AI generations",
      "All subjects & modes",
      "All Plus features",
      "Unlimited uploads (notes/PDFs)",
      "Unlimited Exam Prep roadmaps",
      "Export flashcards & quizzes",
    ],
  },
];

export default function CheckoutPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  async function handleCheckout(planId: string) {
    if (!isSignedIn) {
      router.push("/login?redirect=/checkout");
      return;
    }
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoadingPlan(null);
      }
    } catch {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-[#64748B] dark:hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to pricing
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#111111] dark:text-white mb-2">
            Choose your plan
          </h1>
          <p className="text-[#64748B] dark:text-[#94A3B8]">
            Secure payment via Stripe. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center mt-6 rounded-full border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-1">
            {["Monthly", "Yearly"].map((p) => (
              <button
                key={p}
                onClick={() => setIsYearly(p === "Yearly")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  (p === "Yearly") === isYearly
                    ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-sm"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white"
                }`}
              >
                {p}
                {p === "Yearly" && (
                  <span className="ml-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-400">
                    −20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const price = isYearly ? plan.priceYearly : plan.price;
            const period = isYearly ? "year" : "month";
            const isLoading = loadingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl border-2 p-8 transition-all duration-200 ${
                  plan.highlight
                    ? "border-[#111111] dark:border-white shadow-2xl"
                    : "border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#CBD5E1] dark:hover:border-[#4A5568]"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-8">
                    <span className="rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-3 py-1 text-xs font-black">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${plan.color}`}>
                    <Icon className={`h-5 w-5 ${plan.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-bold text-[#111111] dark:text-white">{plan.name}</p>
                    <p className="text-sm text-[#94A3B8]">{plan.description}</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-black text-[#111111] dark:text-white">${price}</span>
                  <span className="text-[#94A3B8] text-sm">/{period}</span>
                </div>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[#475569] dark:text-[#94A3B8]">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] dark:bg-[#2D3748]">
                        <Check className="h-3 w-3 text-[#111111] dark:text-white" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={isLoading}
                  className={`w-full rounded-2xl py-4 text-sm font-bold transition-all duration-200 disabled:opacity-50 ${
                    plan.highlight
                      ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:opacity-90"
                      : "border-2 border-[#111111] dark:border-white text-[#111111] dark:text-white hover:bg-[#111111] dark:hover:bg-white hover:text-white dark:hover:text-[#111111]"
                  }`}
                >
                  {isLoading ? "Redirecting to Stripe…" : `Get ${plan.name} — $${price}/${period}`}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-8">
          🔒 Secure checkout powered by Stripe · No credit card stored on our servers
        </p>
      </div>
    </div>
  );
}
