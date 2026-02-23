/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",      // px-4
        sm: "1.5rem",         // sm:px-6
        lg: "2rem",           // lg:px-8
      },
    },
        extend: {
      // ── Custom fonts ──────────────────────────────────────────────
      // Load via next/font or a <link> in layout.js
      fontFamily: {
        serif:  ["Cormorant Garamond", "Georgia", "serif"],
        sans:   ["Outfit", "system-ui", "sans-serif"],
      },

      // ── Custom keyframes ──────────────────────────────────────────
      keyframes: {
        // Slides up and fades in — used for headline lines, sub-copy, CTA
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Slides in from the left — used for eyebrow label
        "slide-right": {
          "0%":   { opacity: "0", transform: "translateX(-18px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Expands from left to right — used for the eyebrow divider line
        "line-expand": {
          "0%":   { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },

      // ── Custom animation utilities ────────────────────────────────
      // Each maps to: animation-name + duration + easing + fill-mode
      // Delay is applied inline via style={{ animationDelay }} on the element
      animation: {
        // Eyebrow row
        "hero-eyebrow":  "slide-right 0.65s cubic-bezier(.22,1,.36,1) both",
        "hero-divider":  "line-expand  0.70s cubic-bezier(.22,1,.36,1) both",
        // Headline lines
        "hero-line1":    "fade-up 0.85s cubic-bezier(.22,1,.36,1) both",
        "hero-line2":    "fade-up 0.85s cubic-bezier(.22,1,.36,1) both",
        // Supporting text + CTA
        "hero-sub":      "fade-up 0.75s cubic-bezier(.22,1,.36,1) both",
        "hero-cta":      "fade-up 0.75s cubic-bezier(.22,1,.36,1) both",
      },
    },
  },
  plugins: [],
}