import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "light" | "dark";
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", variant = "light", className, ...props }, ref) => {
  const isDark = variant === "dark";
  return (
    <button
      ref={ref}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-full border px-6 py-2.5 text-center text-sm font-semibold transition-colors",
        isDark
          ? "border-[#111111] bg-[#111111] text-white"
          : "border-[#111111] bg-white text-[#111111]",
        className,
      )}
      {...props}
    >
      <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className={cn(
        "absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100",
        isDark ? "text-[#111111]" : "text-white"
      )}>
        <span>{text}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
      <div className={cn(
        "absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:translate-y-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.8]",
        isDark ? "bg-white/30" : "bg-[#111111]"
      )} />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
