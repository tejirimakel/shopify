export default function Loading() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto grid max-w-6xl animate-pulse gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-12"
    >
      <div className="aspect-square rounded-lg border border-border bg-border/40" />
      <div className="flex flex-col gap-4">
        <div className="h-7 w-2/3 rounded bg-border/40" />
        <div className="h-5 w-1/3 rounded bg-border/40" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-border/40" />
          <div className="h-4 w-5/6 rounded bg-border/40" />
          <div className="h-4 w-3/4 rounded bg-border/40" />
        </div>
        <div className="h-10 w-40 rounded-md bg-border/40" />
        <div className="mt-4 h-12 w-40 rounded-md bg-border/40" />
      </div>
    </div>
  );
}
