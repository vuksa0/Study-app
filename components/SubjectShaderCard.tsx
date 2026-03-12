"use client";

import { Warp } from "@paper-design/shaders-react";

const SUBJECT_COLORS: Record<string, string[]> = {
  mathematics:        ["#1a1a3e", "#3B82F6", "#60a5fa", "#1a1a3e"],
  physics:            ["#1e1a3e", "#8B5CF6", "#a78bfa", "#1e1a3e"],
  chemistry:          ["#0d2b22", "#10B981", "#34d399", "#0d2b22"],
  history:            ["#2b200a", "#F59E0B", "#fbbf24", "#2b200a"],
  biology:            ["#0a2219", "#059669", "#10b981", "#0a2219"],
  geography:          ["#0a2230", "#06B6D4", "#22d3ee", "#0a2230"],
  english:            ["#1a1a3a", "#6366F1", "#818cf8", "#1a1a3a"],
  "computer-science": ["#2b1500", "#F97316", "#fb923c", "#2b1500"],
};

interface SubjectShaderCardProps {
  subjectId: string;
  className?: string;
}

export function SubjectShaderCard({ subjectId, className = "" }: SubjectShaderCardProps) {
  const colors = SUBJECT_COLORS[subjectId];
  if (!colors) return null;
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Warp
        colors={colors}
        speed={0.4}
        scale={1.2}
        distortion={0.6}
        swirl={0.4}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
