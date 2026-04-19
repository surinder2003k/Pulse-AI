"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollAudioProps {
  audioSrc: string;
}

export default function ScrollAudio({ audioSrc }: ScrollAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize audio
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0.3; // More subtle
    audio.preload = "auto";
    audioRef.current = audio;

    let isUnlocked = false;

    const unlock = async () => {
      if (isUnlocked || !audioRef.current) return;
      try {
        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isUnlocked = true;
        window.removeEventListener("click", unlock);
        window.removeEventListener("touchstart", unlock);
        window.removeEventListener("scroll", unlock);
      } catch (e) {
        console.warn("Audio unlock failed:", e);
      }
    };

    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);
    window.addEventListener("scroll", unlock);

    const handleScroll = () => {
      if (!audioRef.current) return;

      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }, 150); // Faster stop for better responsiveness
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("scroll", unlock);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioSrc]);

  return null; // This is a logic-only component
}
