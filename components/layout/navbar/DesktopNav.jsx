"use client";

import Link from "next/link";
import Image from "next/image";
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


export default function DesktopNav({ scrolled }) {

  const textColor = scrolled ? "text-neutral-800" : "text-white";
  const hoverBg   = scrolled ? "hover:bg-neutral-100" : "hover:bg-white/10";

  return (
    <div className="hidden lg:grid grid-cols-3 items-center w-full h-full">

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
                      "bg-transparent hover:bg-transparent focus:bg-transparent",
                      "text-sm font-medium tracking-wide transition-colors duration-300",
                      textColor
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

      <div className="flex justify-center">
        <Link
          href="/"
          onClick={(e) => handleSmoothScroll(e, "/")}
          className={cn(
            "text-2xl font-black tracking-[0.18em] uppercase transition-colors duration-300",
            scrolled ? "text-black" : "text-white"
          )}
        >
          <Image
            src="/assets/logo.png"
            alt="logo"
            width={60}
            height={60}
            />
        </Link>
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          aria-label="My account"
          asChild
          className={cn(
            "rounded-full transition-colors duration-300",
            textColor,
            hoverBg
          )}
        >
          <Link href="/login">
            <User className="h-5 w-5" />
          </Link>
        </Button>
      </div>

    </div>
  );
}