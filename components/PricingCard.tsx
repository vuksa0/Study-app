import { Check } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

interface PricingCardProps {
  title: string;
  price: number | string;
  priceLabel?: string;
  features: string[];
  popular?: boolean;
  disabled?: boolean;
  ctaText: string;
  onCta?: () => void;
}

export function PricingCard({ title, price, priceLabel = "/mo", features, popular, disabled, ctaText }: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-8 transition-all ${disabled ? "opacity-60" : ""} ${
        popular ? "border-2 border-[#111111]" : "border border-[#E2E8F0]"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-[#111111] px-3 py-1 text-[10px] font-bold tracking-wider text-white">
            POPULAR
          </div>
        </div>
      )}

      <div className="mb-2 text-lg font-bold text-[#111111]">{title}</div>
      <div className="mb-6 text-4xl font-black text-[#111111]">
        {typeof price === "number" ? `$${price}` : price}
        <span className="text-base font-normal text-[#64748B]">{priceLabel}</span>
      </div>

      <ul className="mb-8 space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#22C55E]" />
            <span className="text-sm text-[#111111]">{feature}</span>
          </li>
        ))}
      </ul>

      <InteractiveHoverButton
        text={ctaText}
        variant={popular ? "dark" : "light"}
        disabled={disabled}
        className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
