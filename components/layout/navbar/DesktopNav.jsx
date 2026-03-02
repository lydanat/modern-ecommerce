"use client";

import Link from "next/link";
import { User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navLinks, handleSmoothScroll } from "./navConfig";

export default function DesktopNav({ scrolled, dark = false }) {
  const isDark    = dark || scrolled;
  const textColor = isDark ? "text-neutral-800" : "text-white";
  const hoverBg   = isDark ? "hover:bg-neutral-100" : "hover:bg-white/10";

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
          <span className={cn("font-serif text-white text-2xl font-semibold tracking-[0.12em] uppercase", textColor, hoverBg)}>
            Flash Of Build
          </span>
        </Link>
      </div>

      {/* Right: user icon */}
      <div className="flex justify-end">
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
      </div>

    </div>
  );
}