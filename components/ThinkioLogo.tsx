import { cn } from "@/lib/utils";

export function ThinkioLogo({ className, size = 32, iconOnly = false }: { className?: string; size?: number; iconOnly?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#F5F5F5" />
        {/* Precision 4-pointed star — symmetric cubic bezier sparkle */}
        <path
          d="M16 4 C16.5 13 19 15.5 28 16 C19 16.5 16.5 19 16 28 C15.5 19 13 16.5 4 16 C13 15.5 15.5 13 16 4Z"
          fill="#111111"
        />
      </svg>
      {!iconOnly && (
        <span className="text-[17px] font-bold tracking-[-0.4px] text-[#111111] dark:text-white">
          Thinkio
        </span>
      )}
    </span>
  );
}
