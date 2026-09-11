import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
        Everything you need, in one shop.
      </h1>
      <p className="max-w-md text-base text-text/70">
        A small, curated collection — built as a proof of concept for a headless
        Shopify storefront.
      </p>
      <Link
        href="/products"
        className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
      >
        Shop all products
      </Link>
    </div>
  );
}
