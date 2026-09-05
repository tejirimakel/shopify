import Link from "next/link";

import type { Product } from "@/lib/shopify/types";

import { formatMoney } from "./price";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  return (
    <li className="group">
      <Link href={`/products/${product.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface">
          <ProductImage
            src={product.images[0]?.url}
            alt={product.images[0]?.altText ?? product.title}
          />
          {!product.availableForSale && (
            <span className="absolute left-2 top-2 rounded-sm bg-text/80 px-2 py-1 text-xs font-medium text-white">
              Sold out
            </span>
          )}
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-medium text-text group-hover:text-primary">
            {product.title}
          </h2>
          <p className="text-sm text-text/70">
            {formatMoney(product.priceRange.minVariantPrice)}
          </p>
        </div>
      </Link>
    </li>
  );
}
