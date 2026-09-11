import { formatMoney } from "@/components/products/price";
import type { Money } from "@/lib/shopify/types";

export function CartSummary({
  subtotal,
  checkoutUrl,
}: {
  subtotal: Money;
  checkoutUrl: string | null;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-6">
      <div className="flex items-center justify-between text-base font-medium text-text">
        <span>Subtotal</span>
        <span aria-live="polite">{formatMoney(subtotal)}</span>
      </div>
      <p className="text-xs text-text/60">
        Shipping and taxes calculated at checkout.
      </p>
      {checkoutUrl ? (
        <a
          href={checkoutUrl}
          className="w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-background transition-colors hover:opacity-90"
        >
          Checkout
        </a>
      ) : (
        <div>
          <button
            disabled
            className="w-full cursor-not-allowed rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-background opacity-50"
          >
            Checkout
          </button>
          <p className="mt-2 text-xs text-text/60">
            Checkout will be available once this storefront is connected to a live Shopify store.
          </p>
        </div>
      )}
    </div>
  );
}
