"use client";

import { ElegantShape } from "@/components/ui/shape-landing-hero";

export function ShapesBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      <ElegantShape
        delay={0.2}
        width={550}
        height={130}
        rotate={12}
        gradient="from-indigo-500/[0.07]"
        className="left-[-8%] top-[12%]"
      />
      <ElegantShape
        delay={0.4}
        width={420}
        height={100}
        rotate={-15}
        gradient="from-violet-500/[0.07]"
        className="right-[-4%] top-[55%]"
      />
      <ElegantShape
        delay={0.3}
        width={260}
        height={70}
        rotate={-8}
        gradient="from-rose-500/[0.06]"
        className="left-[4%] bottom-[8%]"
      />
      <ElegantShape
        delay={0.5}
        width={180}
        height={50}
        rotate={20}
        gradient="from-cyan-500/[0.06]"
        className="right-[18%] top-[8%]"
      />
      <ElegantShape
        delay={0.6}
        width={130}
        height={36}
        rotate={-22}
        gradient="from-amber-500/[0.06]"
        className="left-[22%] top-[4%]"
      />
    </div>
  );
}
