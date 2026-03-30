"use client";

import { useEffect, useRef } from "react";
// @ts-ignore
import anime from "animejs";
import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
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
      targets: '.echo-layer',
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

  const Headline = () => (
    <>
      Design Intelligence <br /> 
      for the <span className="text-primary relative inline-block">
        Future
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute -bottom-2 left-0 w-full h-1 bg-primary/40 origin-left"
        />
      </span>
    </>
  );

  return (
    <section ref={containerRef} className="pt-32 pb-20 flex flex-col items-center text-center gap-10 px-6 relative overflow-hidden min-h-[90vh] justify-center">
      {/* Grid Background Overlay */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      
      {/* Pill Badge */}
      <div className="hero-pill opacity-0 z-10 px-4 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 backdrop-blur-sm group cursor-pointer hover:bg-white/10 transition-all">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Pulse AI 2.0 is now live</span>
        <ArrowRight className="h-3 w-3 text-white/40 group-hover:translate-x-0.5 transition-transform" />
      </div>
      
      {/* Massive Solid Title */}
      <div className="relative z-10 select-none">
        {/* Main Foreground Title */}
        <h1 
          className="echo-layer echo-text opacity-0 relative text-white"
          style={{ fontSize: 'clamp(3rem, 11vw, 10rem)' }}
        >
          <Headline />
        </h1>
      </div>
      
      <p className="hero-subtitle opacity-0 text-white/50 text-lg md:text-xl max-w-3xl leading-relaxed font-medium z-10 font-inter">
        Pulse AI blends advanced generative algorithms with human creativity <br className="hidden md:block" />
        to ship world-class stories 10x faster.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-5 mt-4 z-10">
        <Link href="/dashboard/create">
          <button className="hero-btn opacity-0 group rounded-full px-10 h-14 text-sm font-bold text-white transition-all bg-primary hover:bg-primary/90 shadow-[0_0_40px_rgba(255,51,51,0.4)] hover:scale-105 active:scale-95 flex items-center gap-2">
            Start Creating <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
        
        <Link href="https://github.com" target="_blank">
          <button className="hero-btn opacity-0 group rounded-full px-10 h-14 text-sm font-bold text-white transition-all bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 active:scale-95 flex items-center gap-2 backdrop-blur-md">
            <Github className="h-4 w-4" /> View on GitHub
          </button>
        </Link>
      </div>

      {/* Integration Logos (Future) */}
      <div className="hero-subtitle opacity-0 mt-16 flex items-center gap-12 text-white/20 uppercase tracking-[0.3em] text-[10px] font-bold">
        <span>Integrated with:</span>
        <div className="flex items-center gap-8 grayscale opacity-50">
          <span className="hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">OpenAI</span>
          <span className="hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">Figma</span>
          <span className="hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">React</span>
          <span className="hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">Vercel</span>
          <span className="hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">Stripe</span>
        </div>
      </div>
    </section>
  );
}
