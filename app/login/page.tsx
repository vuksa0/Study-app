import { SignIn } from "@clerk/nextjs";
import { ThinkioLogo } from "@/components/ThinkioLogo";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#0D0D12] flex flex-col">
      {/* Subtle background grid */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.08),transparent)]" />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-8 py-5">
        <Link href="/">
          <ThinkioLogo />
        </Link>
        <Link
          href="/"
          className="text-sm text-[#475569] hover:text-white transition-colors"
        >
          ← Back to home
        </Link>
      </div>

      {/* Center content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-12">
        {/* Headline above the form */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-[#475569]">
            Sign in to continue studying with Thinkio
          </p>
        </div>

        {/* Clerk SignIn */}
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full max-w-[400px]",
              card: "bg-[#111111] border border-[#1E293B] shadow-2xl shadow-black/50 rounded-2xl !p-6",
              headerTitle: "text-white font-bold",
              headerSubtitle: "text-[#64748B]",
              socialButtonsBlockButton: "border border-[#1E293B] bg-[#1A1A2E] hover:bg-[#1E293B] text-white rounded-xl transition-all",
              socialButtonsBlockButtonText: "text-white font-medium",
              dividerLine: "bg-[#1E293B]",
              dividerText: "text-[#475569] bg-[#111111]",
              formFieldLabel: "text-[#94A3B8] text-sm",
              formFieldInput: "bg-[#1A1A2E] border-[#1E293B] text-white rounded-xl focus:border-white transition-colors",
              formButtonPrimary: "bg-white hover:bg-white/90 text-[#111111] font-bold rounded-full h-11 transition-all",
              footerActionLink: "text-white hover:text-white/80",
              footerActionText: "text-[#475569]",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-[#94A3B8]",
              formFieldInputShowPasswordButton: "text-[#64748B]",
              otpCodeFieldInput: "bg-[#1A1A2E] border-[#1E293B] text-white",
              alertText: "text-red-400",
              formResendCodeLink: "text-white",
            },
          }}
        />

        <p className="mt-6 text-center text-xs text-[#334155]">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-[#475569] hover:text-white transition-colors underline underline-offset-2">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#475569] hover:text-white transition-colors underline underline-offset-2">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
