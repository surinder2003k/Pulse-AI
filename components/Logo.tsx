"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export default function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
    xl: "h-20",
  };

  const dotSizes = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-3 w-3",
    xl: "h-5 w-5",
  };

  return (
    <div className={cn("flex items-center gap-4 select-none group leading-none", className)}>
      <div className={cn("relative flex items-center justify-center", sizes[size])}>
        {/* Diamond Shape */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "border-2 border-primary rotate-45 flex items-center justify-center bg-white transition-all group-hover:shadow-glow-red",
            size === "sm" ? "h-5 w-5 border" : 
            size === "md" ? "h-7 w-7" : 
            size === "lg" ? "h-12 w-12 border-[3px]" : "h-20 w-20 border-[4px]"
          )}
        >
          {/* Inner Pulse Dot */}
          <div className="relative flex -rotate-45">
            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60")}></span>
            <span className={cn("relative inline-flex rounded-full bg-primary shadow-[0_0_20px_rgba(255,51,51,0.5)]", dotSizes[size])}></span>
          </div>
        </motion.div>

        {/* Outer Echo Rings */}
        <motion.div
          animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.8, 2.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 border border-primary/20 rounded-full pointer-events-none"
        />
      </div>

      {showText && (
        <div className="flex flex-col gap-0.5">
          <span className={cn(
            "font-black tracking-tighter uppercase italic text-gray-900 group-hover:text-primary transition-colors",
            size === "sm" ? "text-xl" : 
            size === "md" ? "text-3xl" : 
            size === "lg" ? "text-5xl" : "text-7xl"
          )}>
            Pulse<span className="text-primary italic">AI</span>
          </span>
          {size !== "sm" && (
            <span className={cn(
              "font-black uppercase tracking-[0.5em] text-gray-400 leading-none",
              size === "md" ? "text-[8px]" : size === "lg" ? "text-[12px]" : "text-[16px]"
            )}>
              Design Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
}
