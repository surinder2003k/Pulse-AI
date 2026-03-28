"use client";

import { useEffect, useRef } from "react";

export default function ViewsCounter({ slug }: { slug: string }) {
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const incrementViews = async () => {
      const storageKey = `viewed_${slug}`;
      if (localStorage.getItem(storageKey)) {
        return; // Already viewed in this browser
      }

      try {
        const res = await fetch(`/api/posts/views?slug=${slug}`, { method: "POST" });
        if (res.ok) {
          localStorage.setItem(storageKey, "true");
        }
      } catch (e) {
        console.error("Failed to increment views");
      }
    };

    incrementViews();
  }, [slug]);

  return null;
}
