"use client";

import { useState, useEffect } from "react";

export function useNavScroll(threshold = 20) {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > threshold
  );

  useEffect(() => {
    let frameId = null;

    const handleScroll = () => {
      if (frameId !== null) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = null;

        const nextScrolled = window.scrollY > threshold;

        setScrolled((prevScrolled) =>
          prevScrolled === nextScrolled ? prevScrolled : nextScrolled
        );
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [threshold]);

  return { scrolled };
}