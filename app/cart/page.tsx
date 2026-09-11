import type { Metadata } from "next";

import { ConfigErrorNotice } from "@/components/ConfigErrorNotice";
import { CartView } from "@/components/cart/CartView";
import { getCurrentCart } from "@/lib/shopify/cart-actions";
import { ShopifyConfigError, assertShopifyConfigured } from "@/lib/shopify/client";

export const metadata: Metadata = {
  title: "Cart",
};

export default async function CartPage() {
  let cart;
  try {
    // getCurrentCart() skips calling Shopify entirely when there's no cart
    // cookie yet, so a missing env var would otherwise go undetected on a
    // fresh visit. Check config explicitly so this page always surfaces it.
    assertShopifyConfigured();
    cart = await getCurrentCart();
  } catch (error) {
    // See app/products/page.tsx for why this check has to happen here
    // rather than in app/cart/error.tsx.
    if (error instanceof ShopifyConfigError) {
      return <ConfigErrorNotice />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-text">Cart</h1>
      <CartView
        cart={
          cart ?? {
            id: "",
            checkoutUrl: null,
            totalQuantity: 0,
            cost: {
              subtotalAmount: { amount: "0.00", currencyCode: "USD" },
              totalAmount: { amount: "0.00", currencyCode: "USD" },
            },
            lines: [],
          }
        }
      />
    </div>
  );
}
