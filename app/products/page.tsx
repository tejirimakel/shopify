import type { Metadata } from "next";

import { ConfigErrorNotice } from "@/components/ConfigErrorNotice";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ShopifyConfigError, getProducts } from "@/lib/shopify/client";
import type { Product } from "@/lib/shopify/types";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse the full collection.",
};

export default async function ProductsPage() {
  let products: Product[];
  try {
    products = await getProducts();
  } catch (error) {
    // A missing environment variable is a distinct, actionable failure from
    // a generic Shopify API outage (Phase 3 error table). Its identity
    // survives here because we're still on the server — see
    // components/ConfigErrorNotice.tsx for why this can't be done in
    // app/products/error.tsx instead. Anything else falls through to that
    // boundary's generic "couldn't load the shop" message.
    if (error instanceof ShopifyConfigError) {
      return <ConfigErrorNotice />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-text">All Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
