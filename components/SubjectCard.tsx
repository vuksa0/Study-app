interface SubjectCardProps {
  name: string;
  subtopics: string;
  accentColor: string;
  dashed?: boolean;
}

export function SubjectCard({ name, subtopics, accentColor, dashed = false }: SubjectCardProps) {
  if (dashed) {
    return (
      <div className="flex h-20 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-[#E2E8F0] px-6 py-5 transition-all hover:border-[#CBD5E1] hover:shadow-sm">
        <span className="text-sm font-bold text-[#64748B]">{name}</span>
      </div>
    );
  }

  return (
    <div
      className="flex h-20 cursor-pointer flex-col justify-center rounded-xl border border-[#E2E8F0] px-6 py-5 transition-all hover:border-[#CBD5E1] hover:shadow-sm"
      style={{ borderLeftWidth: "4px", borderLeftColor: accentColor }}
    >
      <div className="text-[15px] font-bold text-[#111111]">{name}</div>
      <div className="text-xs text-[#94A3B8]">{subtopics}</div>
    </div>
  );
}
