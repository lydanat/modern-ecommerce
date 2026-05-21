"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination } from "swiper/modules";
import { ArrowDown, ArrowRight } from "lucide-react";
import { SLIDES } from "@/constants/slides"


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
              className={
                s.id === 3
                  ? "object-contain bg-black"
                  : "object-cover object-center lg:object-[center_30%]"
              }
              sizes="100vw"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(to_top,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.22)_45%,rgba(0,0,0,0.38)_100%),linear-gradient(to_right,rgba(0,0,0,0.45)_0%,transparent_50%)]"
      />

      <div className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-20 sm:pb-24">
          <div className="flex items-end justify-between gap-8">
            <div key={animKey} className="flex-1 max-w-2xl">

              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-5 animate-hero-eyebrow">

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
                className="flex flex-col md:flex-row md:items-center item-start justify-start md:justify-start gap-2 md:gap-3 pointer-events-auto animate-hero-cta text-center md:text-left"
                style={{ animationDelay: "0.65s" }}
              >
                {/* CTA */}
                <Link
                  href="/product"
                  className="group flex justify-center items-center gap-2 bg-white rounded-full px-7 py-3 transition-all duration-300 hover:bg-white/90 active:scale-[0.97] w-max"
                >
                  <span className="font-sans text-black font-medium text-xs tracking-widest uppercase text-center">
                    View All Products
                  </span>
                  <ArrowRight className="w-4 h-4 text-black"/>
                </Link>

                {/* CTA Explore */}
                <button
                  onClick={() =>
                    document.getElementById("product")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hidden md:flex justify-center items-center gap-1.5 font-sans text-white/70 text-xs tracking-widest uppercase hover:text-white transition-colors duration-200 w-max"
                >
                  Explore
                  <ArrowDown className="w-3 h-3 text-white/70"/>
                </button>
              </div>
            </div>

            {/* Slide counter */}
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

      {/* Pagination */}
      <div className="hero-pagination absolute bottom-8 left-0 right-0 z-30" />


    </section>
  );
}