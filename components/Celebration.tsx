"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FLOWER_COUNT = 50;

export default function Celebration({ trigger }: { trigger: boolean }) {
  const [flowers, setFlowers] = useState<any[]>([]);

  useEffect(() => {
    if (trigger) {
      const newFlowers = Array.from({ length: FLOWER_COUNT }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        size: 10 + Math.random() * 20,
        rotation: Math.random() * 360,
        color: ["#FF3333", "#FF6666", "#FF9999", "#FFFFFF"][Math.floor(Math.random() * 4)],
      }));
      setFlowers(newFlowers);

      const audio = new Audio("/sounds/romanceeeeeeeeeeeeee.mp3");
      audio.volume = 0.5;
      audio.play().catch(e => console.warn("Audio play failed:", e));

      const timer = setTimeout(() => {
        setFlowers([]);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {flowers.map((flower) => (
          <motion.div
            key={flower.id}
            initial={{ y: -50, x: `${flower.x}%`, opacity: 0, rotate: 0 }}
            animate={{ 
              y: "110vh", 
              opacity: [0, 1, 1, 0],
              rotate: flower.rotation + 720,
              x: `${flower.x + (Math.random() * 10 - 5)}%`
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: flower.duration, 
              delay: flower.delay,
              ease: "linear"
            }}
            style={{
              position: "absolute",
              width: flower.size,
              height: flower.size,
              backgroundColor: flower.color,
              borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%", // Organic petal shape
              boxShadow: `0 0 10px ${flower.color}44`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
