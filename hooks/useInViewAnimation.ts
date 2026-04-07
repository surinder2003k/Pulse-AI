"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A custom hook that uses IntersectionObserver to detect when an element enters the viewport.
 * Once the element is in view (threshold 0.1), the result flips to true and stays true.
 */
export function useInViewAnimation(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Once it's in view, we stop observing to keep the state true
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return { ref, isInView };
}
