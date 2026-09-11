import Link from "next/link";

import { getCurrentCart } from "@/lib/shopify/cart-actions";

import { CartIndicator } from "./CartIndicator";
import { NavLink } from "./NavLink";
import Image from "next/image";

export async function Header() {
  const cart = await getCurrentCart();

  return (
    <header className="relative border-b border-border bg-surface">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Madhura Kitchen home">
         <Image src="/logoh2.png" alt="Madhura Kitchen Logo" width={100} height={100} className="h-12 w-auto" />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          <NavLink href="/" className="text-xs uppercase tracking-widest">
            Home
          </NavLink>
          <NavLink href="/products" className="text-xs uppercase tracking-widest">
            Menu
          </NavLink>
          <NavLink href="/contact" className="text-xs uppercase tracking-widest">
            Contact
          </NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="hidden rounded-sm bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:opacity-90 sm:inline-block"
          >
            Order Now
          </Link>
          <CartIndicator count={cart?.totalQuantity ?? 0} />
          <details className="group relative md:hidden">
            <summary
              aria-label="Open menu"
              className="flex h-11 w-11 list-none items-center justify-center rounded-md text-text transition-colors hover:bg-background hover:text-primary [&::-webkit-details-marker]:hidden"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute right-0 top-full z-20 mt-1 flex w-48 flex-col gap-1 rounded-md border border-border bg-surface p-2 shadow-lg"
            >
              <NavLink
                href="/"
                className="rounded-sm px-3 py-2 text-xs uppercase tracking-widest hover:bg-background"
              >
                Home
              </NavLink>
              <NavLink
                href="/products"
                className="rounded-sm px-3 py-2 text-xs uppercase tracking-widest hover:bg-background"
              >
                Menu
              </NavLink>
              <NavLink
                href="/contact"
                className="rounded-sm px-3 py-2 text-xs uppercase tracking-widest hover:bg-background"
              >
                Contact
              </NavLink>
              <Link
                href="/products"
                className="mt-1 rounded-sm bg-primary px-3 py-2 text-center text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:opacity-90"
              >
                Order Now
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
