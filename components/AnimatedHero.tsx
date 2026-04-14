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
    <section ref={containerRef} className="pt-24 pb-24 md:pt-32 md:pb-40 flex flex-col items-center text-center gap-8 md:gap-14 px-6 md:px-8 relative overflow-hidden min-h-[95vh] justify-center">
      {/* Cinematic Background Architecture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(229,9,20,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-[0.15] pointer-events-none" />
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] -z-10 opacity-40 animate-pulse-slow" />

      {/* Flagship Protocol Badge */}
      <div className="hero-pill opacity-0 z-10 px-6 py-2 rounded-full bg-black/40 border border-white/5 flex items-center gap-4 backdrop-blur-3xl group cursor-pointer hover:border-primary/40 transition-all duration-700 shadow-premium">
        <div className="relative flex items-center justify-center">
           <div className="h-2 w-2 rounded-full bg-primary animate-ping absolute" />
           <div className="h-2 w-2 rounded-full bg-primary shadow-glow-red relative" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 group-hover:text-white transition-colors">
          Terminal Protocol V2.0 <span className="text-primary italic">Live</span>
        </span>
        <div className="h-4 w-[1px] bg-white/10" />
        <ArrowRight className="h-3 w-3 text-white/20 group-hover:translate-x-1 transition-transform group-hover:text-primary" />
      </div>
      
      {/* Typeform Architecture */}
      <div className="relative z-10 select-none space-y-4 md:space-y-6">
        <div className="overflow-hidden">
          <h1 className="hero-title-main opacity-0 text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase italic leading-[0.85] flex flex-col items-center">
            <span>Design</span>
            <span className="text-primary italic text-glow-red relative">
              Intelligence
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 rounded-full overflow-hidden">
                 <div className="h-full w-1/3 bg-primary animate-scan shadow-glow-red" />
              </div>
            </span>
          </h1>
        </div>
      </div>
      
      <p className="hero-subtitle opacity-0 text-white/40 text-lg md:text-2xl max-w-4xl leading-relaxed font-medium z-10 uppercase tracking-tight italic">
        Fusing high-octane generative algorithms with elite editorial vision <br className="hidden md:block" />
        to capture the spirit of global innovation with tactical precision.
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
          <button className="hero-btn opacity-0 w-full sm:w-auto group rounded-[2rem] px-10 md:px-14 h-14 md:h-16 text-[11px] font-black uppercase tracking-[0.4em] text-white transition-all bg-white/5 border border-white/10 hover:bg-white/10 shadow-premium hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-4 backdrop-blur-3xl hover:border-primary/30">
            Browse Archive <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-primary" />
          </button>
        </Link>
      </div>

      {/* Tactical Trust Architecture */}
      <div className="hero-subtitle opacity-0 mt-12 md:mt-24 flex flex-col items-center gap-6 md:gap-10 relative z-10">
        <div className="flex items-center gap-4">
           <div className="h-[1px] w-12 bg-white/10" />
           <span className="text-[10px] font-black uppercase tracking-[0.7em] text-white/10 italic">Core Stack Verified</span>
           <div className="h-[1px] w-12 bg-white/10" />
        </div>
        <div className="flex items-center justify-center flex-wrap gap-8 md:gap-16 text-white/10 uppercase tracking-[0.4em] text-[10px] font-black">
          {[
            { icon: ShieldCheck, label: "Clerk Auth" },
            { icon: Database, label: "MongoDB" },
            { icon: Zap, label: "Groq LPU" },
            { icon: Zap, label: "Next.js 15" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 hover:text-primary transition-all duration-500 cursor-default group">
               <item.icon className="h-4 w-4 group-hover:scale-110 group-hover:text-primary" /> 
               <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
