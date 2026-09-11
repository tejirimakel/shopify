import Link from "next/link";

import { getCurrentCart } from "@/lib/shopify/cart-actions";

import { CartIndicator } from "./CartIndicator";
import { NavLink } from "./NavLink";

export async function Header() {
  const cart = await getCurrentCart();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-text">
          Shop
        </Link>
        <nav aria-label="Main" className="flex items-center gap-6">
          <NavLink href="/products">All Products</NavLink>
          <CartIndicator count={cart?.totalQuantity ?? 0} />
        </nav>
      </div>
    </header>
  );
}
