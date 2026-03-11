"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/library", icon: "menu_book", label: "Library" },
  { href: "/upload", icon: "add_circle", label: "Upload", raised: true },
  { href: "/library?tab=stats", icon: "insights", label: "Stats" },
  { href: "/library?tab=profile", icon: "person", label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#06060a]/90 backdrop-blur-xl border-t border-white/5 z-50">
      <div className="max-w-2xl mx-auto flex gap-2 px-6 pb-6 pt-3">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href.split("?")[0]);

          if (item.raised) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-1 flex-col items-center justify-center gap-1 text-primary"
              >
                <div className="p-2 rounded-full bg-primary/10 -mt-8 border-4 border-[#06060a] shadow-2xl">
                  <span className="material-symbols-outlined text-3xl leading-none">{item.icon}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <span className="material-symbols-outlined text-2xl leading-none">{item.icon}</span>
              <p className="text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
