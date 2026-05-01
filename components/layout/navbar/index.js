"use client";

import { cn } from "@/lib/utils";
import { useNavScroll } from "./useNavScroll";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Navbar({
  dark = false,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  showUser = true,
}) {
  const { scrolled } = useNavScroll(10);

  const isDark = dark || scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-16 px-2 sm:px-4 lg:px-10 transition-all duration-300",
        isDark
          ? "bg-white/95 backdrop-blur-sm border-b border-neutral-100 shadow-sm"
          : "bg-transparent"
      )}
    >
      <DesktopNav
        scrolled={scrolled}
        dark={dark}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        showUser={showUser}
      />
      <MobileNav
        scrolled={scrolled}
        dark={dark}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        showUser={showUser}
      />
    </header>
  );
}