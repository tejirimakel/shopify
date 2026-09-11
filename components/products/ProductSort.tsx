import Link from "next/link";

import { SORT_OPTIONS, buildSearchHref, type ProductSearchState } from "@/lib/shopify/product-search";

export function ProductSort({ state }: { state: ProductSearchState }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <span className="font-medium text-text">Sort by</span>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {SORT_OPTIONS.map((option) => {
          const active = state.sort === option.value;
          return (
            <li key={option.value}>
              <Link
                href={buildSearchHref(state, { sort: option.value })}
                aria-current={active ? "true" : undefined}
                className={`flex min-h-11 items-center px-2 ${
                  active ? "font-medium text-primary" : "text-text/70 hover:text-text"
                }`}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
