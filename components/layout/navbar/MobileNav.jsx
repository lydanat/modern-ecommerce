"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, User, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navLinks, handleSmoothScroll } from "./navConfig";

export default function MobileNav({ scrolled }) {
  const [open, setOpen] = useState(false);

  const textColor = scrolled ? "text-neutral-800" : "text-white";
  const hoverBg   = scrolled ? "hover:bg-neutral-100" : "hover:bg-white/10";

  return (
    <div className="grid lg:hidden grid-cols-3 items-center w-full h-full">

      <div className="flex items-center">
        <Sheet open={open} onOpenChange={setOpen}>

          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation menu"
              className={cn("transition-colors duration-300", textColor, hoverBg)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72 p-0 flex flex-col">

            <SheetHeader className="flex flex-row items-center justify-between px-6 pt-8 pb-5 border-b border-neutral-100">
              <SheetTitle className="text-left text-xl font-black tracking-[0.15em] uppercase">
                Brand
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col px-4 pt-4 gap-0.5" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) =>
                    handleSmoothScroll(
                      e,
                      link.href,
                      () => setOpen(false)
                    )
                  }
                  className="flex items-center px-3 py-3.5 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-100 font-medium text-base transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

          </SheetContent>
        </Sheet>
      </div>

      <div className="flex justify-center">
        <Link
          href="/"
          onClick={(e) => handleSmoothScroll(e, "/")}
          className={cn(
            "text-xl font-black tracking-[0.15em] uppercase transition-colors duration-300",
            scrolled ? "text-black" : "text-white"
          )}
        >
           <Image
                src="/assets/logo.png"
                alt="logo"
                width={50}
                height={50}
            />
        </Link>
      </div>

      {/* ── RIGHT: User Icon ── */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          aria-label="My account"
          asChild
          className={cn("rounded-full transition-colors duration-300", textColor, hoverBg)}
        >
          <Link href="/login">
            <User className="h-5 w-5" />
          </Link>
        </Button>
      </div>

    </div>
  );
}