import Navbar from "@/components/layout/navbar";
import HeroSlider from "@/components/views/HeroSection";

/**
 * LandingPage
 *
 * Root component for the customer-facing landing page.
 * Lives in: components/views/LandingPage.jsx
 *
 * Sections:
 *   1. <Navbar />      — sticky transparent → solid header
 *   2. <HeroSlider />  — full-viewport Swiper fade slider  ✅ done
 *   3. #product        — product catalogue (next branch)
 *   4. #contact        — contact card (next branch)
 */
export default function LandingPage() {
  return (
    <main>

      {/* Sticky Navbar — z-50, always above HeroSlider */}
      <Navbar />

      {/* ── 1. Hero ── */}
      <HeroSlider />

      {/* ── 2. Product Catalogue ── */}
      <section id="product" className="min-h-screen bg-white py-24 px-4">
        <h2 className="text-3xl font-bold text-center text-neutral-800">
          Product Catalogue — Coming Soon
        </h2>
      </section>

      {/* ── 3. Contact ── */}
      <section id="contact" className="min-h-[50vh] bg-neutral-100 py-20 px-4">
        <h2 className="text-3xl font-bold text-center text-neutral-800">
          Contact — Coming Soon
        </h2>
      </section>

    </main>
  );
}