import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product not found",
};

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <h1 className="text-xl font-semibold text-text">Product not found</h1>
      <p className="max-w-md text-sm text-text/60">
        This product may have been removed or the link is incorrect.
      </p>
      <Link
        href="/products"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
      >
        Back to all products
      </Link>
    </div>
  );
}
