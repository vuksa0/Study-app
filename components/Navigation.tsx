"use client";

import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { UserButton, Show } from "@clerk/nextjs";
import { SubscriptionTab } from "@/components/SubscriptionTab";
import { CreditCard } from "lucide-react";
import { ThinkioLogo } from "@/components/ThinkioLogo";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-[#E2E8F0] dark:border-[#2D3748] bg-white/90 dark:bg-[#111111]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/">
          <ThinkioLogo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {[
            { href: "/#features", label: "Features" },
            { href: "/#how-it-works", label: "How it works" },
            { href: "/#pricing", label: "Pricing" },
            { href: "/subjects", label: "Subjects" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-[#E2E8F0] dark:border-[#2D3748] px-4 py-1.5 text-sm text-[#64748B] dark:text-[#94A3B8] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] dark:border-[#2D3748] text-[#64748B] dark:text-[#94A3B8] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
          <Show when="signed-out">
            <Link href="/login" className="text-sm text-[#111111] dark:text-white hover:text-[#64748B] dark:hover:text-[#94A3B8] transition-colors">Log in</Link>
            <Link href="/get-started">
              <InteractiveHoverButton text="Get started" className="h-9 py-0" />
            </Link>
          </Show>
          <Show when="signed-in">
            <UserButton>
              <UserButton.UserProfilePage label="Subscription" url="subscription" labelIcon={<CreditCard size={16} />}>
                <SubscriptionTab />
              </UserButton.UserProfilePage>
            </UserButton>
          </Show>
        </div>

        {/* Mobile right side */}
        <div className="flex items-center gap-2 md:hidden">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] dark:border-[#2D3748] text-[#64748B] dark:text-[#94A3B8]"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
          <Show when="signed-in">
            <UserButton>
              <UserButton.UserProfilePage label="Subscription" url="subscription" labelIcon={<CreditCard size={16} />}>
                <SubscriptionTab />
              </UserButton.UserProfilePage>
            </UserButton>
          </Show>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="text-[#111111] dark:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#111111] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {[
              { href: "/#features", label: "Features" },
              { href: "/#how-it-works", label: "How it works" },
              { href: "/#pricing", label: "Pricing" },
              { href: "/subjects", label: "Subjects" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full border border-[#E2E8F0] dark:border-[#2D3748] px-4 py-1.5 text-sm text-[#64748B] dark:text-[#94A3B8] text-center hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
            <Show when="signed-out">
              <Link href="/login" className="text-sm text-[#111111] dark:text-white">Log in</Link>
              <Link href="/get-started" onClick={() => setMobileMenuOpen(false)}>
                <InteractiveHoverButton text="Get started" className="w-full justify-center" />
              </Link>
            </Show>
          </div>
        </div>
      )}
    </nav>
  );
}
