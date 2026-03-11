"use client";

import { useUser } from "@clerk/nextjs";

export function SubscriptionTab() {
  const { user } = useUser();
  const plan = (user?.publicMetadata?.plan as string) ?? "free";

  const planLabel =
    plan === "annual" ? "Annual" :
    plan === "monthly" ? "Monthly" :
    "Free";

  const actionLabel =
    plan === "annual" ? "Change your plan" :
    plan === "monthly" ? "Change to annual" :
    "Upgrade plan";

  return (
    <div style={{ padding: "24px 0", maxWidth: 480 }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Subscription</h1>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>Manage your Thinkio plan.</p>

      <div style={{
        border: "1px solid #E2E8F0",
        borderRadius: 16,
        padding: "24px",
        marginBottom: 20,
        background: "#F8FAFC",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", marginBottom: 4 }}>Current plan</p>
            <p style={{ fontSize: 20, fontWeight: 900 }}>{planLabel}</p>
          </div>
          <span style={{
            padding: "4px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            background: "#dcfce7",
            color: "#15803d",
          }}>Active</span>
        </div>
        <p style={{ fontSize: 14, color: "#64748B" }}>
          {plan === "free"
            ? "You are on the free plan. Upgrade for unlimited generations and priority access."
            : `You are on the ${planLabel} plan.`}
        </p>
      </div>

      <button
        onClick={() => window.location.href = plan === "free" ? "/#pricing" : "/subscription"}
        style={{
          display: "block",
          width: "100%",
          padding: "12px",
          borderRadius: 12,
          border: "1px solid #111111",
          background: "#111111",
          color: "white",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          marginBottom: 12,
        }}
      >
        {actionLabel}
      </button>

      {plan !== "free" && (
        <button
          onClick={() => {
            if (confirm("Are you sure you want to cancel your subscription?")) {
              window.location.href = "/subscription?cancel=1";
            }
          }}
          style={{
            fontSize: 13,
            color: "#ef4444",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Cancel subscription
        </button>
      )}
    </div>
  );
}
