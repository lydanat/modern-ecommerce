import ProductDetail from "@/components/views/ProductDetail";

export const metadata = {
  title: "Product | Flash of Build",
};

export default async function Page({ params }) {
  const { id } = await params;
  return <ProductDetail productId={id} />;
}