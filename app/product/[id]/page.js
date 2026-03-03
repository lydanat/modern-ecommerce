"use client";

import { useParams } from "next/navigation";
import ProductDetail from "@/components/views/ProductDetail";

export default function Page() {
  const params = useParams();
  const productId = params.id;

  return <ProductDetail productId={productId} />;
}