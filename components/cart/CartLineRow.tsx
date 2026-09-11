import Link from "next/link";

import { formatMoney } from "@/components/products/price";
import { ProductImage } from "@/components/products/ProductImage";
import type { CartLine } from "@/lib/shopify/types";

export function CartLineRow({
  line,
  disabled,
  error,
  indent = false,
  onUpdate,
  onRemove,
}: {
  line: CartLine;
  disabled: boolean;
  error?: string;
  indent?: boolean;
  onUpdate: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
}) {
  return (
    <li
      className={`flex flex-col gap-2 border-b border-border py-6 first:pt-0 last:border-b-0 ${
        indent ? "ml-8 py-3" : ""
      }`}
    >
      <div className="flex gap-4">
        <Link
          href={`/products/${line.merchandise.product.handle}`}
          className={`relative flex-shrink-0 overflow-hidden rounded-md border border-border bg-surface ${
            indent ? "h-14 w-14" : "h-24 w-24"
          }`}
        >
          <ProductImage
            src={line.merchandise.image?.url}
            alt={line.merchandise.image?.altText ?? line.merchandise.product.title}
            sizes={indent ? "56px" : "96px"}
          />
        </Link>

        <div className="flex flex-1 flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href={`/products/${line.merchandise.product.handle}`}
                className="text-sm font-medium text-text hover:text-primary"
              >
                {line.merchandise.product.title}
              </Link>
              {line.merchandise.title !== "Default Title" && (
                <p className="text-xs text-text/60">{line.merchandise.title}</p>
              )}
              {line.specialInstructions && (
                <p className="text-xs italic text-text/60">
                  Note: {line.specialInstructions}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-text">
                {formatMoney(line.cost.totalAmount)}
              </p>
              <p className="text-xs text-text/60">
                {formatMoney(line.merchandise.price)} each
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {line.canUpdateQuantity ? (
              <div className="flex items-center gap-2 rounded-md border border-border">
                <button
                  type="button"
                  aria-label={line.quantity === 1 ? "Remove item" : "Decrease quantity"}
                  disabled={disabled}
                  onClick={() => onUpdate(line.id, line.quantity - 1)}
                  className="flex h-11 w-11 items-center justify-center text-text disabled:opacity-50"
                >
                  −
                </button>
                <span aria-live="polite" className="w-6 text-center text-sm text-text">
                  {line.quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={disabled}
                  onClick={() => onUpdate(line.id, line.quantity + 1)}
                  className="flex h-11 w-11 items-center justify-center text-text disabled:opacity-50"
                >
                  +
                </button>
              </div>
            ) : (
              <span className="text-sm text-text/60">Qty {line.quantity}</span>
            )}
            {line.canRemove && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onRemove(line.id)}
                className="text-xs font-medium text-text/60 underline-offset-2 hover:text-error hover:underline disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
      {error && (
        <p role="alert" className="text-xs text-error">
          {error}
        </p>
      )}
    </li>
  );
}
