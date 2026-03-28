"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only show for some time to give a premium feel
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030303] overflow-hidden"
        >
          <div className="relative flex flex-col items-center gap-8">
            {/* Background blur/glow effect */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-150 animate-pulse" />
            
            {/* Logo with pulsing animation */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: [0.9, 1.05, 1],
                opacity: 1 
              }}
              transition={{ 
                duration: 0.8,
                times: [0, 0.5, 1],
                ease: "easeOut"
              }}
              className="relative"
            >
              <Image 
                src="/logo.svg" 
                alt="Pulse AI Logo" 
                width={200}
                height={60}
                className="h-16 w-auto"
                priority
              />
              
              {/* Bottom progress bar or pulse line */}
              <motion.div 
                className="h-0.5 bg-primary mt-6 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
