"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 20 }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-8 right-8 z-50",
            "group flex items-center justify-center",
            "h-14 w-14 rounded-2xl bg-white border border-gray-200 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-primary/30 active:scale-95"
          )}
          aria-label="Scroll to top"
        >
          {/* Subtle Outer Glow */}
          <div className="absolute inset-0 rounded-2xl bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
          
          <div className="relative flex flex-col items-center gap-1">
            <ChevronUp className="h-6 w-6 text-gray-900 transition-transform duration-300 group-hover:-translate-y-1" />
            <span className="text-[8px] font-black uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">TOP</span>
          </div>

          {/* Border Animation */}
          <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/20 transition-all duration-500" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
