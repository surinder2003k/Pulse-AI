"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, ArrowUp, Paperclip, Mic, Search, Zap } from "lucide-react";
import VButton from "./VButton";

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4";

export default function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);
  const fadingOutRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const fade = (target: number, duration: number) => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    
    const startOpacity = opacity;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newOpacity = startOpacity + (target - startOpacity) * progress;
      
      setOpacity(newOpacity);
      
      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const timeLeft = video.duration - video.currentTime;
      
      if (timeLeft <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fade(0, 250);
      }
    };

    const handleEnded = () => {
      setOpacity(0);
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play();
          fadingOutRef.current = false;
          fade(1, 250);
        }
      }, 100);
    };

    const handleLoaded = () => {
      fade(1, 250);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadeddata", handleLoaded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadeddata", handleLoaded);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center pt-20">
      {/* Video Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        style={{ width: '115%', height: '115%', left: '-7.5%', top: '-7.5%' }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover object-top"
          style={{ opacity }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center -mt-[50px]">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 bg-white rounded-full p-1 pl-1 pr-4 shadow-sm border border-black/5 mb-8"
        >
          <div className="bg-black rounded-full p-1.5 px-3 flex items-center gap-1.5">
            <Star className="w-3 h-3 text-white fill-white" />
            <span className="text-white text-[12px] font-bold uppercase tracking-wider">New</span>
          </div>
          <span className="text-black/60 text-[14px] font-medium font-inter">Discover what&apos;s possible</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-black text-6xl md:text-8xl font-bold tracking-[-4.8px] leading-[0.9] mb-8 max-w-4xl"
          style={{ fontFamily: "'Fustat', sans-serif" }}
        >
          Transform Data Quickly
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-black/60 text-lg md:text-xl font-medium tracking-tight max-w-[542px] leading-relaxed mb-12"
          style={{ fontFamily: "'Fustat', sans-serif" }}
        >
          Upload your information and get powerful insights right away. Work smarter and achieve goals effortlessly.
        </motion.p>

        {/* Search Box Component */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-[728px] h-[200px] bg-black/40 backdrop-blur-md rounded-[18px] p-4 flex flex-col gap-4 border border-white/10"
        >
          {/* Top Row: Credits */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-[12px] font-medium" style={{ fontFamily: 'Schibsted Grotesk' }}>
                60/450 credits
              </span>
              <button className="bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider hover:bg-gray-200 transition-colors">
                Upgrade
              </button>
            </div>
            <div className="flex items-center gap-2 opacity-60">
              <Zap className="w-3 h-3 text-white fill-white" />
              <span className="text-white text-[12px] font-medium" style={{ fontFamily: 'Schibsted Grotesk' }}>
                Powered by GPT-4o
              </span>
            </div>
          </div>

          {/* Main Input Area */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-2 flex items-center justify-between border border-black/5">
            <input 
              type="text" 
              placeholder="Type question..." 
              className="flex-1 bg-transparent border-none outline-none px-4 text-black text-lg placeholder:text-black/40"
            />
            <button className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform">
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Row: Actions */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              {[
                { icon: Paperclip, label: "Attach" },
                { icon: Mic, label: "Voice" },
                { icon: Search, label: "Prompts" }
              ].map((btn, i) => (
                <button 
                  key={i} 
                  className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-2 text-white text-[12px] font-medium transition-colors"
                >
                  <btn.icon className="w-3.5 h-3.5" />
                  {btn.label}
                </button>
              ))}
            </div>
            <span className="text-white/40 text-[12px] font-medium">0/3,000</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Pill Nav for Home Page Scroll Indicator? */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-black/40 animate-bounce">
        <span className="text-[10px] uppercase font-bold tracking-widest">Scroll to explore</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
}
