"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export default function SplashLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if splash has already been shown in this session
    const hasShown = sessionStorage.getItem("pulse-splash-shown");
    if (!hasShown) {
      setShow(true);
      // Set the flag
      sessionStorage.setItem("pulse-splash-shown", "true");
      
      // Auto-hide after animation
      const timer = setTimeout(() => {
        setShow(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.1, 1], 
                opacity: 1,
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <div className="relative bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-2xl">
                <Zap className="w-16 h-16 text-primary fill-primary" />
              </div>
            </motion.div>

            <div className="flex flex-col items-center">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-4xl font-black italic tracking-tighter text-gray-900"
              >
                PULSE <span className="text-primary">AI</span>
              </motion.h2>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 1 }}
                className="h-[2px] bg-primary/20 mt-2 rounded-full overflow-hidden"
              >
                <div className="h-full bg-primary animate-shimmer w-full" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 mt-4 ml-2"
              >
                Initializing Protocol
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
