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
    audioRef.current.volume = 0.4;
    audioRef.current.preload = "auto";

    let hasInteracted = false;

    const unlockAudio = async () => {
      if (hasInteracted) return;
      if (!audioRef.current) return;

      try {
        console.log("Unlocking audio channel via user gesture...");
        // Fast play/pause to unlock the channel
        await audioRef.current.play();
        audioRef.current.pause();
        hasInteracted = true;
        
        // Remove listeners once unlocked
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
      } catch (err) {
        console.warn("Audio unlock failed (waiting for valid gesture):", err);
      }
    };

    window.addEventListener("click", unlockAudio, { once: false });
    window.addEventListener("touchstart", unlockAudio, { once: false });
    window.addEventListener("keydown", unlockAudio, { once: false });

    const startPlaying = async () => {
      if (audioRef.current && audioRef.current.paused) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          // If direct play fails, it usually means it's still locked
          console.warn("Play blocked (still locked?):", err);
        }
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
      }, 400); // Slightly faster response
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      
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
