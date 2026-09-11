import Link from "next/link";

import type { Product } from "@/lib/shopify/types";

import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  emptyMessage,
  clearFiltersHref,
  productHeadingLevel,
}: {
  products: Product[];
  emptyMessage?: string;
  clearFiltersHref?: string;
  productHeadingLevel: "h2" | "h3";
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-24 text-center">
        <p className="text-base font-medium text-text">
          {emptyMessage ?? "No products yet"}
        </p>
        {clearFiltersHref ? (
          <Link href={clearFiltersHref} className="text-sm font-medium text-primary hover:underline">
            Clear filters
          </Link>
        ) : (
          <p className="text-sm text-text/60">Check back soon — we&apos;re restocking the shop.</p>
        )}
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} headingLevel={productHeadingLevel} />
      ))}
    </ul>
  );
}
