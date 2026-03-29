import React from "react";
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
        "inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80 active:scale-[0.97] transition-[opacity,transform] duration-150",
        isDark
          ? "border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]"
          : "border-[#111111] bg-white text-[#111111] dark:border-white dark:bg-transparent dark:text-white",
        className,
      )}
      {...props}
    >
      {text}
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
