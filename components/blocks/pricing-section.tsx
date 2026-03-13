"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { CheckIcon, ArrowRightIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Feature {
  name: string
  included: boolean
}

interface PricingTier {
  name: string
  plan: string | null
  price: { monthly: number; yearly: number }
  description: string
  features: Feature[]
  highlight?: boolean
  badge?: string
  cta: string
}

const tiers: PricingTier[] = [
  {
    name: "Free",
    plan: null,
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for getting started",
    cta: "Get started",
    features: [
      { name: "3 AI generations per week", included: true },
      { name: "1 subject", included: true },
      { name: "Quiz & flashcard generation", included: true },
      { name: "Basic lessons", included: true },
      { name: "Learn courses", included: false },
      { name: "Exam Prep roadmap", included: false },
      { name: "Personal library", included: false },
    ],
  },
  {
    name: "Plus",
    plan: "plus",
    price: { monthly: 9, yearly: 86 },
    description: "For serious students",
    highlight: true,
    badge: "Most Popular",
    cta: "Get started",
    features: [
      { name: "20 AI generations per week", included: true },
      { name: "All 8 subjects", included: true },
      { name: "Quiz, flashcards & lessons", included: true },
      { name: "Full Learn section + courses", included: true },
      { name: "Exam Prep roadmap", included: true },
      { name: "Personal library (save results)", included: true },
      { name: "Unlimited uploads", included: false },
    ],
  },
  {
    name: "Pro",
    plan: "pro",
    price: { monthly: 25, yearly: 240 },
    description: "For power users",
    cta: "Get started",
    features: [
      { name: "Unlimited AI generations", included: true },
      { name: "All 8 subjects", included: true },
      { name: "All Plus features", included: true },
      { name: "Unlimited uploads (notes/PDFs)", included: true },
      { name: "Unlimited Exam Prep roadmaps", included: true },
      { name: "Export flashcards & quizzes", included: true },
    ],
  },
]

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const { isSignedIn } = useAuth()
  const router = useRouter()

  async function handleCta(tier: PricingTier) {
    if (!tier.plan) {
      router.push("/login")
      return
    }
    if (!isSignedIn) {
      router.push("/login")
      return
    }
    setLoadingPlan(tier.plan)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: tier.plan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      // ignore
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <section id="pricing" className="px-6 py-16 md:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">PRICING</div>
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-black tracking-[-0.02em] text-[#111111] dark:text-white md:text-5xl">
            Simple pricing
          </h2>

          {/* Toggle */}
          <div className="inline-flex items-center self-start rounded-full border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-1">
            {["Monthly", "Yearly"].map((p) => (
              <button
                key={p}
                onClick={() => setIsYearly(p === "Yearly")}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
                  (p === "Yearly") === isYearly
                    ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-sm"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white",
                )}
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

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex flex-col rounded-3xl border p-8 transition-all duration-200",
                tier.highlight
                  ? "border-[#111111] dark:border-white bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-2xl"
                  : "border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#111111] hover:border-[#CBD5E1] dark:hover:border-[#4A5568] hover:shadow-md",
              )}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-8">
                  <span className={cn(
                    "rounded-full px-3 py-1 text-xs font-black",
                    tier.highlight
                      ? "bg-white dark:bg-[#111111] text-[#111111] dark:text-white"
                      : "bg-[#111111] dark:bg-white text-white dark:text-[#111111]",
                  )}>
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Name + Price */}
              <div className="mb-6">
                <p className={cn(
                  "mb-4 text-xs font-bold uppercase tracking-widest",
                  tier.highlight ? "text-white/60 dark:text-[#111111]/60" : "text-[#94A3B8]",
                )}>
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className={cn(
                    "text-5xl font-black",
                    tier.highlight ? "text-white dark:text-[#111111]" : "text-[#111111] dark:text-white",
                  )}>
                    ${isYearly ? tier.price.yearly : tier.price.monthly}
                  </span>
                  <span className={cn(
                    "text-sm font-medium",
                    tier.highlight ? "text-white/50 dark:text-[#111111]/50" : "text-[#94A3B8]",
                  )}>
                    /{isYearly ? "year" : "month"}
                  </span>
                </div>
                <p className={cn(
                  "mt-2 text-sm",
                  tier.highlight ? "text-white/70 dark:text-[#111111]/70" : "text-[#64748B] dark:text-[#94A3B8]",
                )}>
                  {tier.description}
                </p>
              </div>

              {/* Features */}
              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f.name} className="flex items-center gap-3">
                    <span className={cn(
                      "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full",
                      f.included
                        ? tier.highlight
                          ? "bg-white/20 dark:bg-[#111111]/20"
                          : "bg-[#F1F5F9] dark:bg-[#2D3748]"
                        : "opacity-30",
                    )}>
                      <CheckIcon className={cn(
                        "h-3 w-3",
                        f.included
                          ? tier.highlight ? "text-white dark:text-[#111111]" : "text-[#111111] dark:text-white"
                          : tier.highlight ? "text-white/40 dark:text-[#111111]/40" : "text-[#94A3B8]",
                      )} />
                    </span>
                    <span className={cn(
                      "text-sm",
                      !f.included && "opacity-40",
                      tier.highlight ? "text-white dark:text-[#111111]" : "text-[#475569] dark:text-[#94A3B8]",
                    )}>
                      {f.name}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleCta(tier)}
                disabled={loadingPlan === tier.plan && tier.plan !== null}
                className={cn(
                  "group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full text-sm font-bold transition-all duration-200 disabled:opacity-50",
                  tier.highlight
                    ? "bg-white dark:bg-[#111111] text-[#111111] dark:text-white hover:opacity-90"
                    : "border border-[#111111] dark:border-white bg-transparent text-[#111111] dark:text-white hover:bg-[#111111] dark:hover:bg-white hover:text-white dark:hover:text-[#111111]",
                )}
              >
                <span className="flex items-center gap-2">
                  {loadingPlan === tier.plan ? "Redirecting…" : tier.cta}
                  {loadingPlan !== tier.plan && (
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  )}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
