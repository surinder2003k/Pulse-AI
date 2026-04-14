"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal, Zap, Cpu, Rocket, ChevronRight, Globe, Shield, Code2, ArrowRight } from 'lucide-react';

const StitchSkillsLanding = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* 1. Futuristic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Back to Home Link (Tactical) */}
      <Link href="/" className="fixed bottom-10 left-10 z-[60] glass px-6 py-3 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all flex items-center gap-3 group">
         <div className="w-1 h-1 rounded-full bg-primary group-hover:animate-ping" /> Return to Network
      </Link>

      {/* 2. Navigation */}
      <nav className="fixed top-0 w-full z-50 py-6 px-8 backdrop-blur-md border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 border-2 border-cyan-400 rotate-45 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all">
              <Code2 className="h-4 w-4 -rotate-45 text-cyan-400" />
            </div>
            <span className="font-black tracking-[0.3em] uppercase text-sm">Stitch<span className="text-cyan-400 italic">Skills</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
             {['Protocol', 'Intelligence', 'Archive'].map(link => (
               <a key={link} href="#" className="text-[10px] uppercase font-black tracking-widest text-white/40 hover:text-cyan-400 transition-colors uppercase italic">{link}</a>
             ))}
             <button className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
               Deploy Skill
             </button>
          </div>
        </div>
      </nav>

      {/* 3. Hero Section - The WOW Factor */}
      <section className="relative pt-40 pb-20 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Subtle Label */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 bg-white/[0.03] border border-white/10 px-6 py-2 rounded-full backdrop-blur-xl shadow-premium"
          >
             <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">System Ready: Protocol v4.0.2</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20"
          >
            STITCH <br /> <span className="text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">SKILLS</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl text-lg md:text-xl text-white/40 font-medium uppercase tracking-tight leading-relaxed"
          >
            The world's first cinematic terminal orchestrator. Stitch together deep AI behaviors, Pythonic logic, and autonomous execution threads into a single, high-performance interface. 
          </motion.p>

          {/* 4. The Terminal Window Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl aspect-video relative group"
          >
             <div className="absolute inset-0 bg-cyan-500/5 rounded-[2rem] blur-[80px] group-hover:bg-cyan-500/10 transition-colors" />
             <div className="relative h-full w-full glass rounded-[2rem] border border-white/10 overflow-hidden shadow-soft">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.05] bg-black/40">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                   </div>
                   <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">Stitch-Core // Skill-Orchestration-Mode</div>
                </div>
                {/* Terminal Content */}
                <div className="p-8 md:p-12 font-mono text-xs md:text-sm leading-relaxed text-cyan-400/80">
                   <div className="flex gap-4">
                      <span className="text-white/20 shrink-0">01</span>
                      <p><span className="text-purple-400">import</span> stitch_core <span className="text-purple-400">as</span> st</p>
                   </div>
                   <div className="flex gap-4">
                      <span className="text-white/20 shrink-0">02</span>
                      <p><span className="text-white/40"># Initializing Neural Threading...</span></p>
                   </div>
                   <div className="flex gap-4">
                      <span className="text-white/20 shrink-0">03</span>
                      <p>skill = st.<span className="text-yellow-400">create_skill</span>(name=<span className="text-green-400">"AutonomousLinker"</span>)</p>
                   </div>
                   <div className="flex gap-4 mt-4 animate-pulse">
                      <span className="text-white/20 shrink-0 opacity-0">&gt;</span>
                      <p className="bg-white/10 px-2 py-0.5 rounded">Stitching logic to agentic fabric... [SUCCESS]</p>
                   </div>
                   {/* Dynamic Glowing Cursor */}
                   <motion.div 
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-cyan-400 mt-4 ml-8" 
                   />
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Feature Bento Grid */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
            {/* Main Card */}
            <div className="md:col-span-12 overflow-hidden relative group rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-12 shadow-premium">
               <div className="relative z-10 max-w-xl space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20 group-hover:border-cyan-400 transition-colors">
                     <Zap className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">AGENTIC <span className="text-cyan-400">PULSE.</span></h3>
                  <p className="text-white/40 text-lg uppercase tracking-tight font-medium leading-relaxed">
                     Orchestrate complex tasks with sub-millisecond precision. Our skills are built on top of a reinforced neural backend.
                  </p>
                  <button className="flex items-center gap-3 text-cyan-400 font-black uppercase tracking-widest text-[10px] group-hover:translate-x-3 transition-transform">
                     Learn the Protocol <ArrowRight className="h-3 w-3" />
                  </button>
               </div>
               {/* Abstract Visual */}
               <div className="absolute top-0 right-0 h-full w-1/2 overflow-hidden opacity-30 group-hover:opacity-50 transition-opacity">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-cyan-400/20 rounded-full animate-spin-slow" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-cyan-400/40 rounded-full animate-spin-slow-reverse" />
               </div>
            </div>

            {/* Smaller Chips */}
            {[
               { title: "Pythonic Logic", icon: <Terminal className="h-5 w-5" />, desc: "Native support for all major Python libs." },
               { title: "Secure Fabric", icon: <Shield className="h-5 w-5" />, desc: "End-to-end encryption for every skill call." },
               { title: "Global Mesh", icon: <Globe className="h-5 w-5" />, desc: "Deploy your skills across 40+ global regions." },
            ].map((feature, i) => (
               <div key={i} className="md:col-span-4 rounded-[2rem] border border-white/5 bg-black/40 p-8 hover:bg-white/[0.03] transition-all group shadow-premium hover:shadow-glow-red">
                  <div className="text-cyan-400 mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h4 className="text-xl font-black uppercase italic tracking-tighter mb-4">{feature.title}</h4>
                  <p className="text-white/30 text-sm font-medium uppercase tracking-tight">{feature.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-20 border-t border-white/[0.05] text-center">
         <div className="max-w-7xl mx-auto px-8 space-y-10">
            <span className="text-[10px] font-black uppercase tracking-[1em] text-white/10">STITCH SKILLS // EXPERIMENTAL BRANCH</span>
            <div className="flex justify-center gap-8">
               {['Documentation', 'Security', 'Connect'].map(link => (
                  <a key={link} href="#" className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors italic">{link}</a>
               ))}
            </div>
         </div>
      </footer>

      {/* Custom Styles for animations */}
      <style jsx global>{`
         @keyframes spin-slow {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
         }
         @keyframes spin-slow-reverse {
            from { transform: translate(-50%, -50%) rotate(360deg); }
            to { transform: translate(-50%, -50%) rotate(0deg); }
         }
         .animate-spin-slow {
            animation: spin-slow 15s linear infinite;
         }
         .animate-spin-slow-reverse {
            animation: spin-slow-reverse 10s linear infinite;
         }
         .shadow-premium {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
         }
         .shadow-soft {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
         }
         .shadow-glow-red {
            box-shadow: 0 0 25px rgba(34, 211, 238, 0.15);
         }
         .glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(40px);
            border: 1px solid rgba(255, 255, 255, 0.1);
         }
      `}</style>
    </div>
  );
};

export default StitchSkillsLanding;
