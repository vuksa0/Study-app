"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogOut, User, CreditCard } from "lucide-react";
import Link from "next/link";

const AVATAR_COLORS = [
  "#10B981", // green
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#F59E0B", // amber
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
];

function getColor(letter: string) {
  const idx = letter.toUpperCase().charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

interface UserAvatarProps {
  size?: "sm" | "md";
}

export function UserAvatar({ size = "md" }: UserAvatarProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const letter = (user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0] ?? "?").toUpperCase();
  const color = getColor(letter);
  const dim = size === "sm" ? "w-7 h-7 text-xs" : "w-8 h-8 text-sm";

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`${dim} rounded-full flex items-center justify-center font-bold text-white transition-all hover:opacity-85 active:scale-95 shrink-0`}
        style={{ background: color }}
      >
        {letter}
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 w-52 rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] shadow-xl z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-[#F1F5F9] dark:border-[#2D3748]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: color }}>
                {letter}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#111111] dark:text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-[#94A3B8] truncate">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <Link href="/subscription" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#374151] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#252525] transition-colors">
              <CreditCard className="h-4 w-4 text-[#94A3B8]" />
              Subscription
            </Link>
            <Link href="/dashboard" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#374151] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#252525] transition-colors">
              <User className="h-4 w-4 text-[#94A3B8]" />
              Dashboard
            </Link>
            <button
              onClick={() => { setOpen(false); signOut(() => router.push("/")); }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
