import type { CartLine } from "@/lib/shopify/types";

export type CartLineAction =
  | { type: "update"; lineId: string; quantity: number }
  | { type: "remove"; lineIds: string[] };

/**
 * Pure reducer used to drive the cart's optimistic UI state (see
 * `useOptimistic` in CartView). Given the current lines and an action,
 * returns the new lines the UI should show immediately, before the server
 * action has resolved.
 */
export function reduceLines(lines: CartLine[], action: CartLineAction): CartLine[] {
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

export type LineGroup = { parent: CartLine; children: CartLine[] };

/**
 * Groups flat cart lines into parent/addon-child groups for rendering.
 * A line with `parentLineId: null` is a top-level parent; lines that
 * reference it via `parentLineId` are rendered nested under it. A child
 * whose parent line is missing from the cart (orphaned) is rendered
 * standalone rather than silently hidden.
 */
export function groupLines(lines: CartLine[]): LineGroup[] {
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
