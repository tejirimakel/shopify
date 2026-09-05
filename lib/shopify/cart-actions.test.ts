import { rm } from "fs/promises";
import path from "path";

import { beforeEach, describe, expect, it, vi } from "vitest";

const MOCK_CART_STORE = path.join(process.cwd(), ".tmp", "mock-carts.json");

const cookieJar = new Map<string, string>();

vi.mock("next/cache", () => ({
  revalidatePath: () => {},
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => {
      const value = cookieJar.get(name);
      return value === undefined ? undefined : { value };
    },
    set: (name: string, value: string) => {
      cookieJar.set(name, value);
    },
  }),
}));

const { addToCart, updateCartLineQuantity, getCurrentCart } = await import(
  "./cart-actions"
);

const MOCK_VARIANT_ID = "gid://shopify/ProductVariant/mock-1-1";
const MOCK_ADDON_VARIANT_ID = "gid://shopify/ProductVariant/mock-addon-rice-1";

describe("cart-actions flow (mock mode)", () => {
  beforeEach(async () => {
    cookieJar.clear();
    await rm(MOCK_CART_STORE, { force: true });
  });

  it("adds to cart, increments quantity, then removes the line", async () => {
    const first = await addToCart(MOCK_VARIANT_ID, 1);
    expect(first).toEqual({ success: true });

    let cart = await getCurrentCart();
    expect(cart?.lines).toHaveLength(1);
    expect(cart?.lines[0].quantity).toBe(1);
    expect(cart?.lines[0].merchandise.id).toBe(MOCK_VARIANT_ID);

    const second = await addToCart(MOCK_VARIANT_ID, 1);
    expect(second).toEqual({ success: true });

    cart = await getCurrentCart();
    expect(cart?.lines).toHaveLength(1);
    expect(cart?.lines[0].quantity).toBe(2);

    const lineId = cart!.lines[0].id;
    const removed = await updateCartLineQuantity(lineId, 0);
    expect(removed).toEqual({ success: true });

    cart = await getCurrentCart();
    expect(cart?.lines).toHaveLength(0);
  });

  it("adds a parent line with an addon and links parentLineId", async () => {
    const result = await addToCart(MOCK_VARIANT_ID, 1, [MOCK_ADDON_VARIANT_ID]);
    expect(result).toEqual({ success: true });

    const cart = await getCurrentCart();
    expect(cart?.lines).toHaveLength(2);

    const parent = cart!.lines.find((l) => l.merchandise.id === MOCK_VARIANT_ID)!;
    const child = cart!.lines.find(
      (l) => l.merchandise.id === MOCK_ADDON_VARIANT_ID
    )!;
    expect(parent.parentLineId).toBeNull();
    expect(child.parentLineId).toBe(parent.id);
  });

  it("saves special instructions on the line they were added with", async () => {
    const result = await addToCart(
      MOCK_VARIANT_ID,
      1,
      [],
      "no onions, ring doorbell twice"
    );
    expect(result).toEqual({ success: true });

    const cart = await getCurrentCart();
    expect(cart?.lines[0].specialInstructions).toBe(
      "no onions, ring doorbell twice"
    );
  });
});
