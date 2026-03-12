"use client";

import { useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Zap, Settings } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Link from "next/link";

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setLoading(false);
    } catch { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />
      <div className="mx-auto max-w-lg px-6 py-16">
        {success && (
          <div className="flex items-center gap-3 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-6 py-5 mb-8">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-green-700 dark:text-green-400">You&apos;re on Plus!</p>
              <p className="text-xs text-green-600 dark:text-green-500">Your subscription is now active. Enjoy 20 generations per week.</p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] dark:bg-white">
              <Zap className="h-5 w-5 text-white dark:text-[#111111]" />
            </div>
            <div>
              <h1 className="font-bold text-[#111111] dark:text-white">Plus Plan</h1>
              <p className="text-sm text-[#94A3B8]">$9.99 / month</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={openPortal}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] py-3 text-sm font-semibold text-[#111111] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#222] transition-colors disabled:opacity-50"
            >
              <Settings className="h-4 w-4" />
              {loading ? "Opening…" : "Manage Subscription"}
            </button>
            <Link href="/" className="w-full text-center rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] py-3 text-sm font-semibold hover:opacity-90 transition-opacity block">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function SubscriptionPage() {
  return <Suspense><SubscriptionContent /></Suspense>;
}
