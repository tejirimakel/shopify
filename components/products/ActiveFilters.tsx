import Link from "next/link";

import { buildSearchHref, toggleFilterInput, type ProductSearchState } from "@/lib/shopify/product-search";
import type { ProductFacet } from "@/lib/shopify/types";

/** Looks up a human-readable label for a filter's opaque `input` JSON string. */
function labelFor(facets: ProductFacet[], input: string): string {
  for (const facet of facets) {
    const value = facet.values.find((v) => v.input === input);
    if (value) return `${facet.label}: ${value.label}`;
  }

  // A custom price range (from the min/max inputs) generally won't match any
  // facet's suggested full-range value exactly — format it directly instead
  // of falling back to the raw JSON string.
  try {
    const parsed = JSON.parse(input);
    if (parsed?.price) {
      const { min, max } = parsed.price as { min?: number; max?: number };
      if (min !== undefined && max !== undefined) return `Price: $${min}–$${max}`;
      if (min !== undefined) return `Price: $${min}+`;
      if (max !== undefined) return `Price: up to $${max}`;
    }
  } catch {
    // fall through
  }
  return "Filter";
}

export function ActiveFilters({
  state,
  facets,
}: {
  state: ProductSearchState;
  facets: ProductFacet[];
}) {
  const hasQuery = state.query.length > 0;
  const hasFilters = state.filters.length > 0;

  if (!hasQuery && !hasFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {hasQuery && (
        <Link
          href={buildSearchHref(state, { query: "" })}
          className="flex min-h-11 items-center rounded-full border border-border px-3 py-1 text-text/80 hover:border-primary"
        >
          &quot;{state.query}&quot; ×
        </Link>
      )}
      {state.filters.map((filter) => (
        <Link
          key={filter}
          href={buildSearchHref(state, { filters: toggleFilterInput(state.filters, filter) })}
          className="flex min-h-11 items-center rounded-full border border-border px-3 py-1 text-text/80 hover:border-primary"
        >
          {labelFor(facets, filter)} ×
        </Link>
      ))}
      <Link
        href={buildSearchHref(state, { filters: [] })}
        className="flex min-h-11 items-center px-2 text-text/60 underline-offset-2 hover:text-error hover:underline"
      >
        Clear filters
      </Link>
    </div>
  );
}
