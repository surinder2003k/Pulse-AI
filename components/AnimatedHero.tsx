"use client";

import { useEffect, useRef } from "react";
// @ts-ignore
import anime from "animejs";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // 1. Initial State
    const tl = anime.timeline({
      easing: 'easeOutElastic(1, .8)',
      duration: 1200
    });

    // 2. Animate the pill
    tl.add({
      targets: '.hero-pill',
      translateY: [-30, 0],
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 800
    });

    // 3. Stagger the main title words
    tl.add({
      targets: '.hero-title-word',
      translateY: [40, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 1000
    }, "-=400");

    // 4. Fade in subtitle
    tl.add({
      targets: '.hero-subtitle',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutQuad'
    }, "-=600");

    // 5. Spring the deeply Skeuomorphic button
    tl.add({
      targets: '.hero-button',
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 1000
    }, "-=400");
    
  }, []);

  return (
    <section ref={containerRef} className="pt-24 pb-16 flex flex-col items-center text-center gap-8 px-6 relative">
      {/* Premium Embossed Pill */}
      <div className="hero-pill opacity-0 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/30 border border-white/10 shadow-skeuo-out text-primary backdrop-blur-md">
        <Sparkles className="h-4 w-4 text-purple-400" />
        <span className="text-xs font-black uppercase tracking-[0.2em] text-white/90">Premium AI Content</span>
      </div>
      
      {/* 3D Embossed Hero Title */}
      <h1 className="text-5xl md:text-[5.5rem] font-black tracking-tighter max-w-5xl leading-[1.05] drop-shadow-2xl flex flex-wrap justify-center gap-[1rem]">
        <span className="hero-title-word opacity-0">Experience</span>
        <span className="hero-title-word opacity-0">the</span>
        <span className="hero-title-word opacity-0">Power</span>
        <span className="hero-title-word opacity-0">of</span>
        <span className="hero-title-word opacity-0 purple-gradient bg-clip-text text-transparent italic filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">Skeuomorphic</span>
        <span className="hero-title-word opacity-0 purple-gradient bg-clip-text text-transparent italic filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">AI</span>
      </h1>
      
      <p className="hero-subtitle opacity-0 text-white/50 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
        A breathtaking blend of physical UI depth and artificial intelligence. 
        Read, write, and explore content generation in a visually stunning 3D environment.
      </p>
      
      <div className="hero-button opacity-0 flex flex-wrap items-center justify-center gap-6 mt-8">
        <Link href="/blog">
          {/* Extremely Skeuomorphic Button */}
          <button className="relative overflow-hidden group rounded-2xl px-12 h-16 text-lg font-black text-white/90 uppercase tracking-widest shadow-skeuo-out active:shadow-skeuo-button-pressed active:translate-y-1 transition-all duration-200 bg-secondary/40 border border-white/10 flex items-center gap-3">
            <span className="relative z-10 flex items-center gap-3">
              Explore Articles <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            {/* Glossy Overlay */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-2xl pointer-events-none" />
          </button>
        </Link>
      </div>
    </section>
  );
}
