"use client";

import { useEffect } from "react";

export default function AuthErrorRelay() {
  useEffect(() => {
    const playErrorSound = () => {
      const audio = new Audio("/sounds/are-baap-re-yaad-aya.mp3");
      audio.volume = 0.5;
      audio.play().catch(e => console.warn("Audio play failed:", e));
    };

    // MutationObserver to detect Clerk error messages
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const errorElements = document.querySelectorAll('.cl-formFieldErrorText, .cl-alertText, [data-clerk-error-message]');
          if (errorElements.length > 0) {
            // Check if any error is "new" or just appeared
            const hasVisibleError = Array.from(errorElements).some(el => el.textContent && el.textContent.trim().length > 0);
            if (hasVisibleError) {
              playErrorSound();
              // Throttle to avoid multiple plays
              observer.disconnect();
              setTimeout(() => observer.observe(document.body, { childList: true, subtree: true }), 2000);
            }
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
