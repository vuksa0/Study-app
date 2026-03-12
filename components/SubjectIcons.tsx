import { BookOpen } from "lucide-react";

function MathIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="4" x2="6" y2="10" />
      <line x1="3" y1="7" x2="9" y2="7" />
      <line x1="14" y1="4" x2="20" y2="10" />
      <line x1="20" y1="4" x2="14" y2="10" />
      <line x1="4" y1="16" x2="8" y2="16" />
      <circle cx="17" cy="15" r="1" />
      <circle cx="17" cy="19" r="1" />
    </svg>
  );
}

function PhysicsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
    </svg>
  );
}

function ChemistryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v6l-5 8a4 4 0 0 0 3 6h8a4 4 0 0 0 3-6l-5-8V2" />
      <line x1="8" y1="10" x2="16" y2="10" />
    </svg>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 10 12 4 21 10" />
      <line x1="4" y1="10" x2="4" y2="18" />
      <line x1="8" y1="10" x2="8" y2="18" />
      <line x1="12" y1="10" x2="12" y2="18" />
      <line x1="16" y1="10" x2="16" y2="18" />
      <line x1="20" y1="10" x2="20" y2="18" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

function BiologyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 13c8-10 16-8 16-8s2 8-8 16c-5 4-8-2-8-8z" />
      <line x1="12" y1="12" x2="20" y2="4" />
    </svg>
  );
}

function GeographyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2c3 4 3 16 0 20" />
      <path d="M12 2c-3 4-3 16 0 20" />
    </svg>
  );
}

function EnglishIcon({ className }: { className?: string }) {
  return <BookOpen className={className} />;
}

function ComputerScienceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="7" width="10" height="10" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
    </svg>
  );
}

export interface SubjectIconDef {
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const SUBJECT_ICON_MAP: Record<string, SubjectIconDef> = {
  mathematics:        { Icon: MathIcon,           color: "#3B82F6" },
  physics:            { Icon: PhysicsIcon,         color: "#8B5CF6" },
  chemistry:          { Icon: ChemistryIcon,       color: "#10B981" },
  history:            { Icon: HistoryIcon,         color: "#F59E0B" },
  biology:            { Icon: BiologyIcon,         color: "#059669" },
  geography:          { Icon: GeographyIcon,       color: "#06B6D4" },
  english:            { Icon: EnglishIcon,         color: "#6366F1" },
  "computer-science": { Icon: ComputerScienceIcon, color: "#F97316" },
};
