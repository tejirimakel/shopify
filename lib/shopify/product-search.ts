import type { ProductSort } from "./types";

/** Single source of truth for sort options: their labels and Shopify `search()` mapping. */
export const SORT_OPTIONS: {
  value: ProductSort;
  label: string;
  sortKey: "RELEVANCE" | "PRICE";
  reverse: boolean;
}[] = [
  { value: "featured", label: "Featured", sortKey: "RELEVANCE", reverse: false },
  { value: "price-asc", label: "Price: Low to High", sortKey: "PRICE", reverse: false },
  { value: "price-desc", label: "Price: High to Low", sortKey: "PRICE", reverse: true },
  // Shopify's search() only supports sorting by RELEVANCE or PRICE (no CREATED_AT) — the
  // already-fetched result page is re-sorted by createdAt in searchProducts()/mockSearchProducts()
  // instead. See sortKey/reverse here are just what's sent to Shopify for this option's query.
  { value: "newest", label: "Newest", sortKey: "RELEVANCE", reverse: false },
];

const DEFAULT_SORT: ProductSort = "featured";

export type ProductSearchState = {
  query: string;
  sort: ProductSort;
  filters: string[];
  after: string | null;
};

/** Reads and validates the product search/filter/sort state from URL search params. */
export function parseProductSearchParams(params: URLSearchParams): ProductSearchState {
  const query = params.get("q")?.trim() ?? "";
  const rawSort = params.get("sort");
  const sort = SORT_OPTIONS.some((option) => option.value === rawSort)
    ? (rawSort as ProductSort)
    : DEFAULT_SORT;
  const filters = Array.from(new Set(params.getAll("filter")));
  const after = params.get("after");
  return { query, sort, filters, after };
}

/**
 * Builds a `/products?...` href from the current state plus a partial override —
 * used by every filter/sort/pagination link. Changing anything other than `after`
 * resets pagination back to the first page, unless the override explicitly sets `after`.
 */
export function buildSearchHref(
  state: ProductSearchState,
  overrides: Partial<ProductSearchState> = {}
): string {
  const next: ProductSearchState = {
    ...state,
    ...overrides,
    after: "after" in overrides ? (overrides.after ?? null) : null,
  };

  const params = new URLSearchParams();
  if (next.query) params.set("q", next.query);
  if (next.sort !== DEFAULT_SORT) params.set("sort", next.sort);
  for (const filter of next.filters) params.append("filter", filter);
  if (next.after) params.set("after", next.after);

  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

/** Adds `input` to `filters` if absent, removes it if present. */
export function toggleFilterInput(filters: string[], input: string): string[] {
  return filters.includes(input)
    ? filters.filter((filter) => filter !== input)
    : [...filters, input];
}

/** Whether a filter's opaque `input` JSON string is a product-type filter. */
export function isProductTypeFilterInput(raw: string): boolean {
  try {
    return "productType" in JSON.parse(raw);
  } catch {
    return false;
  }
}
