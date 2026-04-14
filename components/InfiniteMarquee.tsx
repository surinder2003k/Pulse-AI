"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface InfiniteMarqueeProps {
  images: string[];
  className?: string;
  speed?: "slow" | "medium" | "fast";
}

export default function InfiniteMarquee({ images, className, speed = "medium" }: InfiniteMarqueeProps) {
  // Triple the images to ensure seamless loop
  const displayImages = [...images, ...images, ...images];

  return (
    <div className={cn("relative w-full overflow-hidden flex flex-nowrap py-16", className)}>
      {/* Background Cinematic Glows */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="flex animate-marquee group-hover:pause gap-6">
        {displayImages.map((src, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 px-4 group/item"
          >
            <div className="relative overflow-hidden rounded-[3rem] shadow-premium h-[300px] md:h-[550px] w-auto border border-white/5 bg-black/40 backdrop-blur-3xl transition-all duration-700 group-hover/item:border-primary/50 group-hover/item:scale-[1.02] group-hover/item:shadow-glow-red">
              <img 
                src={src} 
                alt={`Marquee item ${idx}`} 
                className="h-full w-auto object-cover transition-all duration-1000 group-hover/item:scale-110 group-hover/item:brightness-110" 
              />
              
              {/* Tactical Scanning Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/40 shadow-glow-red opacity-0 group-hover/item:opacity-100 group-hover/item:animate-scan pointer-events-none" />
              
              {/* Telemetry Labels */}
              <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between opacity-0 group-hover/item:opacity-100 transition-all duration-500 translate-y-4 group-hover/item:translate-y-0">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Identity Locked</span>
                   <span className="text-[9px] font-mono text-white/40 uppercase">Ref: 0{idx + 1}-SQR</span>
                 </div>
                 <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Zap className="h-3 w-3 text-primary" />
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
