"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Check, Zap, ChevronLeft } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLocale } from "@/components/LocaleProvider";

const FREE_FEATURES = [
  "3 generations per week",
  "All subjects & modes",
  "Quiz, Lesson, Flashcards",
  "Basic roadmap",
];

const PLUS_FEATURES = [
  "20 generations per week",
  "All subjects & modes",
  "Quiz, Lesson, Flashcards, Problems",
  "Personalized AI roadmaps",
  "Priority AI responses",
  "Save to library",
];

export default function PricingPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { formatPrice } = useLocale();

  async function handleUpgrade() {
    if (!isSignedIn) { router.push("/login"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "plus" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navigation />
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-[#64748B] dark:hover:text-white transition-colors mb-12">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#111111] dark:text-white mb-3">Simple pricing</h1>
          <p className="text-[#64748B] dark:text-[#94A3B8]">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-8">
            <p className="text-sm font-semibold text-[#94A3B8] mb-2">Free</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-black text-[#111111] dark:text-white">$0</span>
              <span className="text-[#94A3B8] mb-1">/month</span>
            </div>
            <ul className="flex flex-col gap-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#64748B] dark:text-[#94A3B8]">
                  <Check className="h-4 w-4 text-[#94A3B8] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] py-3 text-center text-sm font-semibold text-[#94A3B8]">
              Current plan
            </div>
          </div>

          {/* Plus */}
          <div className="rounded-2xl border-2 border-[#111111] dark:border-white bg-white dark:bg-[#1A1A1A] p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold">
              <Zap className="h-3 w-3" />
              POPULAR
            </div>
            <p className="text-sm font-semibold text-[#111111] dark:text-white mb-2">Plus</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-black text-[#111111] dark:text-white">{formatPrice(9.99, 99)}</span>
              <span className="text-[#94A3B8] mb-1">/month</span>
            </div>
            <ul className="flex flex-col gap-3 mb-8">
              {PLUS_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#111111] dark:text-white">
                  <Check className="h-4 w-4 text-[#111111] dark:text-white shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] py-3.5 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Redirecting…" : "Upgrade to Plus"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
