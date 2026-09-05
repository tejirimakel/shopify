"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";

import { removeCartLine, updateCartLineQuantity } from "@/lib/shopify/cart-actions";
import type { Cart, CartLine } from "@/lib/shopify/types";

import { CartLineGroup } from "./CartLineGroup";
import { CartSummary } from "./CartSummary";

type Action =
  | { type: "update"; lineId: string; quantity: number }
  | { type: "remove"; lineIds: string[] };

function reduceLines(lines: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "update":
      return lines.map((line) =>
        line.id === action.lineId
          ? {
              ...line,
              quantity: action.quantity,
              cost: {
                totalAmount: {
                  amount: (
                    Number(line.merchandise.price.amount) * action.quantity
                  ).toFixed(2),
                  currencyCode: line.merchandise.price.currencyCode,
                },
              },
            }
          : line
      );
    case "remove":
      return lines.filter((line) => !action.lineIds.includes(line.id));
  }
}

type LineGroup = { parent: CartLine; children: CartLine[] };

function groupLines(lines: CartLine[]): LineGroup[] {
  const childrenByParentId = new Map<string, CartLine[]>();
  for (const line of lines) {
    if (line.parentLineId) {
      childrenByParentId.set(line.parentLineId, [
        ...(childrenByParentId.get(line.parentLineId) ?? []),
        line,
      ]);
    }
  }

  const knownIds = new Set(lines.map((line) => line.id));
  const groups: LineGroup[] = [];
  for (const line of lines) {
    if (line.parentLineId === null) {
      groups.push({ parent: line, children: childrenByParentId.get(line.id) ?? [] });
    } else if (!knownIds.has(line.parentLineId)) {
      // Orphaned child (its parent line isn't present in this cart) — render
      // it standalone rather than silently hiding it.
      groups.push({ parent: line, children: [] });
    }
  }
  return groups;
}

export function CartView({ cart }: { cart: Cart }) {
  const [optimisticLines, applyOptimistic] = useOptimistic(cart.lines, reduceLines);
  const [isPending, startTransition] = useTransition();

  function handleUpdate(lineId: string, quantity: number, cascadeIds: string[] = []) {
    startTransition(async () => {
      if (quantity <= 0) {
        applyOptimistic({ type: "remove", lineIds: [lineId, ...cascadeIds] });
        await removeCartLine(lineId, cascadeIds);
        return;
      }
      applyOptimistic({ type: "update", lineId, quantity });
      await updateCartLineQuantity(lineId, quantity, cascadeIds);
    });
  }

  function handleRemove(lineId: string, cascadeIds: string[] = []) {
    startTransition(async () => {
      applyOptimistic({ type: "remove", lineIds: [lineId, ...cascadeIds] });
      await removeCartLine(lineId, cascadeIds);
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
