"use client";

import Link from "next/link";
import Image from "next/image";
import PhotoIcon from "@/public/icons/PhotoIcon";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer/Footer";
import ProductDetailSkeleton from "../skeletons/ProductDetailSkeleton";
import MessageIcon from "@/public/icons/MessageIcon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ALL_SIZES } from "@/constants/sizes";
import { ALL_COLORS } from "@/constants/colors";
import { formatType } from '@/constants/productTypes';


/* ── Related product card (compact horizontal scroll) ── */
function RelatedCard({ product }) {
  const mainImage = product.image_urls?.[0] ?? null;
  return (
    <Link href={`/product/${product.id}`} className="group flex flex-col shrink-0 w-45 sm:w-55">
      <div className="relative w-full aspect-3/4 overflow-hidden bg-neutral-100 rounded-sm">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.product_name}
            fill
            quality={70}
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            sizes="220px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <PhotoIcon/>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase text-white bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
            View
          </span>
        </div>
      </div>
      <div className="pt-2.5">
        <p className="font-sans text-[0.6rem] tracking-[0.12em] uppercase text-neutral-400">{formatType(product.product_type)}</p>
        <h4 className="font-serif text-neutral-900 text-xs leading-snug mt-0.5 group-hover:text-neutral-500 transition-colors duration-200 line-clamp-2">
          {product.product_name}
        </h4>
        <p className="font-sans text-xs text-neutral-500 tracking-wide mt-0.5">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

export default function ProductDetail({ productId }) {
  const [product,         setProduct]         = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [notFound,        setNotFound]        = useState(false);
  const [activeImage,     setActiveImage]     = useState(0);

  useEffect(() => {
    if (!productId) return;

    async function fetchData() {
      setLoading(true);
      setActiveImage(0);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProduct(data);

      /* Fetch related — same type, exclude current */
      const { data: related } = await supabase
        .from("products")
        .select("id, product_name, product_type, price, image_urls")
        .neq("id", productId)
        .neq("is_active", false)
        .order("created_at", { ascending: false })
        .limit(10);

      if (related) setRelatedProducts(related);
      setLoading(false);
    }

    fetchData();
  }, [productId]);

  /* ── Not found ── */
  if (!loading && notFound) {
    return (
      <>
        <Navbar dark />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center flex flex-col items-center gap-4">
            <p className="font-serif text-neutral-400 text-2xl italic">Product not found</p>
            <Link href="/product" className="font-sans text-[0.75rem] tracking-[0.12em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors">
              ← Back to all products
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const images    = product?.image_urls ?? [];
  const mainImage = images[activeImage] ?? null;

  return (
    <>
      <Navbar dark />

      <div className="min-h-screen bg-white pt-24 pb-18 px-2 sm:px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">

          {/* ── Main detail ── */}
          {loading ? (
            <ProductDetailSkeleton />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

              {/* COL 1: Image gallery */}
              <div className="flex flex-col gap-3">

                {/* Desktop: main + thumbnail strip */}
                <div className="hidden sm:flex flex-row gap-2">
                  <div className="relative flex-1 aspect-3/4 bg-neutral-100 overflow-hidden">
                    {mainImage ? (
                      <Image
                        src={mainImage}
                        alt={product.product_name}
                        fill
                        quality={90}
                        priority
                        className="object-cover object-center transition-opacity duration-300"
                        sizes="(max-width: 1024px) 70vw, 35vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <PhotoIcon/>
                      </div>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="flex flex-col gap-2 w-18 shrink-0 self-stretch">
                      {images.slice(0, 6).map((url, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`relative flex-1 w-full overflow-hidden transition-all duration-200 ${
                            activeImage === i
                              ? "border-neutral-900 opacity-100"
                              : "border-transparent opacity-45 hover:opacity-85"
                          }`}
                        >
                          <Image src={url} alt={`View ${i + 1}`} fill quality={60} className="object-cover object-center" sizes="72px" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile: full-width main */}
                <div className="sm:hidden relative w-full aspect-3/4 bg-neutral-100 overflow-hidden">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={product.product_name}
                      fill
                      quality={90}
                      priority
                      className="object-cover object-center transition-opacity duration-300"
                      sizes="100vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                      <PhotoIcon/>
                    </div>
                  )}
                </div>

                {/* Mobile thumbnail carousel */}
                {images.length > 1 && (
                  <div className="sm:hidden">
                    <Carousel opts={{ align: "start", dragFree: true }}>
                      <CarouselContent className="-ml-2">
                        {images.slice(0, 6).map((url, i) => (
                          <CarouselItem key={i} className="pl-2 basis-1/5">
                            <button
                              onClick={() => setActiveImage(i)}
                              className={`relative w-full aspect-square overflow-hidden transition-all duration-200 ${
                                activeImage === i ? "border-neutral-100" : "border-transparent opacity-55 hover:opacity-100"
                              }`}
                            >
                              <Image src={url} alt={`View ${i + 1}`} fill quality={60} className="object-cover object-center" sizes="20vw" />
                            </button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>
                )}
              </div>

              {/* COL 2: Product details */}
              <div className="flex flex-col gap-7 lg:pt-2">
                <p className="font-sans text-[0.72rem] tracking-[0.22em] uppercase text-neutral-400">
                  {formatType(product.product_type)}
                </p>

                <h1
                  className="font-serif text-neutral-900 leading-tight -mt-3"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                >
                  {product.product_name}
                </h1>

                <p className="font-sans text-xl text-neutral-800 tracking-wide -mt-2">
                  ${Number(product.price).toFixed(2)}
                </p>

                <div className="w-full h-px bg-neutral-100" />

                {product.product_description && (
                  <p className="font-sans font-light text-neutral-500 text-sm leading-relaxed tracking-wide">
                    {product.product_description}
                  </p>
                )}

                {/* Colors — static display only */}
                {product.colors?.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <p className="font-sans text-[0.72rem] tracking-[0.18em] uppercase text-neutral-500">Available Colors</p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => {
                        const colorObj = ALL_COLORS.find((x) => x.value === c);
                        return (
                          <div key={c} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-neutral-200 bg-white">
                            <span
                              className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                              style={{ backgroundColor: colorObj?.hex ?? c }}
                            />
                            <span className="font-sans text-[0.68rem] text-neutral-500 capitalize tracking-wide">
                              {colorObj?.label ?? c}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sizes — static display only */}
                {product.sizes?.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <p className="font-sans text-[0.72rem] tracking-[0.18em] uppercase text-neutral-500">Available Sizes</p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_SIZES.filter((s) => product.sizes.includes(s)).map((size) => (
                        <span
                          key={size}
                          className="w-12 h-10 flex items-center justify-center rounded-md border border-neutral-200 font-sans text-[0.78rem] font-medium text-neutral-600 bg-white"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="w-full h-px bg-neutral-100" />

                {/* Telegram CTA */}
                <div className="flex flex-col gap-3">
                  <a
                    href="https://t.me/bleh_ll"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full inline-flex items-center justify-center gap-3 bg-neutral-900 text-white font-sans font-medium text-[0.82rem] tracking-[0.12em] uppercase rounded-full py-4 px-6 transition-all duration-300 hover:bg-black active:scale-[0.98]"
                  >
                    <MessageIcon/>
                    Order via Telegram
                  </a>
                  <p className="font-sans text-center text-xs text-neutral-400 tracking-wide">
                    Contact us to confirm size, color &amp; availability
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── You may also like ── */}
          {!loading && relatedProducts.length > 0 && (
            <div className="mt-24">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="font-sans text-xs tracking-[0.22em] uppercase text-neutral-400 mb-1.5">
                    Browse More
                  </p>
                  <h2
                    className="font-serif font-light text-neutral-900 leading-none"
                    style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
                  >
                    You May Also <span className="italic font-semibold">Like</span>
                  </h2>
                </div>
                <Link
                  href="/product"
                  className="hidden sm:inline-flex font-sans text-[0.75rem] tracking-[0.12em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors duration-200 pb-1"
                >
                  View All →
                </Link>
              </div>

              <div className="w-full h-px bg-neutral-100 mb-8" />

              {/* Horizontal scroll strip */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {relatedProducts.map((p) => (
                  <RelatedCard key={p.id} product={p} />
                ))}
              </div>

              {/* Mobile view all */}
              <div className="mt-8 flex justify-center sm:hidden">
                <Link
                  href="/product"
                  className="font-sans text-[0.75rem] tracking-[0.12em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
                >
                  View All Products →
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}