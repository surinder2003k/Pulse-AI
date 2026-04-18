"use client";

import { useEffect, useState } from "react";

export default function SiteLoadSound() {
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    // Check if sound already played in this session to avoid annoyance
    if (typeof window !== "undefined" && sessionStorage.getItem("site_startup_played")) {
      setPlayed(true);
      return;
    }

    const playStartupSound = () => {
      const audio = new Audio("/sounds/anime-ahh.mp3");
      audio.volume = 0.4;
      audio.play()
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

    // Attempt immediately (might work if user has high engagement index)
    playStartupSound();

    // Interaction listeners
    window.addEventListener("click", handleInteraction);
    window.addEventListener("mousedown", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
    window.addEventListener("scroll", handleInteraction);

    return () => cleanup();
  }, [played]);

  return null;
}
