import Link from "next/link";

import type { Product } from "@/lib/shopify/types";

import { formatMoney } from "./price";
import { ProductImage } from "./ProductImage";

export function ProductCard({
  product,
  headingLevel,
}: {
  product: Product;
  headingLevel: "h2" | "h3";
}) {
  const HeadingTag = headingLevel;

  return (
    <li className="group">
      <Link
        href={`/products/${product.handle}`}
        className="flex h-full flex-col overflow-hidden rounded-md border border-border bg-surface transition-colors hover:border-primary"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-background">
          <ProductImage
            src={product.images[0]?.url}
            alt={product.images[0]?.altText ?? product.title}
          />
          {!product.availableForSale && (
            <span className="absolute left-2 top-2 rounded-sm bg-accent-sienna px-2 py-1 text-xs font-medium text-background">
              Sold out
            </span>
          )}
          {product.productType === "Vegetarian" && (
            <span className="absolute right-2 top-2 rounded-sm bg-accent-olive px-2 py-1 text-xs font-medium text-background">
              Veg
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <HeadingTag className="font-display text-lg text-secondary group-hover:text-primary">
              {product.title}
            </HeadingTag>
            <p className="whitespace-nowrap text-sm text-text/70">
              {formatMoney(product.priceRange.minVariantPrice)}
            </p>
          </div>
          {product.description && (
            <p className="line-clamp-2 text-sm text-text/60">{product.description}</p>
          )}
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-xs uppercase tracking-widest text-text/40">
              {product.productType}
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary group-hover:opacity-80">
              Order Now &rarr;
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
