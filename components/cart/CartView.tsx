"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";

import { removeCartLine, updateCartLineQuantity } from "@/lib/shopify/cart-actions";
import type { Cart } from "@/lib/shopify/types";

import { CartLineGroup } from "./CartLineGroup";
import {
  groupLines,
  reduceLines,
  withErrorFor,
  withoutErrorsFor,
  type LineErrors,
} from "./cart-line-utils";
import { CartSummary } from "./CartSummary";

export function CartView({ cart }: { cart: Cart }) {
  const [optimisticLines, applyOptimistic] = useOptimistic(cart.lines, reduceLines);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<LineErrors>({});

  function handleUpdate(lineId: string, quantity: number, cascadeIds: string[] = []) {
    setErrors((prev) => withoutErrorsFor(prev, [lineId, ...cascadeIds]));
    startTransition(async () => {
      if (quantity <= 0) {
        applyOptimistic({ type: "remove", lineIds: [lineId, ...cascadeIds] });
        const result = await removeCartLine(lineId, cascadeIds);
        if (!result.success) {
          setErrors((prev) => withErrorFor(prev, lineId, result.error));
        }
        return;
      }
      applyOptimistic({ type: "update", lineId, quantity });
      const result = await updateCartLineQuantity(lineId, quantity, cascadeIds);
      if (!result.success) {
        setErrors((prev) => withErrorFor(prev, lineId, result.error));
      }
    });
  }

  function handleRemove(lineId: string, cascadeIds: string[] = []) {
    setErrors((prev) => withoutErrorsFor(prev, [lineId, ...cascadeIds]));
    startTransition(async () => {
      applyOptimistic({ type: "remove", lineIds: [lineId, ...cascadeIds] });
      const result = await removeCartLine(lineId, cascadeIds);
      if (!result.success) {
        setErrors((prev) => withErrorFor(prev, lineId, result.error));
      }
    });
  }

  if (optimisticLines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-24 text-center">
        <p className="text-base font-medium text-text">Your cart is empty</p>
        <Link href="/products" className="text-sm font-medium text-primary hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  const subtotalAmount = optimisticLines.reduce(
    (sum, line) => sum + Number(line.cost.totalAmount.amount),
    0
  );

  const lineGroups = groupLines(optimisticLines);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <ul className="md:col-span-2">
        {lineGroups.map((group) => (
          <CartLineGroup
            key={group.parent.id}
            group={group}
            disabled={isPending}
            errors={errors}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
          />
        ))}
      </ul>
      <div className="md:col-span-1">
        <CartSummary
          subtotal={{
            amount: subtotalAmount.toFixed(2),
            currencyCode: cart.cost.subtotalAmount.currencyCode,
          }}
          checkoutUrl={cart.checkoutUrl}
        />
      </div>
    </div>
  );
}
