import Link from "next/link";
import { ThinkioLogo } from "@/components/ThinkioLogo";

export function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] dark:border-[#2D3748] px-6 py-12 bg-white dark:bg-[#111111]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <ThinkioLogo />
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href="/#features" className="text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white transition-colors">Features</Link>
          <Link href="/#subjects" className="text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white transition-colors">Subjects</Link>
          <Link href="/#how-it-works" className="text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white transition-colors">How it works</Link>
          <Link href="/#reviews" className="text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white transition-colors">Reviews</Link>
        </div>
        <div className="text-sm text-[#94A3B8]">© 2025 Thinkio</div>
      </div>
    </footer>
  );
}
