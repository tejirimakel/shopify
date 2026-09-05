"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
} from "./client";
import { SPECIAL_INSTRUCTIONS_ATTRIBUTE_KEY } from "./types";

const CART_COOKIE = "cartId";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function getOrCreateCartId(): Promise<string> {
  const cookieStore = await cookies();
  const existingId = cookieStore.get(CART_COOKIE)?.value;

  if (existingId) {
    const existingCart = await getCart(existingId);
    if (existingCart) {
      return existingId;
    }
  }

  const cart = await createCart();
  cookieStore.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
  return cart.id;
}

export type CartActionResult =
  | { success: true }
  | { success: false; error: string };

export async function addToCart(
  variantId: string,
  quantity = 1,
  addonVariantIds: string[] = [],
  specialInstructions?: string
): Promise<CartActionResult> {
  try {
    const cartId = await getOrCreateCartId();
    const trimmedInstructions = specialInstructions?.trim();
    const lines = [
      {
        merchandiseId: variantId,
        quantity,
        ...(trimmedInstructions
          ? {
              attributes: [
                { key: SPECIAL_INSTRUCTIONS_ATTRIBUTE_KEY, value: trimmedInstructions },
              ],
            }
          : {}),
      },
      ...addonVariantIds.map((id) => ({
        merchandiseId: id,
        quantity: 1,
        parent: { merchandiseId: variantId },
      })),
    ];
    await addCartLines(cartId, lines);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Couldn't add to cart.",
    };
  }
}

export async function updateCartLineQuantity(
  lineId: string,
  quantity: number,
  cascadeLineIds: string[] = []
): Promise<CartActionResult> {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE)?.value;
    if (!cartId) {
      return { success: false, error: "No cart found." };
    }

    if (quantity <= 0) {
      await removeCartLines(cartId, [lineId, ...cascadeLineIds]);
    } else {
      await updateCartLines(cartId, [{ id: lineId, quantity }]);
    }
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Couldn't update cart.",
    };
  }
}

export async function removeCartLine(
  lineId: string,
  cascadeLineIds: string[] = []
): Promise<CartActionResult> {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE)?.value;
    if (!cartId) {
      return { success: false, error: "No cart found." };
    }

    await removeCartLines(cartId, [lineId, ...cascadeLineIds]);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Couldn't remove item.",
    };
  }
}

export async function getCurrentCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) {
    return null;
  }
  return getCart(cartId);
}
