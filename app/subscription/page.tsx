"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function SubscriptionPage() {
  const { user } = useUser();
  const plan = (user?.publicMetadata?.plan as string) ?? "free";
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const planLabel =
    plan === "annual" ? "Annual" :
    plan === "monthly" ? "Monthly" :
    "Free";

  const actionLabel =
    plan === "annual" ? "Change your plan" :
    plan === "monthly" ? "Change to annual" :
    "Upgrade plan";

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    setCancelling(true);
    // TODO: connect to Stripe billing portal
    await new Promise((r) => setTimeout(r, 1000));
    setCancelled(true);
    setCancelling(false);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />
      <div className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-3xl font-black text-[#111111] dark:text-white mb-2">Subscription</h1>
        <p className="text-[#64748B] dark:text-[#94A3B8] mb-10">Manage your Thinkio plan.</p>

        <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-[#F8FAFC] dark:bg-[#1A1A1A] p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Current plan</p>
              <p className="text-xl font-black text-[#111111] dark:text-white">{planLabel}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Active</span>
          </div>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            {plan === "free"
              ? "You are on the free plan. Upgrade to get unlimited generations and priority access."
              : `You are on the ${planLabel} plan.`}
          </p>
        </div>

        <Link
          href="/#pricing"
          className="block w-full text-center py-3 px-6 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-sm font-bold mb-4 hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </Link>

        {plan !== "free" && !cancelled && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="text-sm text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
          >
            {cancelling ? "Cancelling…" : "Cancel subscription"}
          </button>
        )}
        {cancelled && (
          <p className="text-sm text-[#94A3B8]">Your subscription has been cancelled.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
