"use client";

import { useEffect, useState, useRef } from "react";

export default function SiteLoadSound() {
  const [played, setPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Check if sound already played in this session
    if (typeof window !== "undefined" && sessionStorage.getItem("site_startup_played")) {
      setPlayed(true);
      return;
    }

    const playStartupSound = () => {
      if (!audioRef.current) return;
      
      audioRef.current.volume = 0.4;
      audioRef.current.play()
        .then(() => {
          setPlayed(true);
          sessionStorage.setItem("site_startup_played", "true");
          cleanup();
        })
        .catch(e => {
          console.warn("Autoplay blocked, waiting for interaction.");
        });
    };

    const cleanup = () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("mousedown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };

    const handleInteraction = () => {
      if (!played) {
        playStartupSound();
      }
    };

    // Attempt immediately after a small delay to ensure ref is bound
    const timer = setTimeout(playStartupSound, 500);

    // Interaction listeners
    window.addEventListener("click", handleInteraction);
    window.addEventListener("mousedown", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
    window.addEventListener("scroll", handleInteraction, { passive: true });

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [played]);

  return (
    <audio ref={audioRef} preload="auto">
      <source src="/sounds/anime-ahh.mp3" type="audio/mpeg" />
    </audio>
  );
}
