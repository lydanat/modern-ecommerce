"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// simplified mobile search: no product fetching here to avoid complexity
import { cn } from "@/lib/utils";
import { navLinks, handleSmoothScroll } from "./navConfig";

export default function MobileNav({
  scrolled,
  dark = false,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search name, type, price...",
  showUser = true,
}) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery ?? "");
  const router = useRouter();

  function handleSubmitSearch() {
    if (!onSearchChange) return;
    const q = searchQuery || "";
    onSearchChange(q);
    router.push(`/product${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    setSearchOpen(false);
  }
  // no server-side fetching here — keep mobile search lightweight

  const isDark    = dark || scrolled;
  const textColor = isDark ? "text-neutral-800" : "text-white";
  const hoverBg   = isDark ? "hover:bg-neutral-100" : "hover:bg-white/10";

  return (
    <div className="grid lg:hidden grid-cols-3 items-center w-full h-full">

      {/* Left: hamburger */}
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
              <SheetTitle className="text-left text-xl font-black tracking-[0.15em] uppercase text-black/70">
                Flash of Build
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col px-4 pt-4 gap-0.5" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href, () => setOpen(false))}
                  className="flex items-center px-3 py-3.5 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-100 font-medium text-base transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {showUser && (
              <div className="mt-auto p-4 border-t border-neutral-100">
                <Button
                  variant="outline"
                  asChild
                  className="w-full h-11 rounded-full border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      {/* Center: logo */}
      <div className="flex justify-center items-center py-2 md:py-4">
        <Link href="/" className="transition-opacity duration-300 hover:opacity-80">
          <span className={cn(
              "font-serif text-white text-lg md:text-base font-semibold uppercase whitespace-nowrap",
              textColor
            )}>
            Flash Of Build
          </span>        
        </Link>
      </div>

      {/* Right: search icon */}
      <div className="flex justify-end items-center">
        {onSearchChange && (
          <>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search products"
              onClick={() => setSearchOpen(true)}
              className={cn("rounded-full transition-colors duration-300", textColor, hoverBg)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
              <DialogContent
                showCloseButton={false}
                className="inset-0 top-0 left-0 w-screen max-w-none h-screen translate-x-0 translate-y-0 rounded-none border-0 bg-white text-neutral-900 p-6 pt-8"
              >
                <div className="mx-auto w-full max-w-2xl flex flex-col h-full">
                  <div className="flex items-center justify-between mb-10">
                    <DialogTitle className="font-sans text-[0.72rem] tracking-[0.2em] uppercase text-neutral-500">
                      Search Products
                    </DialogTitle>
                  
                  </div>

                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      autoFocus
                      type="search"
                      value={onSearchChange ? searchQuery : localQuery}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (onSearchChange) onSearchChange(v);
                        else setLocalQuery(v);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSubmitSearch();
                        }
                      }}
                      placeholder={searchPlaceholder}
                      aria-label="Search by name, type, or price"
                      className="h-14 rounded-2xl border-neutral-200 bg-neutral-50 pl-12 pr-4 text-base text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-200"
                    />
                  </div>

                  <div className="mt-auto pb-6">
                    <Button
                      variant="outline"
                      onClick={() => setSearchOpen(false)}
                      className="w-full h-11 rounded-full border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
        {/* Login is available in the sidebar (Sheet); do not show on mobile/tablet here */}
      </div>

    </div>
  );
}