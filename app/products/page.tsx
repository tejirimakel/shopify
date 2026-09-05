import type { Metadata } from "next";

import { ProductGrid } from "@/components/products/ProductGrid";
import { getProducts } from "@/lib/shopify/client";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse the full collection.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-text">All Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
