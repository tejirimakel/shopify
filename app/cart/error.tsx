"use client";

export default function CartError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <h1 className="text-xl font-semibold text-text">We couldn&apos;t load your cart</h1>
      <p role="alert" className="max-w-md text-sm text-text/60">
        Something went wrong loading your cart. Please try again in a moment.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
