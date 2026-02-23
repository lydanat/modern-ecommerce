"use client";

import { useState, useEffect } from "react";

export function useNavScroll(threshold = 20) {
  const [scrolled, setScrolled] = useState(false); // 🔥 ALWAYS same on server & first client render

  useEffect(() => {
    let frameId = null;

    const update = () => {
      if (frameId !== null) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = null;

        const nextScrolled = window.scrollY > threshold;

        setScrolled((prev) =>
          prev === nextScrolled ? prev : nextScrolled
        );
      });
    };

    // run once after mount to sync state
    update();

    window.addEventListener("scroll", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [threshold]);

  return { scrolled };
}