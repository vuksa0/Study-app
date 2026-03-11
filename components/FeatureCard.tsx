import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-8 transition-all hover:shadow-sm">
      <div className="mb-4 text-[28px] text-[#111111] dark:text-white">{icon}</div>
      <h3 className="mb-2 text-lg font-bold text-[#111111] dark:text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">{description}</p>
    </div>
  );
}
