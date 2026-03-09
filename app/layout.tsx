import type { Metadata } from "next";
import "./globals.css";
import BackButton from "@/components/BackButton";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "LearnAI — Study Smarter",
  description: "AI-powered quizzes, flash cards, and lessons from any subject or uploaded file.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${font.variable} min-h-screen antialiased`}>
        <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b"
          style={{ borderColor: "var(--border)", background: "rgba(6,6,10,0.85)", backdropFilter: "blur(14px)" }}>
          <div className="max-w-5xl mx-auto px-5 h-full flex items-center justify-between">
            {/* Left: back + logo */}
            <div className="flex items-center gap-3">
              <BackButton />
              <a href="/" className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>
                  L
                </div>
                <span className="font-semibold tracking-tight text-white/90">LearnAI</span>
              </a>
            </div>

            {/* Centre: nav links (hidden on small screens) */}
            <nav className="hidden md:flex items-center gap-6">
              {[
                { href: "/#how-it-works", label: "How it works" },
                { href: "/#features",     label: "Features" },
                { href: "/#subjects",     label: "Subjects" },
              ].map(({ href, label }) => (
                <a key={label} href={href}
                  className="text-sm transition-colors hover:text-white/80"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  {label}
                </a>
              ))}
            </nav>

            {/* Right: CTA */}
            <div className="flex items-center gap-2">
              <a href="/upload" className="nav-cta text-sm font-medium px-4 py-1.5 rounded-full transition-all">
                Upload &amp; Learn
              </a>
            </div>
          </div>
        </header>
        <div className="pt-14">{children}</div>
      </body>
    </html>
  );
}
