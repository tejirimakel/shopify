"use client";

import { ErrorNotice } from "@/components/ErrorNotice";

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
        <ErrorNotice reset={reset} />
      </body>
    </html>
  );
}
