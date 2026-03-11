import { cn } from "@/lib/utils";

export function ThinkioLogo({ className, size = 32, iconOnly = false }: { className?: string; size?: number; iconOnly?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="url(#thinkio-grad)" />
        {/* Brain outline simplified as two lobes */}
        <path
          d="M10 14c0-2.2 1.8-4 4-4 .4 0 .8.1 1.1.2C15.6 8.9 17 8 18.5 8c2.5 0 4.5 2 4.5 4.5 0 .6-.1 1.2-.3 1.7.8.7 1.3 1.7 1.3 2.8 0 2.2-1.8 4-4 4h-1v1.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V21h-.5c-2.2 0-4-1.8-4-4 0-1.1.4-2.1 1.1-2.8C10.2 13.8 10 13 10 12.5"
          fill="white"
          opacity="0.95"
        />
        <path
          d="M14.5 14.5c.5-.5 1.2-.5 1.5 0M17 14.5c.5-.5 1.2-.5 1.5 0"
          stroke="url(#thinkio-grad)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="thinkio-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#895af6" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      {!iconOnly && <span className="text-lg font-bold text-[#111111] dark:text-white tracking-tight">Thinkio</span>}
    </span>
  );
}
