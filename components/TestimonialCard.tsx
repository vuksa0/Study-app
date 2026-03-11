import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
}

export function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#1A1A1A] p-8">
      <div className="mb-4 font-serif text-[32px] leading-none text-[#FDE047]">"</div>
      <div className="mb-4 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="mb-6 text-[15px] leading-[1.6] text-[#111111] dark:text-white">{quote}</p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[#E2E8F0] dark:bg-[#2D3748]" />
        <div>
          <div className="text-sm font-bold text-[#111111] dark:text-white">{name}</div>
          <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{role}</div>
        </div>
      </div>
    </div>
  );
}
