import { MOCK_PRODUCTS } from "./mock-data";
import { SORT_OPTIONS } from "./product-search";
import type { Product, ProductFacet, ProductSearchResult, ProductSort } from "./types";

function matchesQuery(product: Product, query: string): boolean {
  if (!query) return true;
  const haystack = `${product.title} ${product.description}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

/** Mirrors (loosely) how Shopify's `productFilters` input is interpreted, for mock mode only. */
function matchesFilters(product: Product, filters: string[]): boolean {
  return filters.every((raw) => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return true;
    }
    if (typeof parsed.available === "boolean") {
      return product.availableForSale === parsed.available;
    }
    if (typeof parsed.productType === "string") {
      return product.productType === parsed.productType;
    }
    if (parsed.price && typeof parsed.price === "object") {
      const { min, max } = parsed.price as { min?: number; max?: number };
      const price = Number(product.priceRange.minVariantPrice.amount);
      if (typeof min === "number" && price < min) return false;
      if (typeof max === "number" && price > max) return false;
      return true;
    }
    return true;
  });
}

function buildFacets(products: Product[]): ProductFacet[] {
  const prices = products.map((product) => Number(product.priceRange.minVariantPrice.amount));
  const availableCount = products.filter((product) => product.availableForSale).length;

  const typeCounts = new Map<string, number>();
  for (const product of products) {
    typeCounts.set(product.productType, (typeCounts.get(product.productType) ?? 0) + 1);
  }

  return [
    {
      id: "mock.availability",
      label: "Availability",
      type: "LIST",
      values: [
        {
          id: "mock.availability.true",
          label: "In stock",
          count: availableCount,
          input: JSON.stringify({ available: true }),
        },
        {
          id: "mock.availability.false",
          label: "Out of stock",
          count: products.length - availableCount,
          input: JSON.stringify({ available: false }),
        },
      ],
    },
    {
      id: "mock.price",
      label: "Price",
      type: "PRICE_RANGE",
      values: [
        {
          id: "mock.price",
          label: "Price",
          count: 0,
          input: JSON.stringify({
            price: { min: Math.min(0, ...prices), max: Math.max(0, ...prices) },
          }),
        },
      ],
    },
    {
      id: "mock.product-type",
      label: "Product type",
      type: "LIST",
      values: [...typeCounts.entries()].map(([type, count]) => ({
        id: `mock.product-type.${type}`,
        label: type,
        count,
        input: JSON.stringify({ productType: type }),
      })),
    },
  ];
}

export async function mockSearchProducts(params: {
  query?: string;
  filters?: string[];
  sort?: ProductSort;
  first?: number;
  after?: string | null;
}): Promise<ProductSearchResult> {
  const query = params.query?.trim() ?? "";
  const filters = params.filters ?? [];

  const queryMatched = MOCK_PRODUCTS.filter((product) => matchesQuery(product, query));
  const matched = queryMatched.filter((product) => matchesFilters(product, filters));

  const sortOption = SORT_OPTIONS.find((option) => option.value === params.sort) ?? SORT_OPTIONS[0];
  const sorted = [...matched].sort((a, b) => {
    if (params.sort === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortOption.sortKey === "PRICE") {
      const diff =
        Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount);
      return sortOption.reverse ? -diff : diff;
    }
    return 0;
  });

  const first = params.first ?? 20;
  const page = sorted.slice(0, first);

  return {
    products: page,
    totalCount: sorted.length,
    pageInfo: {
      hasNextPage: sorted.length > first,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
    // Facet counts reflect the query-matched catalog, not further narrowed by the other
    // currently-active filters — the same simplification the live facets had before the
    // Search & Discovery app was configured; kept here since mock mode has no such app.
    facets: buildFacets(queryMatched),
  };
}
