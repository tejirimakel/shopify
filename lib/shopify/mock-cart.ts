import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { findMockVariant } from "./mock-data";
import {
  SPECIAL_INSTRUCTIONS_ATTRIBUTE_KEY,
  type Cart,
  type CartLine,
  type Money,
} from "./types";

// Mock mode runs without a real backend, and Next.js does not guarantee a
// plain in-memory module cache survives across route handlers / server
// components within the same request lifecycle. Persisting to a scratch
// file (see AGENTS.md's .tmp/ convention) keeps cart state consistent.
//
// Scoped by VITEST_WORKER_ID (set automatically by Vitest, unset otherwise)
// so test files that exercise this store don't race on the same file when
// Vitest runs multiple files in parallel — each worker gets its own store.
export const STORE_PATH = path.join(
  process.cwd(),
  ".tmp",
  process.env.VITEST_WORKER_ID
    ? `mock-carts.${process.env.VITEST_WORKER_ID}.json`
    : "mock-carts.json"
);

async function readStore(): Promise<Record<string, Cart>> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as Record<string, Cart>;
  } catch {
    return {};
  }
}

async function writeStore(store: Record<string, Cart>): Promise<void> {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}

function money(amount: number): Money {
  return { amount: amount.toFixed(2), currencyCode: "USD" };
}

function recalculate(cart: Cart): Cart {
  const totalQuantity = cart.lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.lines.reduce(
    (sum, line) => sum + Number(line.cost.totalAmount.amount),
    0
  );
  return {
    ...cart,
    totalQuantity,
    cost: {
      subtotalAmount: money(subtotal),
      totalAmount: money(subtotal),
    },
  };
}

export class MockCartError extends Error {}

export async function mockCreateCart(): Promise<Cart> {
  const store = await readStore();
  const cart: Cart = {
    id: `mock-cart-${randomUUID()}`,
    checkoutUrl: null,
    totalQuantity: 0,
    cost: {
      subtotalAmount: money(0),
      totalAmount: money(0),
    },
    lines: [],
  };
  store[cart.id] = cart;
  await writeStore(store);
  return cart;
}

export async function mockGetCart(cartId: string): Promise<Cart | null> {
  const store = await readStore();
  return store[cartId] ?? null;
}

export async function mockAddLines(
  cartId: string,
  lines: {
    merchandiseId: string;
    quantity: number;
    parent?: { merchandiseId?: string; lineId?: string };
    attributes?: { key: string; value: string }[];
  }[]
): Promise<Cart> {
  const store = await readStore();
  const cart = store[cartId];
  if (!cart) {
    throw new MockCartError(`No cart found for id ${cartId}`);
  }

  // Mirrors Shopify's real same-call grouping semantics: a child line's
  // `parent.merchandiseId` refers to a sibling being added in this same
  // call, whose line id doesn't exist until it's created below.
  const lineIdByMerchandiseId = new Map<string, string>();

  for (const { merchandiseId, quantity, parent, attributes } of lines) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new MockCartError(`Invalid quantity: ${quantity}`);
    }
    const found = findMockVariant(merchandiseId);
    if (!found) {
      throw new MockCartError(`No variant found for id ${merchandiseId}`);
    }
    const { product, variant } = found;

    const parentLineId =
      parent?.lineId ??
      (parent?.merchandiseId
        ? lineIdByMerchandiseId.get(parent.merchandiseId) ?? null
        : null);

    const existingLine = cart.lines.find(
      (line) =>
        line.merchandise.id === merchandiseId &&
        line.parentLineId === parentLineId
    );
    if (existingLine) {
      existingLine.quantity += quantity;
      existingLine.cost.totalAmount = money(
        Number(variant.price.amount) * existingLine.quantity
      );
      lineIdByMerchandiseId.set(merchandiseId, existingLine.id);
      continue;
    }

    const line: CartLine = {
      id: `mock-line-${randomUUID()}`,
      quantity,
      cost: { totalAmount: money(Number(variant.price.amount) * quantity) },
      merchandise: {
        id: variant.id,
        title: variant.title,
        price: variant.price,
        image: product.images[0] ?? null,
        product: { title: product.title, handle: product.handle },
      },
      parentLineId,
      canRemove: true,
      canUpdateQuantity: true,
      specialInstructions:
        attributes?.find(
          (attribute) => attribute.key === SPECIAL_INSTRUCTIONS_ATTRIBUTE_KEY
        )?.value ?? null,
    };
    cart.lines.push(line);
    lineIdByMerchandiseId.set(merchandiseId, line.id);
  }

  const updated = recalculate(cart);
  store[cartId] = updated;
  await writeStore(store);
  return updated;
}

export async function mockUpdateLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart> {
  const store = await readStore();
  const cart = store[cartId];
  if (!cart) {
    throw new MockCartError(`No cart found for id ${cartId}`);
  }

  for (const { id, quantity } of lines) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new MockCartError(
        `Invalid quantity: ${quantity} (use removeCartLines to remove a line)`
      );
    }
    const line = cart.lines.find((l) => l.id === id);
    if (!line) {
      throw new MockCartError(`No line found for id ${id}`);
    }
    line.quantity = quantity;
    line.cost.totalAmount = money(Number(line.merchandise.price.amount) * quantity);
  }

  const updated = recalculate(cart);
  store[cartId] = updated;
  await writeStore(store);
  return updated;
}

export async function mockRemoveLines(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const store = await readStore();
  const cart = store[cartId];
  if (!cart) {
    throw new MockCartError(`No cart found for id ${cartId}`);
  }
  cart.lines = cart.lines.filter((line) => !lineIds.includes(line.id));

  const updated = recalculate(cart);
  store[cartId] = updated;
  await writeStore(store);
  return updated;
}
