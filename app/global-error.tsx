"use client";

import "./globals.css";

// error.tsx does not wrap the root layout itself (app/layout.tsx) — only its
// children. An error thrown while rendering the root layout (e.g. the
// Header's cart fetch in components/layout/Header.tsx) bypasses app/error.tsx
// entirely and needs this file instead. It must render its own <html>/<body>
// since it replaces the root layout when active.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-full bg-background text-text antialiased">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
          <h1 className="text-xl font-semibold text-text">
            Something went wrong
          </h1>
          <p className="max-w-md text-sm text-text/60">
            We hit an unexpected error. Please try again in a moment.
          </p>
          <button
            onClick={reset}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
