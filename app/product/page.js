import { Suspense } from "react";
import ProductsPage from "@/components/views/ProductsPage";

export const metadata = {
  title: "Products | Flash Of Build",
  description: "Browse our full collection of Boxy, Oversized, Slim and Tank Top styles.",
  icons: {
    icon: "assets/logo.jpg",
    shortcut: "assets/logo.jpg",
    apple: "assets/logo.jpg",
  },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProductsPage />
    </Suspense>
  );
}