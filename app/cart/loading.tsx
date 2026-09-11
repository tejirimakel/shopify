export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-text">Cart</h1>
      <div aria-hidden="true" className="grid animate-pulse gap-8 md:grid-cols-3">
        <ul className="md:col-span-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <li
              key={i}
              className="flex gap-4 border-b border-border py-6 first:pt-0 last:border-b-0"
            >
              <div className="h-24 w-24 flex-shrink-0 rounded-md border border-border bg-border/40" />
              <div className="flex flex-1 flex-col justify-between gap-2">
                <div className="h-4 w-1/2 rounded bg-border/40" />
                <div className="h-8 w-24 rounded bg-border/40" />
              </div>
            </li>
          ))}
        </ul>
        <div className="md:col-span-1">
          <div className="flex flex-col gap-4 border-t border-border pt-6">
            <div className="h-5 w-full rounded bg-border/40" />
            <div className="h-12 w-full rounded-md bg-border/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
