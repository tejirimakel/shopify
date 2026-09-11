"use client";

import { useRef } from "react";

import {
  isPriceFilter,
  parseActivePriceRange,
  type ProductSearchState,
} from "@/lib/shopify/product-search";
import type { ProductFacet } from "@/lib/shopify/types";

export function PriceRangeFilter({
  facet,
  state,
  navigate,
}: {
  facet: ProductFacet;
  state: ProductSearchState;
  navigate: (filters: string[]) => void;
}) {
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);

  function handleApplyPrice() {
    const withoutPrice = state.filters.filter((filter) => !isPriceFilter(filter));
    const minValue = minRef.current?.value;
    const maxValue = maxRef.current?.value;
    const min = minValue ? Number(minValue) : undefined;
    const max = maxValue ? Number(maxValue) : undefined;
    if (min === undefined && max === undefined) {
      navigate(withoutPrice);
      return;
    }
    const input = JSON.stringify({
      price: { ...(min !== undefined ? { min } : {}), ...(max !== undefined ? { max } : {}) },
    });
    navigate([...withoutPrice, input]);
  }

  const activeRange = parseActivePriceRange(state.filters);
  // Remounts the price inputs (resetting defaultValue) whenever the active filter set
  // changes externally, e.g. removing the price chip elsewhere on the page.
  const priceKey = state.filters.join("|");

  return (
    <fieldset key={`${facet.id}-${priceKey}`} className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-text">{facet.label}</legend>
      <div className="flex items-center gap-2">
        <input
          ref={minRef}
          type="number"
          inputMode="decimal"
          aria-label="Minimum price"
          defaultValue={activeRange?.min ?? ""}
          onBlur={handleApplyPrice}
          className="w-20 rounded-md border border-border bg-surface px-2 py-1 text-sm text-text"
        />
        <span className="text-text/60">–</span>
        <input
          ref={maxRef}
          type="number"
          inputMode="decimal"
          aria-label="Maximum price"
          defaultValue={activeRange?.max ?? ""}
          onBlur={handleApplyPrice}
          className="w-20 rounded-md border border-border bg-surface px-2 py-1 text-sm text-text"
        />
      </div>
    </fieldset>
  );
}
