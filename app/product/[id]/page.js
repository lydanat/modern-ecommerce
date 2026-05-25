"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/views/ProductDetail";
import NotFound from "@/app/not-found";

export default function Page() {
  const params = useParams();
  const productId = params.id;

  if (!productId) {
    return <NotFound/>
  }

  return <ProductDetail productId={productId} />;
}