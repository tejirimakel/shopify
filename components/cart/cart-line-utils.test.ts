import { describe, expect, it } from "vitest";

import type { CartLine } from "@/lib/shopify/types";

import { groupLines, reduceLines } from "./cart-line-utils";

function makeLine(overrides: Partial<CartLine> & { id: string }): CartLine {
  return {
    quantity: 1,
    cost: { totalAmount: { amount: "10.00", currencyCode: "USD" } },
    merchandise: {
      id: `variant-${overrides.id}`,
      title: "Default Title",
      price: { amount: "10.00", currencyCode: "USD" },
      image: null,
      product: { title: "Test Product", handle: "test-product" },
    },
    parentLineId: null,
    canRemove: true,
    canUpdateQuantity: true,
    specialInstructions: null,
    ...overrides,
  };
}

describe("reduceLines", () => {
  it("updates the quantity and recomputes cost for the matching line", () => {
    const line = makeLine({
      id: "line-1",
      quantity: 1,
      cost: { totalAmount: { amount: "10.00", currencyCode: "USD" } },
      merchandise: {
        id: "variant-1",
        title: "Default Title",
        price: { amount: "10.00", currencyCode: "USD" },
        image: null,
        product: { title: "Test Product", handle: "test-product" },
      },
    });

    const result = reduceLines([line], { type: "update", lineId: "line-1", quantity: 3 });

    expect(result[0].quantity).toBe(3);
    expect(result[0].cost.totalAmount).toEqual({
      amount: "30.00",
      currencyCode: "USD",
    });
  });

  it("rounds the recomputed cost to two decimal places", () => {
    const line = makeLine({
      id: "line-1",
      merchandise: {
        id: "variant-1",
        title: "Default Title",
        price: { amount: "9.99", currencyCode: "USD" },
        image: null,
        product: { title: "Test Product", handle: "test-product" },
      },
    });

    const result = reduceLines([line], { type: "update", lineId: "line-1", quantity: 3 });

    expect(result[0].cost.totalAmount.amount).toBe("29.97");
  });

  it("does not touch an addon child line's cost when an unrelated line is updated", () => {
    const parent = makeLine({
      id: "parent-1",
      quantity: 1,
      parentLineId: null,
      merchandise: {
        id: "variant-parent",
        title: "Default Title",
        price: { amount: "10.00", currencyCode: "USD" },
        image: null,
        product: { title: "Entree", handle: "entree" },
      },
    });
    const child = makeLine({
      id: "child-1",
      quantity: 1,
      parentLineId: "parent-1",
      cost: { totalAmount: { amount: "3.00", currencyCode: "USD" } },
      merchandise: {
        id: "variant-addon",
        title: "Extra Rice",
        price: { amount: "3.00", currencyCode: "USD" },
        image: null,
        product: { title: "Addon", handle: "addon" },
      },
    });

    const result = reduceLines([parent, child], {
      type: "update",
      lineId: "parent-1",
      quantity: 4,
    });

    const resultParent = result.find((l) => l.id === "parent-1")!;
    const resultChild = result.find((l) => l.id === "child-1")!;

    expect(resultParent.quantity).toBe(4);
    expect(resultParent.cost.totalAmount.amount).toBe("40.00");
    // Unrelated child line is untouched — same object reference, same values.
    expect(resultChild).toBe(child);
    expect(resultChild.quantity).toBe(1);
    expect(resultChild.cost.totalAmount.amount).toBe("3.00");
  });

  it("removes the given line ids and leaves the rest untouched", () => {
    const lineA = makeLine({ id: "line-a" });
    const lineB = makeLine({ id: "line-b" });
    const lineC = makeLine({ id: "line-c" });

    const result = reduceLines([lineA, lineB, lineC], {
      type: "remove",
      lineIds: ["line-b"],
    });

    expect(result.map((l) => l.id)).toEqual(["line-a", "line-c"]);
  });

  it("removes a parent together with its cascaded child ids", () => {
    const parent = makeLine({ id: "parent-1", parentLineId: null });
    const child = makeLine({ id: "child-1", parentLineId: "parent-1" });
    const other = makeLine({ id: "line-other" });

    const result = reduceLines([parent, child, other], {
      type: "remove",
      lineIds: ["parent-1", "child-1"],
    });

    expect(result.map((l) => l.id)).toEqual(["line-other"]);
  });
});

describe("groupLines", () => {
  it("groups a parent line with its addon children", () => {
    const parent = makeLine({ id: "parent-1", parentLineId: null });
    const child1 = makeLine({ id: "child-1", parentLineId: "parent-1" });
    const child2 = makeLine({ id: "child-2", parentLineId: "parent-1" });

    const groups = groupLines([parent, child1, child2]);

    expect(groups).toHaveLength(1);
    expect(groups[0].parent.id).toBe("parent-1");
    expect(groups[0].children.map((c) => c.id)).toEqual(["child-1", "child-2"]);
  });

  it("gives a standalone parent an empty children array", () => {
    const parent = makeLine({ id: "parent-1", parentLineId: null });

    const groups = groupLines([parent]);

    expect(groups).toEqual([{ parent, children: [] }]);
  });

  it("does not mix children between multiple parents", () => {
    const parentA = makeLine({ id: "parent-a", parentLineId: null });
    const childA = makeLine({ id: "child-a", parentLineId: "parent-a" });
    const parentB = makeLine({ id: "parent-b", parentLineId: null });
    const childB = makeLine({ id: "child-b", parentLineId: "parent-b" });

    const groups = groupLines([parentA, childA, parentB, childB]);

    expect(groups).toHaveLength(2);
    const groupA = groups.find((g) => g.parent.id === "parent-a")!;
    const groupB = groups.find((g) => g.parent.id === "parent-b")!;
    expect(groupA.children.map((c) => c.id)).toEqual(["child-a"]);
    expect(groupB.children.map((c) => c.id)).toEqual(["child-b"]);
  });

  it("renders an orphaned child (missing parent) standalone instead of hiding it", () => {
    const child = makeLine({ id: "child-1", parentLineId: "missing-parent" });

    const groups = groupLines([child]);

    expect(groups).toEqual([{ parent: child, children: [] }]);
  });
});
