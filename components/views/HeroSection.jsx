"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination } from "swiper/modules";

const SLIDES = [
  {
    id: 1,
    image:   "/assets/hero1.jpg",
    eyebrow: "New Arrival — 2025",
    line1:   "Wear the",
    line2:   "Silence",
    sub:     "Minimalist forms. Maximum presence.",
  },
  {
    id: 2,
    image:   "/assets/hero2.jpg",
    eyebrow: "Core Essentials",
    line1:   "Effortless",
    line2:   "Every Day",
    sub:     "Crafted for the way you actually live.",
  },
  {
    id: 3,
    image:   "/assets/hero3.jpg",
    eyebrow: "Limited Drop",
    line1:   "Bold Moves",
    line2:   "Only",
    sub:     "Statement pieces for the ones who lead.",
  },
];

export default function HeroSlider() {
  
  const swiperRef = useRef(null);
  const [animKey,     setAnimKey]     = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = useCallback((swiper) => {
    setActiveIndex(swiper.realIndex);
    setAnimKey((k) => k + 1);
  }, []);

  const slide = SLIDES[activeIndex] ?? SLIDES[0];

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: "580px" }}>

      <Swiper
        ref={swiperRef}
        modules={[EffectFade, Autoplay, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        loop
        speed={1200}
        pagination={{ el: ".hero-pagination", clickable: true }}
        onSlideChange={handleSlideChange}
        className="hero-swiper absolute inset-0 w-full h-full"
      >
        {SLIDES.map((s) => (
          <SwiperSlide key={s.id} className="relative w-full h-full">
            <Image
              src={s.image}
              alt={`${s.line1} ${s.line2}`}
              fill
              priority={s.id === 1}
              quality={90}
              className="object-cover object-center"
              sizes="100vw"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(to_top,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.22)_45%,rgba(0,0,0,0.38)_100%),linear-gradient(to_right,rgba(0,0,0,0.45)_0%,transparent_60%)]"
      />

      <div className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-20 sm:pb-24">
          <div className="flex items-end justify-between gap-8">
            <div key={animKey} className="flex-1 max-w-2xl">

              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-5 animate-hero-eyebrow">
                {/* Divider line — expands left-to-right, delayed slightly */}
                <span
                  className="inline-block h-px w-8 bg-white/60 origin-left animate-hero-divider"
                  style={{ animationDelay: "0.05s" }}
                />
                <span className="font-sans text-white/70 text-xs tracking-[0.22em] uppercase">
                  {slide.eyebrow}
                </span>
              </div>

              {/* Headline line 1 — fades up */}
              <h1 className="font-serif text-white leading-none mb-6 pointer-events-auto">
                <span
                  className="block font-light text-[clamp(3.2rem,9vw,7rem)] tracking-tight animate-hero-line1"
                  style={{ animationDelay: "0.2s" }}
                >
                  {slide.line1}
                </span>

                {/* Headline line 2 — italic bold, slightly later */}
                <span
                  className="block font-semibold italic text-[clamp(3.2rem,9vw,7rem)] tracking-tight animate-hero-line2"
                  style={{ animationDelay: "0.35s" }}
                >
                  {slide.line2}
                </span>
              </h1>

              {/* Sub-copy */}
              <p
                className="font-sans font-light text-white/65 text-base tracking-wide mb-9 pointer-events-auto animate-hero-sub"
                style={{ animationDelay: "0.52s" }}
              >
                {slide.sub}
              </p>

              {/* CTA row */}
              <div
                className="flex items-center gap-5 pointer-events-auto animate-hero-cta"
                style={{ animationDelay: "0.65s" }}
              >

                {/* Primary — solid white pill */}
                <Link
                  href="/product"
                  className="group inline-flex items-center gap-2.5 bg-white rounded-full px-7 py-3.5 transition-all duration-300 hover:bg-white/90 active:scale-[0.97]"
                >
                  <span className="font-sans text-black font-medium text-xs tracking-widest uppercase">
                    View All Products
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14" height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>

                {/* Secondary — ghost text link */}
                <button
                  onClick={() =>
                    document.getElementById("product")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 font-sans text-white/70 text-xs tracking-widest uppercase hover:text-white transition-colors duration-200"
                >
                  Explore
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13" height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </button>

              </div>
            </div>

            {/* ── RIGHT: Slide counter — desktop only ── */}
            <div className="hidden lg:flex flex-col items-end gap-1 pb-1 pointer-events-auto">
              <span className="font-sans font-light text-white text-[2.8rem] leading-none tabular-nums tracking-tight">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <div className="w-8 h-px bg-white/30 my-1" />
              <span className="font-sans font-light text-white/40 text-[0.8rem] tracking-[0.08em]">
                {String(SLIDES.length).padStart(2, "0")}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ── Pagination dots (styled in globals.css — Swiper classes only) ── */}
      <div className="hero-pagination absolute bottom-8 left-0 right-0 z-30" />

      {/* ── Scroll indicator — hidden on mobile ── */}
      <div className="absolute bottom-10 right-6 sm:right-10 lg:right-16 z-30 hidden sm:flex flex-col items-center gap-2">
        <span
          className="font-sans text-white/40 text-[0.65rem] tracking-[0.18em] uppercase"
          style={{ writingMode: "vertical-rl" }}
          // writingMode is not a Tailwind utility — no equivalent class exists
        >
          Scroll
        </span>
        <div className="w-px h-10 bg-linear-to-b from-transparent to-white/30" />
      </div>

    </section>
  );
}