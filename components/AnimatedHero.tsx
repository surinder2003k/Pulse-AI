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
    <section ref={containerRef} className="pt-24 pb-28 flex flex-col items-center text-center gap-8 md:gap-10 px-6 relative overflow-hidden min-h-[80vh] justify-center">
      {/* Grid Background Overlay */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 opacity-30 animate-pulse" />

      {/* Pill Badge */}
      <div className="hero-pill opacity-0 z-10 px-5 py-1.5 rounded-full bg-secondary/10 border border-white/5 flex items-center gap-3 backdrop-blur-md group cursor-pointer hover:bg-white/10 transition-all mb-2 shadow-skeuo-in">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(255,51,51,0.8)]" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/50 group-hover:text-white transition-colors">
          Terminal Protocol V2.0 Active
        </span>
        <ArrowRight className="h-2.5 w-2.5 text-white/30 group-hover:translate-x-1 transition-transform group-hover:text-primary" />
      </div>
      
      {/* Massive Solid Title */}
      <div className="relative z-10 select-none space-y-3">
        <h1 className="hero-title-main opacity-0 text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
          Design <span className="text-primary italic text-glow-red">Intelligence</span>
        </h1>
        <h2 className="hero-title-main opacity-0 text-2xl md:text-4xl lg:text-5xl font-black text-white/20 tracking-tighter uppercase italic leading-none">
          For the Future of Editorial
        </h2>
      </div>
      
      <p className="hero-subtitle opacity-0 text-white/40 text-base md:text-xl max-w-3xl leading-relaxed font-medium z-10 mt-2 uppercase tracking-tight">
        Pulse AI blends high-octane generative algorithms with elite editorial vision <br className="hidden md:block" />
        to capture the spirit of global innovation.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 z-10">
        <Link href="/dashboard">
          <button className="hero-btn opacity-0 group rounded-[1.5rem] px-8 md:px-10 h-14 md:h-16 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all bg-primary hover:glow-red-strong shadow-skeuo-float hover:scale-[1.03] active:scale-95 flex items-center gap-3">
            Initialize Dashboard <Zap className="h-4 w-4 fill-white" />
          </button>
        </Link>
        
        <Link href="/blog">
          <button className="hero-btn opacity-0 group rounded-[1.5rem] px-8 md:px-10 h-14 md:h-16 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all bg-secondary/10 border border-white/5 hover:bg-white/5 shadow-skeuo-button hover:scale-[1.03] active:scale-95 flex items-center gap-3 backdrop-blur-3xl">
            Browse Archive <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-primary" />
          </button>
        </Link>
      </div>

      {/* Trust Bar */}
      <div className="hero-subtitle opacity-0 mt-16 flex flex-col items-center gap-6 relative z-10">
        <div className="flex items-center gap-3">
           <div className="h-[1px] w-8 bg-white/10" />
           <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/20 italic">Verified Tech-Stack</span>
           <div className="h-[1px] w-8 bg-white/10" />
        </div>
        <div className="flex items-center justify-center flex-wrap gap-6 md:gap-12 text-white/10 uppercase tracking-[0.3em] text-[10px] font-black">
          <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
             <ShieldCheck className="h-3 w-3" /> <span>Clerk Auth</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
             <Database className="h-3 w-3" /> <span>MongoDB</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
             <Zap className="h-3 w-3" /> <span>Groq AI</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
             <Zap className="h-3 w-3" /> <span>Next.js 15</span>
          </div>
        </div>
      </div>
    </section>
  );
}
