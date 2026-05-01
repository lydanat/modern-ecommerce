"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatType } from "@/constants/productTypes";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer/Footer";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton"
import ProductCard from "../ProductCard";
import ProductIcon from "@/public/icons/ProductIcon";

const STATIC_FILTERS = ["All", "Boxy", "Oversized", "Slim", "Tank Top"];
const PER_PAGE = 12;

/* ── Page ── */
export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [allProducts,   setAllProducts]   = useState([]);
  const [activeFilter,  setActiveFilter]  = useState("All");
  const [searchQuery,   setSearchQuery]   = useState(() => searchParams.get("q") ?? "");
  const [currentPage,   setCurrentPage]   = useState(1);
  const [loading,       setLoading]       = useState(true);

  // Deduplicate types using useMemo — normalise to lowercase for comparison
  const FILTERS = useMemo(() => {
    const seen  = new Set();
    const types = [];
    for (const p of allProducts) {
      const raw = p.product_type?.trim();
      if (!raw) continue;
      const key = raw.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        types.push(raw);
      }
    }
    types.sort((a, b) => {
      const ai = STATIC_FILTERS.findIndex(f => f.toLowerCase() === a.toLowerCase());
      const bi = STATIC_FILTERS.findIndex(f => f.toLowerCase() === b.toLowerCase());
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
    return ["All", ...types];
  }, [allProducts]);

  /* Fetch all once, filter client-side */
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, product_name, product_type, price, image_urls")
        .neq("is_active", false)
        .order("created_at", { ascending: false });

      if (!error && data) setAllProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const queryFromUrl = searchParams.get("q") ?? "";

    setSearchQuery(prev => (prev === queryFromUrl ? prev : queryFromUrl));
  }, [searchParams]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentQuery = searchParams.get("q") ?? "";
      const nextQuery = searchQuery.trim();

      if (currentQuery === nextQuery) return;

      const params = new URLSearchParams(searchParams.toString());

      if (nextQuery) {
        params.set("q", nextQuery);
      } else {
        params.delete("q");
      }

      const nextSearch = params.toString();
      const nextUrl = nextSearch ? `${pathname}?${nextSearch}` : pathname;

      router.replace(nextUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [pathname, router, searchParams, searchQuery]);

  /* Reset to page 1 whenever filter changes — deferred to avoid sync setState warning */
  useEffect(() => {
    const t = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(t);
  }, [activeFilter, searchQuery]);

  const typeFiltered = activeFilter === "All"
    ? allProducts
    : allProducts.filter((p) =>
        p.product_type?.trim().toLowerCase() === activeFilter.trim().toLowerCase()
      );

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filtered = typeFiltered.filter((product) => {
    if (!normalizedSearch) return true;

    const name = (product.product_name ?? "").toLowerCase();
    const type = (product.product_type ?? "").toLowerCase();
    const priceNumber = Number(product.price);
    const price = Number.isFinite(priceNumber)
      ? [priceNumber.toFixed(2), String(priceNumber)]
      : [String(product.price ?? "")];

    return [name, type, ...price].some((value) =>
      value.includes(normalizedSearch)
    );
  });

  const totalPages  = Math.ceil(filtered.length / PER_PAGE);
  const paginated   = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  /* Build page numbers with ellipsis */
  function getPageNumbers() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }

  return (
    <>
      <Navbar
        dark
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search name, type, price..."
      />

      <div className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <p className="font-sans text-xs tracking-[0.22em] uppercase text-neutral-400 mb-2">
              Catalogue
            </p>
            <h1
              className="font-serif font-light text-neutral-900 leading-none"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              All <span className="italic font-semibold">Products</span>
            </h1>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap mb-10">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`font-sans text-[0.75rem] tracking-[0.12em] uppercase px-5 py-2.5 rounded-full border transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-800"
                }`}
              >
                {filter === "All" ? "All" : formatType(filter)}
              </button>
            ))}
          </div>

          <div className="w-full h-px bg-neutral-100 mb-10" />

          {/* Count */}
          {!loading && (
            <p className="font-sans text-xs tracking-wide text-neutral-400 mb-8">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
              {activeFilter !== "All" ? ` in ${formatType(activeFilter)}` : ""}
              {normalizedSearch ? ` matching \"${searchQuery.trim()}\"` : ""}
            </p>
          )}

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
              <ProductIcon/>
              <p className="font-serif text-neutral-400 text-xl italic">No products available</p>
              {activeFilter !== "All" && (
                <button
                  onClick={() => setActiveFilter("All")}
                  className="mt-2 font-sans text-[0.75rem] tracking-[0.12em] uppercase px-5 py-2.5 rounded-full border border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-all duration-200"
                >
                  View All
                </button>
              )}
              {normalizedSearch && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="font-sans text-[0.75rem] tracking-[0.12em] uppercase px-5 py-2.5 rounded-full border border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-all duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {!loading && paginated.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(p => p - 1); }}
                          className={currentPage === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {getPageNumbers().map((page, idx) =>
                        page === "..." ? (
                          <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === page}
                              onClick={(e) => { e.preventDefault(); setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}