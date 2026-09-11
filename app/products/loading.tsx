export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-text">All Products</h1>
      <ul
        aria-hidden="true"
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i} className="animate-pulse">
            <div className="aspect-square rounded-lg border border-border bg-border/40" />
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <div className="h-4 w-2/3 rounded bg-border/40" />
              <div className="h-4 w-1/4 rounded bg-border/40" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
