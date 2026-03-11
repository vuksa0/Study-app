import { cn } from "@/lib/utils";

interface QuantumPulseLoaderProps {
  label?: string;
  sublabel?: string;
  className?: string;
}

const LETTERS = ["G", "e", "n", "e", "r", "a", "t", "i", "n", "g"];

export const QuantumPulseLoader = ({ label, sublabel, className }: QuantumPulseLoaderProps) => {
  return (
    <div className={cn("generating-loader-wrapper", className)}>
      <div className="generating-loader-text">
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            className="generating-loader-letter"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {letter}
          </span>
        ))}
        {label && (
          <span className="generating-loader-label">{label}</span>
        )}
      </div>
      <div className="generating-loader-bar-track">
        <div className="generating-loader-bar" />
      </div>
      {sublabel && (
        <p className="generating-loader-sublabel">{sublabel}</p>
      )}
    </div>
  );
};
