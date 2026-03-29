"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2, Zap, Crown, Sparkles, ArrowRight,
  Settings, BookOpen, Upload, Library, TrendingUp, Bot,
} from "lucide-react";
import { ThinkioLogo } from "@/components/ThinkioLogo";
import { UserAvatar } from "@/components/UserAvatar";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Subjects",  href: "/dashboard",    icon: BookOpen   },
  { label: "AI Tutor",  href: "/tutor",         icon: Bot        },
  { label: "Upload",    href: "/upload",        icon: Upload     },
  { label: "History",   href: "/library",       icon: Library    },
  { label: "Progress",  href: "/progress",      icon: TrendingUp },
  { label: "Settings",  href: "/subscription",  icon: Settings   },
];

const PLAN_META = {
  free:  { label: "Free",  color: "#64748B", bg: "#F1F5F9", icon: Sparkles  },
  plus:  { label: "Plus",  color: "#F59E0B", bg: "#FEF3C7", icon: Zap       },
  pro:   { label: "Pro",   color: "#8B5CF6", bg: "#EDE9FE", icon: Crown     },
};

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const success = searchParams.get("success") === "true";

  const [status, setStatus] = useState<{ plan: string; usedToday: number; limit: number | null } | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subscription/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setError("Could not load subscription info."));
  }, []);

  async function openPortal() {
    setPortalLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lemonsqueezy/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError("Could not open billing portal. Please contact support.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  }

  async function upgrade(plan: "plus" | "pro") {
    setUpgradeLoading(plan);
    setError(null);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError("Could not start checkout. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setUpgradeLoading(null);
    }
  }

  const plan = status?.plan ?? "free";
  const meta = PLAN_META[plan as keyof typeof PLAN_META] ?? PLAN_META.free;
  const PlanIcon = meta.icon;
  const usedPct = status?.limit ? Math.min(100, Math.round((status.usedToday / status.limit) * 100)) : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8FA]">

      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-4 border-b border-gray-100">
          <Link href="/"><ThinkioLogo /></Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                pathname === href
                  ? "bg-[#111111] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pb-4">
          <UserAvatar size="sm" />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-xl mx-auto space-y-6">

          {/* Success banner */}
          {success && (
            <div className="flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 px-5 py-4">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-700">Subscription activated!</p>
                <p className="text-xs text-green-600">Your plan is now active. Enjoy your increased limits.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Current plan card */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-4">Current Plan</p>

            {!status ? (
              <div className="h-16 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#F1F5F9] animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-[#F1F5F9] animate-pulse" />
                  <div className="h-3 w-16 rounded bg-[#F1F5F9] animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: meta.bg }}>
                    <PlanIcon className="h-5 w-5" style={{ color: meta.color }} />
                  </div>
                  <div>
                    <p className="font-bold text-[#111111] text-lg">{meta.label} Plan</p>
                    <p className="text-xs text-[#94A3B8]">
                      {plan === "free" ? "Free forever" : plan === "plus" ? "$9.99 / month" : "$24.99 / month"}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: meta.bg, color: meta.color }}>
                  {meta.label.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Usage card */}
          {status && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
              <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-4">Today&apos;s AI Usage</p>
              {status.limit === null ? (
                <p className="text-sm text-[#111111] font-medium">Unlimited — no daily cap on Pro</p>
              ) : (
                <>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-2xl font-bold text-[#111111]">{status.usedToday}</span>
                    <span className="text-sm text-[#94A3B8]">/ {status.limit} requests</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${usedPct}%`,
                        background: usedPct > 85 ? "#EF4444" : usedPct > 60 ? "#F59E0B" : "#111111",
                      }}
                    />
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-2">Resets every 24 hours</p>
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 space-y-3">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-4">Manage</p>

            {plan !== "free" ? (
              /* Paid plan — show Stripe portal button */
              <button
                onClick={openPortal}
                disabled={portalLoading}
                className="w-full flex items-center justify-between rounded-xl border border-[#E2E8F0] px-4 py-3.5 text-sm font-semibold text-[#111111] hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-[#94A3B8]" />
                  {portalLoading ? "Opening portal…" : "Manage Subscription"}
                </span>
                <ArrowRight className="h-4 w-4 text-[#94A3B8]" />
              </button>
            ) : (
              /* Free plan — show upgrade options */
              <>
                <button
                  onClick={() => upgrade("plus")}
                  disabled={!!upgradeLoading}
                  className="w-full flex items-center justify-between rounded-xl bg-[#111111] px-4 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    {upgradeLoading === "plus" ? "Loading…" : "Upgrade to Plus — $9.99/mo"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => upgrade("pro")}
                  disabled={!!upgradeLoading}
                  className="w-full flex items-center justify-between rounded-xl border border-[#E2E8F0] px-4 py-3.5 text-sm font-semibold text-[#111111] hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-[#8B5CF6]" />
                    {upgradeLoading === "pro" ? "Loading…" : "Upgrade to Pro — $24.99/mo"}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#94A3B8]" />
                </button>
              </>
            )}

            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Plan comparison */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-4">Plan Comparison</p>
            <div className="space-y-3">
              {[
                { feature: "Daily AI requests", free: "50", plus: "500", pro: "Unlimited" },
                { feature: "Quiz generation",   free: "✓",  plus: "✓",   pro: "✓"         },
                { feature: "Flashcards",         free: "✓",  plus: "✓",   pro: "✓"         },
                { feature: "Lessons",            free: "✓",  plus: "✓",   pro: "✓"         },
                { feature: "File upload",        free: "✓",  plus: "✓",   pro: "✓"         },
                { feature: "AI Tutor",           free: "✓",  plus: "✓",   pro: "✓"         },
                { feature: "Priority support",   free: "—",  plus: "✓",   pro: "✓"         },
              ].map((row) => (
                <div key={row.feature} className="grid grid-cols-4 items-center gap-2 text-sm">
                  <span className="col-span-1 text-[#64748B] text-xs">{row.feature}</span>
                  {(["free", "plus", "pro"] as const).map((p) => (
                    <span key={p}
                      className={`text-center text-xs font-medium py-1 rounded-lg ${
                        plan === p ? "bg-[#111111] text-white" : "bg-[#F8FAFC] text-[#64748B]"
                      }`}>
                      {row[p]}
                    </span>
                  ))}
                </div>
              ))}
              <div className="grid grid-cols-4 gap-2 mt-1 text-[10px] font-semibold text-[#94A3B8]">
                <span />
                <span className="text-center">FREE</span>
                <span className="text-center">PLUS</span>
                <span className="text-center">PRO</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function SubscriptionPage() {
  return <Suspense><SubscriptionContent /></Suspense>;
}
