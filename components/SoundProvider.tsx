"use client";

import React, { createContext, useContext, useRef, useEffect } from "react";

interface SoundContextType {
  playSound: (src: string, volume?: number) => void;
  stopSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isUnlockedRef = useRef(false);

  useEffect(() => {
    // Single reusable audio element
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = "auto";
      audioRef.current = audio;
    }

    // Interaction handler to unlock audio for mobile
    const unlock = () => {
      if (audioRef.current && !isUnlockedRef.current) {
        // Play a silent buffer to unlock the audio context
        audioRef.current.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            isUnlockedRef.current = true;
            window.removeEventListener("touchstart", unlock);
            window.removeEventListener("click", unlock);
          }).catch(() => {});
        }
      }
    };

    window.addEventListener("touchstart", unlock);
    window.addEventListener("click", unlock);

    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
    };
  }, []);

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const playSound = (src: string, volume: number = 0.5) => {
    if (!audioRef.current) return;
    
    try {
      stopSound();
      audioRef.current.src = src;
      audioRef.current.volume = volume;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Audio sync failed or engine locked:", error);
        });
      }
    } catch (error) {
      console.error("Critical Audio System Failure:", error);
    }
  };

  return (
    <SoundContext.Provider value={{ playSound, stopSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
