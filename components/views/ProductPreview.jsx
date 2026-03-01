"use client";

import Link from "next/link";
import ProductCard from "../ProductCard";
import ProductIcon from "@/public/icons/ProductIcon";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function ProductPreview() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("id, product_name, product_type, price, image_urls")
        .neq("is_active", false)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error && data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <section id="product" className="w-full bg-white py-24 px-2 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-sans text-xs tracking-[0.22em] uppercase text-neutral-400 mb-2">
              Our Collection
            </p>
            <h2
              className="font-serif font-light text-neutral-900 leading-none"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Featured{" "}
              <span className="italic font-semibold">Pieces</span>
            </h2>
          </div>

          <Link
            href="/product"
            className="hidden sm:inline-flex items-center gap-2 font-sans text-[0.78rem] tracking-[0.12em] uppercase text-neutral-500 hover:text-black transition-colors duration-200 group pb-1"
          >
            View All
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-center">
            <ProductIcon/>
            <p className="font-serif text-neutral-400 text-xl italic">No products available yet</p>
            <p className="font-sans text-xs tracking-wide text-neutral-400">Check back soon, Our new products are on the way.</p>
          </div>
        )}

        {/* Product grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && products.length > 0 && (
          <>
            <div className="mt-16 flex justify-center sm:hidden">
              <Link
                href="/product"
                className="group inline-flex items-center gap-2.5 border border-neutral-900 rounded-full px-8 py-3.5 font-sans text-[0.78rem] tracking-[0.12em] uppercase text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300"
              >
                View All Products
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="mt-16 hidden sm:flex justify-center">
              <Link
                href="/product"
                className="group inline-flex items-center gap-2.5 border border-neutral-900 rounded-full px-10 py-4 font-sans text-[0.78rem] tracking-[0.14em] uppercase text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300"
              >
                View All Products
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  );
}