"use client";

import { useEffect, useState } from "react";

export default function SiteLoadSound() {
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    if (played) return;

    const playStartupSound = () => {
      const audio = new Audio("/sounds/anime-ahh.mp3");
      audio.volume = 0.4; // Slightly lower for startup
      audio.play()
        .then(() => setPlayed(true))
        .catch(e => {
          // Browser usually blocks autoplay without interaction
          // We can try again on first click if it fails
          console.warn("Autoplay blocked, waiting for interaction.");
        });
    };

    // Attempt immediately
    playStartupSound();

    // Fallback: Play on first interaction if blocked
    const handleInteraction = () => {
      if (!played) {
        playStartupSound();
        window.removeEventListener("mousedown", handleInteraction);
        window.removeEventListener("keydown", handleInteraction);
        window.removeEventListener("touchstart", handleInteraction);
      }
    };

    window.addEventListener("mousedown", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("mousedown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [played]);

  return null;
}
