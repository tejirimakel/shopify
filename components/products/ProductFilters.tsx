"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";

import { PriceRangeFilter } from "@/components/products/PriceRangeFilter";
import {
  buildSearchHref,
  isProductTypeFilterInput,
  toggleFilterInput,
  type ProductSearchState,
} from "@/lib/shopify/product-search";
import type { ProductFacet } from "@/lib/shopify/types";

export function ProductFilters({
  state,
  facets,
}: {
  state: ProductSearchState;
  facets: ProductFacet[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  // Checkboxes are controlled by `state.filters`, which only updates once the
  // navigation below actually completes and the server re-renders with new
  // searchParams. Without this, clicking a checkbox would visually revert
  // until then. useOptimistic shows the intended result immediately and
  // reconciles with `state.filters` once the real navigation resolves —
  // the same pattern CartView uses for cart mutations.
  const [optimisticFilters, applyOptimisticToggle] = useOptimistic(
    state.filters,
    (current: string[], input: string) => toggleFilterInput(current, input)
  );

  // Product type is surfaced separately as category pills above the grid —
  // drop it here so the same dimension isn't filterable in two places.
  const drawerFacets = facets.filter(
    (facet) => !facet.values.some((value) => isProductTypeFilterInput(value.input))
  );

  if (drawerFacets.length === 0) {
    return null;
  }

  function navigate(filters: string[]) {
    startTransition(() => {
      router.push(buildSearchHref(state, { filters }));
    });
  }

  function handleToggle(input: string) {
    startTransition(() => {
      applyOptimisticToggle(input);
      router.push(buildSearchHref(state, { filters: toggleFilterInput(optimisticFilters, input) }));
    });
  }

  const content = (
    <div className={`flex flex-col gap-6 ${isPending ? "opacity-60" : ""}`}>
      {drawerFacets.map((facet) =>
        facet.type === "PRICE_RANGE" ? (
          <PriceRangeFilter key={facet.id} facet={facet} state={state} navigate={navigate} />
        ) : (
          <fieldset key={facet.id} className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-text">{facet.label}</legend>
            <div className="flex flex-col gap-1">
              {facet.values.map((value) => (
                <label
                  key={value.id}
                  className="flex items-center justify-between gap-2 text-sm text-text"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={optimisticFilters.includes(value.input)}
                      onChange={() => handleToggle(value.input)}
                      className="h-4 w-4 accent-primary"
                    />
                    {value.label}
                  </span>
                  <span className="text-text/50">{value.count}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )
      )}
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Filter by availability and price"
        className="flex items-center gap-2 rounded-sm border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-text transition-colors hover:border-primary hover:text-primary"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        Filter
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-background/70"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col gap-4 overflow-y-auto bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-text">Filters</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close filters"
                className="text-lg text-text/60"
              >
                ×
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
