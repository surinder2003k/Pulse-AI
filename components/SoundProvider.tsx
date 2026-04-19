"use client";

import React, { createContext, useContext, useRef } from "react";

interface SoundContextType {
  playSound: (src: string, volume?: number) => void;
  stopSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const playSound = (src: string, volume: number = 0.5) => {
    try {
      // Stop current sound before playing new one
      stopSound();

      const audio = new Audio(src);
      audio.volume = volume;
      audioRef.current = audio;
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Audio playback interrupted or blocked:", error);
        });
      }
    } catch (error) {
      console.error("Failed to play sound:", error);
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
