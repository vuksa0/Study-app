"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Check, Zap, Shield, ArrowLeft, Loader2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";

const PLAN_DATA = {
  plus: {
    id: "plus",
    name: "Plus",
    price: "9.99",
    priceYearly: "95.90",
    description: "For serious students",
    icon: Zap,
    features: [
      "20 AI generations per week",
      "All subjects & modes",
      "Quiz, flashcards & lessons",
      "Full Learn section + courses",
      "Exam Prep roadmap",
      "Personal library (save results)",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: "24.99",
    priceYearly: "239.90",
    description: "For power users",
    icon: Shield,
    features: [
      "Unlimited AI generations",
      "All subjects & modes",
      "All Plus features",
      "Unlimited uploads (notes/PDFs)",
      "Unlimited Exam Prep roadmaps",
      "Export flashcards & quizzes",
    ],
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  const planId = searchParams.get("plan") as "plus" | "pro" | null;
  const plan = planId ? PLAN_DATA[planId] : null;

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push(`/login?redirect=/checkout?plan=${planId ?? ""}`);
      return;
    }
    if (!plan) {
      router.push("/pricing");
      return;
    }

    async function startCheckout() {
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
          setError("Could not start checkout. Please try again.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      }
    }

    startCheckout();
  }, [isLoaded, isSignedIn, planId, plan, router]);

  if (!plan) return null;

  const Icon = plan.icon;
  const price = isYearly ? plan.priceYearly : plan.price;
  const period = isYearly ? "year" : "month";

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />
      <div className="mx-auto max-w-md px-6 py-16">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-[#64748B] dark:hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to pricing
        </Link>

        <div className="rounded-3xl border-2 border-[#111111] dark:border-white p-8">
          {/* Plan header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] dark:bg-white">
              <Icon className="h-5 w-5 text-white dark:text-[#111111]" />
            </div>
            <div>
              <p className="font-bold text-[#111111] dark:text-white">{plan.name}</p>
              <p className="text-sm text-[#94A3B8]">{plan.description}</p>
            </div>
          </div>

          {/* Billing toggle */}
          <div className="inline-flex items-center mb-6 rounded-full border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-1">
            {["Monthly", "Yearly"].map((p) => (
              <button
                key={p}
                onClick={() => setIsYearly(p === "Yearly")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
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

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-5xl font-black text-[#111111] dark:text-white">${price}</span>
            <span className="text-[#94A3B8] text-sm">/{period}</span>
          </div>

          {/* Features */}
          <ul className="flex flex-col gap-3 mb-8">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-[#475569] dark:text-[#94A3B8]">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] dark:bg-[#2D3748]">
                  <Check className="h-3 w-3 text-[#111111] dark:text-white" />
                </div>
                {f}
              </li>
            ))}
          </ul>

          {error ? (
            <div className="space-y-3">
              <p className="text-sm text-red-500 text-center">{error}</p>
              <button
                onClick={() => { setError(null); window.location.reload(); }}
                className="w-full rounded-2xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] py-4 text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="w-full rounded-2xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] py-4 text-sm font-bold flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting to Stripe…
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          🔒 Secure checkout powered by Stripe · Cancel anytime
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
