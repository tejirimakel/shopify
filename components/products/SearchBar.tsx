import type { ProductSearchState } from "@/lib/shopify/product-search";

export function SearchBar({ state }: { state: ProductSearchState }) {
  return (
    <form method="GET" action="/products" className="flex gap-2">
      {state.sort !== "featured" && <input type="hidden" name="sort" value={state.sort} />}
      {state.filters.map((filter) => (
        <input key={filter} type="hidden" name="filter" value={filter} />
      ))}
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        name="q"
        defaultValue={state.query}
        placeholder="Search products…"
        className="w-full max-w-sm rounded-md border border-border bg-surface px-3 py-2 text-sm text-text"
      />
      <button
        type="submit"
        className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text hover:border-primary"
      >
        Search
      </button>
    </form>
  );
}
