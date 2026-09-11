import type { Metadata } from "next";

import { ConfigErrorNotice } from "@/components/ConfigErrorNotice";
import { ActiveFilters } from "@/components/products/ActiveFilters";
import { CategoryPills } from "@/components/products/CategoryPills";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductSort } from "@/components/products/ProductSort";
import { SearchBar } from "@/components/products/SearchBar";
import { ShopifyConfigError, searchProducts } from "@/lib/shopify/client";
import { buildSearchHref, parseProductSearchParams } from "@/lib/shopify/product-search";
import type { ProductSearchResult } from "@/lib/shopify/types";

export const metadata: Metadata = {
  title: "Our Menu",
  description: "Browse the full Madhura Kitchen menu.",
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedParams)) {
    if (Array.isArray(value)) {
      value.forEach((v) => urlParams.append(key, v));
    } else if (value !== undefined) {
      urlParams.set(key, value);
    }
  }
  const state = parseProductSearchParams(urlParams);

  let result: ProductSearchResult;
  try {
    result = await searchProducts({
      query: state.query,
      filters: state.filters,
      sort: state.sort,
      after: state.after,
    });
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

  const hasActiveSearch = state.query.length > 0 || state.filters.length > 0;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-sienna)_0%,_transparent_45%),radial-gradient(ellipse_at_bottom_right,_var(--primary)_0%,_transparent_40%)] opacity-20"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            A Journey Through South India
          </p>
          <h1 className="mt-4 font-display text-4xl text-secondary sm:text-5xl md:text-6xl">
            Explore Our Menu
          </h1>
          <p className="mt-4 text-text/70">
            Experience the soulful heritage of Madhura Kitchen through our
            curated selection of spice-rich delicacies and time-honored family
            recipes.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchBar state={state} />
          <ProductFilters state={state} facets={result.facets} />
        </div>
        <div className="mb-6">
          <CategoryPills state={state} facets={result.facets} />
        </div>
        <ActiveFilters state={state} facets={result.facets} />

        <div className="mb-8 mt-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Curated Selection
            </p>
            <h2 className="font-display text-3xl text-secondary sm:text-4xl">
              Signature Collection
            </h2>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p className="text-sm text-text/60">
              Showing {result.totalCount} dishes crafted with authentic South
              Indian heritage.
            </p>
            <ProductSort state={state} />
          </div>
        </div>

        <ProductGrid
          products={result.products}
          emptyMessage={hasActiveSearch ? "No products match your search." : undefined}
          clearFiltersHref={hasActiveSearch ? buildSearchHref(state, { query: "", filters: [] }) : undefined}
          productHeadingLevel="h3"
        />
      </div>

      {/* Info strip */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
              Dietary Notice
            </h3>
            <p className="mt-2 text-sm text-text/60">
              Our kitchen handles nuts, dairy, and gluten. Please let us know
              about any allergies when you order.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
              Large Orders
            </h3>
            <p className="mt-2 text-sm text-text/60">
              Planning a corporate event or gathering? We&rsquo;re happy to
              help with orders for groups of 10 or more.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
              Need Help Choosing?
            </h3>
            <p className="mt-2 text-sm text-text/60">
              Not sure what to order? Reach out and we&rsquo;ll help you build
              the perfect meal.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
