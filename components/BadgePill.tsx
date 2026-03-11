import { ReactNode } from "react";

interface BadgePillProps {
  icon?: ReactNode;
  children: ReactNode;
}

export function BadgePill({ icon, children }: BadgePillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#F1F5F9] dark:bg-[#2D3748] px-4 py-2">
      {icon && <span className="h-4 w-4 flex items-center">{icon}</span>}
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-white">
        {children}
      </span>
    </div>
  );
}
