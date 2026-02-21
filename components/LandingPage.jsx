import Navbar from "@/components/layout/navbar";

/**
 * LandingPage
 *
 * The root component for the customer-facing landing page.
 * It assembles all sections in order and is the single place
 * where you add / remove / reorder page sections.
 *
 * Current sections (stubs — replace with real components as you build each branch):
 *   1. <Navbar />   — sticky header, always rendered first so it layers above everything
 *   2. #hero        — full-viewport hero slider (Swiper.js, to be built)
 *   3. #product     — product catalogue grid (to be built)
 *   4. #contact     — contact / Telegram card (to be built)
 *
 * Why keep this file?
 *   page.js in Next.js App Router is a Server Component by default.
 *   If any section needs client-side interactivity (useState, useEffect, browser APIs),
 *   the easiest pattern is to keep page.js as a thin Server Component and delegate
 *   all interactive work to this Client-capable wrapper.
 *
 *   Currently Navbar is the only client component, but Hero (Swiper.js) and
 *   filtering will also need "use client" — so LandingPage is ready for that.
 */
export default function LandingPage() {
  return (
    <main>

      {/* ── Sticky Navbar ── */}
      <Navbar />

      {/* ── 1. Hero Section ──────────────────────────────────────────── */}
      {/*
       * id="hero" is not strictly needed for scroll-nav (we scroll to top for Home)
       * but is useful for direct deep-linking or debugging.
       * min-h-screen ensures the hero fills the viewport so the transparent
       * navbar effect is visible on load.
       */}
      <section id="hero" className="min-h-screen bg-neutral-900 flex items-center justify-center">
        {/* TODO: Replace with <HeroSlider /> in the hero branch */}
        <p className="text-white text-2xl font-semibold tracking-widest">
          HERO SLIDER — Coming Soon
        </p>
      </section>

      {/* ── 2. Product Catalogue Section ─────────────────────────────── */}
      {/*
       * id="product" matches the "/#product" href in navConfig.js.
       * The Navbar Contact link will smooth-scroll here.
       */}
      <section id="product" className="min-h-screen bg-white py-20 px-4">
        {/* TODO: Replace with <ProductCatalog /> in the product branch */}
        <h2 className="text-3xl font-bold text-center text-neutral-800">
          Product Catalogue — Coming Soon
        </h2>
      </section>

      {/* ── 3. Contact Section ───────────────────────────────────────── */}
      {/*
       * id="contact" matches the "/#contact" href in navConfig.js.
       * The Navbar Contact link will smooth-scroll here.
       */}
      <section id="contact" className="min-h-[50vh] bg-neutral-100 py-20 px-4">
        {/* TODO: Replace with <ContactCard /> in the contact branch */}
        <h2 className="text-3xl font-bold text-center text-neutral-800">
          Contact — Coming Soon
        </h2>
      </section>

    </main>
  );
}