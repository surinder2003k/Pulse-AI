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
    <div className={cn("flex items-center gap-3 select-none group", className)}>
      <div className={cn("relative flex items-center justify-center", sizes[size])}>
        {/* Diamond Shape */}
        <motion.div
          animate={{
            rotate: [45, 45, 45],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "border-2 border-primary rotate-45 flex items-center justify-center bg-black transition-colors group-hover:bg-primary/10",
            size === "sm" ? "h-5 w-5 border" : 
            size === "md" ? "h-6 w-6" : 
            size === "lg" ? "h-10 w-10" : "h-16 w-16 border-[3px]"
          )}
        >
          {/* Inner Pulse Dot */}
          <div className="relative flex">
            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60")}></span>
            <span className={cn("relative inline-flex rounded-full bg-primary shadow-[0_0_15px_rgba(255,51,51,0.8)]", dotSizes[size])}></span>
          </div>
        </motion.div>

        {/* Outer Echo Rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.5, 2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 border border-primary/30 rounded-full"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn(
            "font-black tracking-tighter uppercase italic",
            size === "sm" ? "text-lg" : 
            size === "md" ? "text-2xl" : 
            size === "lg" ? "text-4xl" : "text-6xl"
          )}>
            Pulse<span className="text-primary">AI</span>
          </span>
          {size !== "sm" && (
            <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-muted-foreground mt-0.5 ml-0.5">
              Design Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
}
