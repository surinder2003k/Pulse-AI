"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InfiniteMarqueeProps {
  images: string[];
  className?: string;
  speed?: "slow" | "medium" | "fast";
}

export default function InfiniteMarquee({ images, className, speed = "medium" }: InfiniteMarqueeProps) {
  // Triple the images to ensure seamless loop
  const displayImages = [...images, ...images, ...images];

  return (
    <div className={cn("relative w-full overflow-hidden flex flex-nowrap py-10", className)}>
      <div className="flex animate-marquee group-hover:pause">
        {displayImages.map((src, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 px-3"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-xl h-[280px] md:h-[500px] w-auto">
              <img 
                src={src} 
                alt={`Marquee item ${idx}`} 
                className="h-full w-auto object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
