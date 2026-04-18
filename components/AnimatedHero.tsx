"use client";

import { useEffect, useRef } from "react";
// @ts-ignore
import anime from "animejs";
import Link from "next/link";
import { ArrowRight, Github, Zap, ShieldCheck, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1000
    });

    tl.add({
      targets: '.hero-pill',
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 800
    });

    tl.add({
      targets: '.hero-title-main',
      translateY: [40, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 1200
    }, "-=600");

    tl.add({
      targets: '.hero-subtitle',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800
    }, "-=800");

    tl.add({
      targets: '.hero-btn',
      scale: [0.9, 1],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 1000
    }, "-=400");
    
  }, []);

  return (
    <section ref={containerRef} className="pt-24 pb-24 md:pt-32 md:pb-40 flex flex-col items-center text-center gap-8 md:gap-14 px-6 md:px-8 relative overflow-hidden min-h-[90vh] justify-center bg-background">
      {/* Soft Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      {/* Flagship Protocol Badge */}
      <div className="hero-pill opacity-0 z-10 px-6 py-2 rounded-full bg-gray-50 border border-gray-200 flex items-center gap-4 group cursor-pointer hover:border-primary/40 transition-all duration-500 shadow-sm">
        <div className="relative flex items-center justify-center">
           <div className="h-2 w-2 rounded-full bg-primary animate-ping absolute" />
           <div className="h-2 w-2 rounded-full bg-primary relative" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">
          Pulse AI Protocol V2.0 <span className="text-primary">Live</span>
        </span>
        <div className="h-4 w-[1px] bg-gray-200" />
        <ArrowRight className="h-3 w-3 text-gray-400 group-hover:translate-x-1 transition-transform group-hover:text-primary" />
      </div>
      
      {/* Typography Architecture */}
      <div className="relative z-10 select-none space-y-4 md:space-y-6">
        <div className="overflow-hidden">
          <h1 className="hero-title-main opacity-0 text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight flex flex-col items-center">
            <span>Design</span>
            <span className="text-primary relative inline-block leading-tight">
              Intelligence
              <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-primary/20 rounded-full overflow-hidden">
                 <div className="h-full w-1/3 bg-primary animate-scan" />
              </div>
            </span>
          </h1>
        </div>
      </div>
      
      <p className="hero-subtitle opacity-0 text-gray-500 text-lg md:text-xl max-w-2xl leading-relaxed font-medium z-10">
        Fusing high-octane generative algorithms with elite editorial vision to capture the spirit of global innovation with tactical precision.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mt-6 z-10 w-full max-w-md sm:max-w-none px-4 sm:px-0">
        <Link href="/dashboard" className="w-full sm:w-auto">
          <button className="hero-btn opacity-0 w-full sm:w-auto group relative overflow-hidden rounded-[2rem] px-10 md:px-14 h-14 md:h-16 text-[11px] font-black uppercase tracking-[0.4em] text-white transition-all bg-primary hover:glow-red-strong shadow-premium hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-4">
            <span className="relative z-10 flex items-center gap-4">
              Initialize Dashboard <Zap className="h-4 w-4 fill-white" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
          </button>
        </Link>
        
        <Link href="/blog" className="w-full sm:w-auto">
          <button className="hero-btn opacity-0 w-full sm:w-auto group rounded-full px-10 md:px-14 h-14 md:h-16 text-xs font-bold uppercase tracking-widest text-gray-700 transition-all bg-white border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-4 hover:border-primary/30">
            Browse Archive <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-primary" />
          </button>
        </Link>
      </div>

      {/* Tactical Trust Architecture */}
      <div className="hero-subtitle opacity-0 mt-12 md:mt-24 flex flex-col items-center gap-6 md:gap-8 relative z-10">
        <div className="flex items-center gap-4">
           <div className="h-[1px] w-12 bg-gray-200" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Core Stack Verified</span>
           <div className="h-[1px] w-12 bg-gray-200" />
        </div>
        <div className="flex items-center justify-center flex-wrap gap-8 md:gap-12 text-gray-400 uppercase tracking-widest text-xs font-semibold">
          {[
            { icon: ShieldCheck, label: "Clerk Auth" },
            { icon: Database, label: "MongoDB" },
            { icon: Zap, label: "Groq LPU" },
            { icon: Zap, label: "Next.js 15" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 hover:text-primary transition-all duration-300 cursor-default group">
               <item.icon className="h-4 w-4 group-hover:scale-110 group-hover:text-primary transition-transform" /> 
               <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
