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
    audioRef.current = new Audio(audioSrc);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    const startPlaying = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch((err) => {
          console.warn("Audio playback blocked by browser policy. Interaction required.", err);
        });
        setIsPlaying(true);
      }
    };

    const stopPlaying = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    const handleScroll = () => {
      // Start playing on scroll
      startPlaying();

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set timeout to stop playing after scroll stops
      scrollTimeoutRef.current = setTimeout(() => {
        stopPlaying();
      }, 500); // 500ms delay to detect scroll stop
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
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
