"use client";

import Link from "next/link";
import { Search, User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { navLinks, handleSmoothScroll } from "./navConfig";
import Image from "next/image";

export default function DesktopNav({
  scrolled,
  dark = false,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  showUser = true,
}) {
  const isDark    = dark || scrolled;
  const textColor = isDark ? "text-neutral-800" : "text-white";
  const hoverBg   = isDark ? "hover:bg-neutral-100" : "hover:bg-white/10";
  const searchClasses = isDark
    ? "border-neutral-200 bg-white/95 text-neutral-900 placeholder:text-neutral-400"
    : "border-white/25 bg-white/10 text-neutral-900 placeholder:text-white/70";

  return (
    <div className="hidden lg:grid grid-cols-3 items-center w-full h-full">

      {/* Left: nav links */}
      <div className="flex items-center">
        <NavigationMenu>
          <NavigationMenuList className="gap-1">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.label}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "relative bg-transparent focus:bg-transparent transition-colors duration-300",
                      isDark ? "text-neutral-800" : "text-white", // text color based on scroll
                      // underline animation
                      "after:absolute after:left-0 after:-bottom-0.5 after:h-[1.5px] after:w-0 after:bg-current",
                      "after:transition-all after:duration-300",
                      "hover:after:w-full",
                      "bg-transparent! !hover:bg-transparent shadow-none! rounded-none!",
                      // force white text on hover when not scrolled
                      !isDark && "hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Center: logo */}
      <div className="flex justify-center">
        <Link href="/" className="transition-opacity duration-300 hover:opacity-80">
          <Image
            src={isDark ? "/assets/logoblack2.png" : "/assets/logowhite.png"}
            alt="Flash Of Build"
            width={200}
            height={60}
            priority
            className="object-contain"
          />
        </Link>
      </div>

      {/* Right: search + user icon */}
      <div className="flex items-center justify-end gap-2">
        {onSearchChange && (
          <div className="relative w-52 xl:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search products"
              className={cn(
                "h-10 rounded-full pl-9 pr-4 text-sm focus-visible:ring-2",
                searchClasses
              )}
            />
          </div>
        )}
        {showUser && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="My account"
            asChild
            className={cn("rounded-full transition-colors duration-300", textColor, hoverBg)}
          >
            <Link href="/admin">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        )}
      </div>

    </div>
  );
}