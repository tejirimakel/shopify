import type { Metadata } from "next";

import { CartView } from "@/components/cart/CartView";
import { getCurrentCart } from "@/lib/shopify/cart-actions";

export const metadata: Metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const cart = await getCurrentCart();

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
