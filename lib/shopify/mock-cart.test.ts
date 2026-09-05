import { rm } from "fs/promises";
import path from "path";

import { beforeEach, describe, expect, it } from "vitest";

import {
  MockCartError,
  mockAddLines,
  mockCreateCart,
  mockRemoveLines,
  mockUpdateLines,
} from "./mock-cart";

const MOCK_CART_STORE = path.join(process.cwd(), ".tmp", "mock-carts.json");

// Real ids from lib/shopify/mock-data.ts.
const TOTE_VARIANT_ID = "gid://shopify/ProductVariant/mock-1-1"; // Canvas Tote Bag, $24.00
const RICE_ADDON_ID = "gid://shopify/ProductVariant/mock-addon-rice-1"; // Extra Rice, $2.00
const SAUCE_ADDON_ID = "gid://shopify/ProductVariant/mock-addon-sauce-1"; // Extra Sauce, $1.00
const UNKNOWN_VARIANT_ID = "gid://shopify/ProductVariant/does-not-exist";
const UNKNOWN_CART_ID = "mock-cart-does-not-exist";

beforeEach(async () => {
  await rm(MOCK_CART_STORE, { force: true });
});

describe("mockAddLines", () => {
  it("throws MockCartError for a non-integer quantity", async () => {
    const cart = await mockCreateCart();

    await expect(
      mockAddLines(cart.id, [{ merchandiseId: TOTE_VARIANT_ID, quantity: 1.5 }])
    ).rejects.toThrow(MockCartError);
  });

  it("throws MockCartError for a zero or negative quantity", async () => {
    const cart = await mockCreateCart();

    await expect(
      mockAddLines(cart.id, [{ merchandiseId: TOTE_VARIANT_ID, quantity: 0 }])
    ).rejects.toThrow(MockCartError);
    await expect(
      mockAddLines(cart.id, [{ merchandiseId: TOTE_VARIANT_ID, quantity: -1 }])
    ).rejects.toThrow(MockCartError);
  });

  it("throws MockCartError for a merchandise id with no matching mock variant", async () => {
    const cart = await mockCreateCart();

    await expect(
      mockAddLines(cart.id, [{ merchandiseId: UNKNOWN_VARIANT_ID, quantity: 1 }])
    ).rejects.toThrow(MockCartError);
  });

  it("throws MockCartError when the cart id does not exist", async () => {
    await expect(
      mockAddLines(UNKNOWN_CART_ID, [{ merchandiseId: TOTE_VARIANT_ID, quantity: 1 }])
    ).rejects.toThrow(MockCartError);
  });

  it("links same-call addon children to a sibling parent line created in the same call", async () => {
    const cart = await mockCreateCart();

    const updated = await mockAddLines(cart.id, [
      { merchandiseId: TOTE_VARIANT_ID, quantity: 1 },
      {
        merchandiseId: RICE_ADDON_ID,
        quantity: 1,
        parent: { merchandiseId: TOTE_VARIANT_ID },
      },
      {
        merchandiseId: SAUCE_ADDON_ID,
        quantity: 1,
        parent: { merchandiseId: TOTE_VARIANT_ID },
      },
    ]);

    expect(updated.lines).toHaveLength(3);
    const parent = updated.lines.find((l) => l.merchandise.id === TOTE_VARIANT_ID)!;
    const rice = updated.lines.find((l) => l.merchandise.id === RICE_ADDON_ID)!;
    const sauce = updated.lines.find((l) => l.merchandise.id === SAUCE_ADDON_ID)!;

    expect(parent.parentLineId).toBeNull();
    expect(rice.parentLineId).toBe(parent.id);
    expect(sauce.parentLineId).toBe(parent.id);
  });

  it("recalculates totalQuantity and cost after adding lines", async () => {
    const cart = await mockCreateCart();

    const updated = await mockAddLines(cart.id, [
      { merchandiseId: TOTE_VARIANT_ID, quantity: 2 },
    ]);

    expect(updated.totalQuantity).toBe(2);
    expect(updated.cost.totalAmount.amount).toBe("48.00");
  });
});

describe("mockUpdateLines", () => {
  it("throws MockCartError for a non-integer quantity", async () => {
    const cart = await mockCreateCart();
    const withLine = await mockAddLines(cart.id, [
      { merchandiseId: TOTE_VARIANT_ID, quantity: 1 },
    ]);
    const lineId = withLine.lines[0].id;

    await expect(
      mockUpdateLines(cart.id, [{ id: lineId, quantity: 1.5 }])
    ).rejects.toThrow(MockCartError);
  });

  it("throws MockCartError for a negative quantity", async () => {
    const cart = await mockCreateCart();
    const withLine = await mockAddLines(cart.id, [
      { merchandiseId: TOTE_VARIANT_ID, quantity: 1 },
    ]);
    const lineId = withLine.lines[0].id;

    await expect(
      mockUpdateLines(cart.id, [{ id: lineId, quantity: -1 }])
    ).rejects.toThrow(MockCartError);
  });

  it("throws MockCartError for a line id that doesn't exist in the cart", async () => {
    const cart = await mockCreateCart();

    await expect(
      mockUpdateLines(cart.id, [{ id: "nonexistent-line", quantity: 2 }])
    ).rejects.toThrow(MockCartError);
  });

  it("throws MockCartError when the cart id does not exist", async () => {
    await expect(
      mockUpdateLines(UNKNOWN_CART_ID, [{ id: "some-line", quantity: 2 }])
    ).rejects.toThrow(MockCartError);
  });

  it("updates the line quantity and recalculates cost", async () => {
    const cart = await mockCreateCart();
    const withLine = await mockAddLines(cart.id, [
      { merchandiseId: TOTE_VARIANT_ID, quantity: 1 },
    ]);
    const lineId = withLine.lines[0].id;

    const updated = await mockUpdateLines(cart.id, [{ id: lineId, quantity: 3 }]);

    expect(updated.lines[0].quantity).toBe(3);
    expect(updated.lines[0].cost.totalAmount.amount).toBe("72.00");
    expect(updated.totalQuantity).toBe(3);
    expect(updated.cost.totalAmount.amount).toBe("72.00");
  });
});

describe("mockRemoveLines", () => {
  it("throws MockCartError when the cart id does not exist", async () => {
    await expect(mockRemoveLines(UNKNOWN_CART_ID, ["some-line"])).rejects.toThrow(
      MockCartError
    );
  });

  it("removes the given lines and recalculates totals", async () => {
    const cart = await mockCreateCart();
    const withLines = await mockAddLines(cart.id, [
      { merchandiseId: TOTE_VARIANT_ID, quantity: 1 },
      { merchandiseId: RICE_ADDON_ID, quantity: 1 },
    ]);
    const toteLineId = withLines.lines.find(
      (l) => l.merchandise.id === TOTE_VARIANT_ID
    )!.id;

    const updated = await mockRemoveLines(cart.id, [toteLineId]);

    expect(updated.lines).toHaveLength(1);
    expect(updated.lines[0].merchandise.id).toBe(RICE_ADDON_ID);
    expect(updated.totalQuantity).toBe(1);
    expect(updated.cost.totalAmount.amount).toBe("2.00");
  });
});
