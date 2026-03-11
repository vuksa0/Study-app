"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-[#895af6]/[0.12]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "border border-[#895af6]/20 dark:border-white/[0.1]",
            "shadow-[0_8px_32px_0_rgba(137,90,246,0.06)]",
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <ElegantShape
        delay={0.3}
        width={600}
        height={140}
        rotate={12}
        gradient="from-[#895af6]/[0.1]"
        className="left-[-10%] md:left-[-5%] top-[8%]"
      />
      <ElegantShape
        delay={0.5}
        width={500}
        height={120}
        rotate={-15}
        gradient="from-[#06b6d4]/[0.1]"
        className="right-[-5%] top-[45%]"
      />
      <ElegantShape
        delay={0.4}
        width={300}
        height={80}
        rotate={-8}
        gradient="from-[#895af6]/[0.08]"
        className="left-[5%] bottom-[15%]"
      />
      <ElegantShape
        delay={0.6}
        width={220}
        height={60}
        rotate={20}
        gradient="from-[#06b6d4]/[0.08]"
        className="right-[18%] top-[12%]"
      />
      <ElegantShape
        delay={0.7}
        width={150}
        height={40}
        rotate={-25}
        gradient="from-[#895af6]/[0.07]"
        className="left-[22%] top-[5%]"
      />
    </div>
  );
}
