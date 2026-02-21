"use client";

import { cn } from "@/lib/utils";
import { useNavScroll } from "./useNavScroll";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

/**
 * Import anywhere with:
 *   import Navbar from "@/components/layout/navbar";
 */
export default function Navbar() {
  const { scrolled } = useNavScroll();

  return (
    <header
      className={cn(
        // Always fixed to the top, always full width, always above everything
        "fixed top-0 left-0 right-0 z-50",

        // Smooth transition for background + shadow changes
        "transition-all duration-500 ease-in-out",

        // Scrolled state: solid white with a blur effect + subtle border
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-neutral-200/60"

          // Default (hero visible): fully transparent so the hero image shows through
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20">

        <DesktopNav scrolled={scrolled} />
        <MobileNav  scrolled={scrolled} />

      </div>
    </header>
  );
}