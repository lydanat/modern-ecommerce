"use client";

import Link from "next/link";
import Image from "next/image";
import PhotoIcon from "@/public/icons/PhotoIcon";
import { formatType } from "@/constants/productTypes";

export default function ProductCard({ product }) {
  const mainImage = product.image_urls?.[0] ?? null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col gap-0"
    >
      <div className="relative w-full overflow-hidden bg-neutral-100 aspect-3/4">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.product_name}
            fill
            quality={85}
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <PhotoIcon/>
          </div>
        )}

        {/* Hover hint */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-5 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="font-sans text-[0.72rem] tracking-[0.14em] uppercase text-white bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full">
            View Product
          </span>
        </div>
      </div>

      <div className="pt-4 pb-1 flex flex-col gap-1">
        <p className="font-sans text-xs tracking-[0.15em] uppercase text-neutral-400">
          {formatType(product.product_type)}
        </p>
        <h3 className="font-serif text-neutral-900 text-base leading-snug group-hover:text-neutral-600 transition-colors duration-200">
          {product.product_name}
        </h3>
        <p className="font-sans text-sm text-neutral-700 tracking-wide mt-0.5">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}