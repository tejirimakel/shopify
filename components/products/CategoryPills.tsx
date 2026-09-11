import Link from "next/link";

import {
  buildSearchHref,
  isProductTypeFilterInput,
  type ProductSearchState,
} from "@/lib/shopify/product-search";
import type { ProductFacet } from "@/lib/shopify/types";

/** Horizontal, single-select category picker built from the "Product type" facet. */
export function CategoryPills({
  state,
  facets,
}: {
  state: ProductSearchState;
  facets: ProductFacet[];
}) {
  const categoryFacet = facets.find((facet) =>
    facet.values.some((value) => isProductTypeFilterInput(value.input))
  );

  if (!categoryFacet) {
    return null;
  }

  const otherFilters = state.filters.filter((filter) => !isProductTypeFilterInput(filter));
  const activeInput = state.filters.find(isProductTypeFilterInput) ?? null;

  const pillClass = (active: boolean) =>
    `whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
      active
        ? "bg-primary text-background"
        : "border border-border text-text/70 hover:border-primary hover:text-primary"
    }`;

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={buildSearchHref(state, { filters: otherFilters })}
        aria-current={activeInput === null ? "true" : undefined}
        className={pillClass(activeInput === null)}
      >
        All
      </Link>
      {categoryFacet.values.map((value) => (
        <Link
          key={value.id}
          href={buildSearchHref(state, { filters: [...otherFilters, value.input] })}
          aria-current={activeInput === value.input ? "true" : undefined}
          className={pillClass(activeInput === value.input)}
        >
          {value.label}
        </Link>
      ))}
    </div>
  );
}
