import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SPECIAL_INSTRUCTIONS_ATTRIBUTE_KEY } from "./types";

// This file exercises the *real* Shopify fetch path, not the mock-data path.
// `USE_MOCK_DATA` is computed once, at module import time, from
// `process.env.SHOPIFY_MOCK_DATA` — and vitest.config.ts sets that env var
// to "true" for the whole test run. So we override it to "false" here,
// before the dynamic import below (the first import of this module in this
// file's module graph), to force every test in this file onto the real
// `shopifyFetch` path instead of the mock-data shortcuts.
process.env.SHOPIFY_MOCK_DATA = "false";

const {
  getProducts,
  getProduct,
  getCart,
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  ShopifyApiError,
  ShopifyConfigError,
} = await import("./client");

type FakeResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

function fakeResponse(
  body: unknown,
  init?: { ok?: boolean; status?: number }
): FakeResponse {
  return {
    ok: init?.ok ?? true,
    status: init?.status ?? 200,
    json: async () => body,
  };
}

function rawImage(seed: string) {
  return { url: `https://example.com/${seed}.jpg`, altText: seed, width: 10, height: 10 };
}

function rawVariant(id: string, price = "10.00") {
  return {
    id,
    title: "Default Title",
    availableForSale: true,
    price: { amount: price, currencyCode: "USD" },
    image: null,
    selectedOptions: [{ name: "Title", value: "Default Title" }],
  };
}

function rawProduct(overrides?: {
  addons?: { references: { nodes: unknown[] } } | null;
}) {
  return {
    id: "gid://shopify/Product/1",
    handle: "test-product",
    title: "Test Product",
    description: "A product.",
    descriptionHtml: "<p>A product.</p>",
    productType: "Widgets",
    availableForSale: true,
    options: [{ name: "Title", values: ["Default Title"] }],
    images: { edges: [{ node: rawImage("a") }, { node: rawImage("b") }] },
    variants: { edges: [{ node: rawVariant("gid://shopify/ProductVariant/1") }] },
    addons: overrides?.addons ?? null,
    priceRange: {
      minVariantPrice: { amount: "10.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "10.00", currencyCode: "USD" },
    },
  };
}

function rawCartLine(overrides: {
  id: string;
  merchandiseId: string;
  attributes?: { key: string; value: string }[];
  canRemove?: boolean;
  canUpdateQuantity?: boolean;
  parentId?: string | null;
}) {
  return {
    id: overrides.id,
    quantity: 1,
    cost: { totalAmount: { amount: "10.00", currencyCode: "USD" } },
    merchandise: {
      id: overrides.merchandiseId,
      title: "Default Title",
      price: { amount: "10.00", currencyCode: "USD" },
      image: null,
      product: { title: "Test Product", handle: "test-product" },
    },
    attributes: overrides.attributes ?? [],
    instructions: {
      canRemove: overrides.canRemove ?? true,
      canUpdateQuantity: overrides.canUpdateQuantity ?? true,
    },
    parentRelationship: overrides.parentId
      ? { parent: { id: overrides.parentId } }
      : null,
  };
}

function rawCart(lines: ReturnType<typeof rawCartLine>[]) {
  return {
    id: "gid://shopify/Cart/1",
    checkoutUrl: "https://example.com/checkout",
    totalQuantity: lines.length,
    cost: {
      subtotalAmount: { amount: "10.00", currencyCode: "USD" },
      totalAmount: { amount: "10.00", currencyCode: "USD" },
    },
    lines: { edges: lines.map((node) => ({ node })) },
  };
}

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env.SHOPIFY_STORE_DOMAIN = "test-shop.myshopify.com";
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "test-token";
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.unstubAllGlobals();
});

describe("ShopifyConfigError", () => {
  it("is thrown instead of calling fetch when SHOPIFY_STORE_DOMAIN is unset", async () => {
    delete process.env.SHOPIFY_STORE_DOMAIN;
    const fetchSpy = vi.fn(() =>
      Promise.reject(new Error("fetch should not have been called"))
    );
    vi.stubGlobal("fetch", fetchSpy);

    await expect(getProducts()).rejects.toBeInstanceOf(ShopifyConfigError);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("is thrown instead of calling fetch when SHOPIFY_STOREFRONT_ACCESS_TOKEN is unset", async () => {
    delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const fetchSpy = vi.fn(() =>
      Promise.reject(new Error("fetch should not have been called"))
    );
    vi.stubGlobal("fetch", fetchSpy);

    await expect(getProducts()).rejects.toBeInstanceOf(ShopifyConfigError);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("shopifyFetch error handling (via getProducts)", () => {
  it("throws ShopifyApiError when the network request itself rejects", async () => {
    const cause = new Error("DNS lookup failed");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(cause)
    );

    const error = await getProducts().catch((e) => e);
    expect(error).toBeInstanceOf(ShopifyApiError);
    expect(error.status).toBe(0);
    expect(error.cause).toBe(cause);
  });

  it("throws ShopifyApiError on a non-2xx HTTP response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(fakeResponse({}, { ok: false, status: 500 }))
    );

    const error = await getProducts().catch((e) => e);
    expect(error).toBeInstanceOf(ShopifyApiError);
    expect(error.status).toBe(500);
  });

  it("throws ShopifyApiError when the GraphQL response carries an errors array", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        fakeResponse({ errors: [{ message: "Field 'foo' doesn't exist" }] })
      )
    );

    const error = await getProducts().catch((e) => e);
    expect(error).toBeInstanceOf(ShopifyApiError);
    expect(error.message).toContain("Field 'foo' doesn't exist");
  });

  it("throws ShopifyApiError when the response has no data field", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(fakeResponse({})));

    const error = await getProducts().catch((e) => e);
    expect(error).toBeInstanceOf(ShopifyApiError);
    expect(error.message).toMatch(/no data/i);
  });
});

describe("normalizeProduct (via getProducts / getProduct)", () => {
  it("flattens image and variant connections into flat arrays", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        fakeResponse({ data: { products: { edges: [{ node: rawProduct() }] } } })
      )
    );

    const products = await getProducts();
    expect(products).toHaveLength(1);
    expect(products[0].images).toEqual([rawImage("a"), rawImage("b")]);
    expect(products[0].variants).toEqual([
      rawVariant("gid://shopify/ProductVariant/1"),
    ]);
  });

  it("flattens the addons connection and pulls productTitle off the nested product", async () => {
    const addonNode = {
      ...rawVariant("gid://shopify/ProductVariant/addon-1", "2.00"),
      product: { title: "Extra Rice" },
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        fakeResponse({
          data: {
            product: rawProduct({ addons: { references: { nodes: [addonNode] } } }),
          },
        })
      )
    );

    const product = await getProduct("test-product");
    expect(product?.addons).toEqual([
      { ...rawVariant("gid://shopify/ProductVariant/addon-1", "2.00"), productTitle: "Extra Rice" },
    ]);
  });

  it("defaults addons to an empty array when the addons field is null", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        fakeResponse({ data: { product: rawProduct({ addons: null }) } })
      )
    );

    const product = await getProduct("test-product");
    expect(product?.addons).toEqual([]);
  });

  it("returns null from getProduct when data.product is null", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(fakeResponse({ data: { product: null } }))
    );

    await expect(getProduct("missing")).resolves.toBeNull();
  });
});

describe("normalizeCart (via createCart / getCart)", () => {
  it("extracts parentLineId, canRemove/canUpdateQuantity, and specialInstructions", async () => {
    const parent = rawCartLine({
      id: "line-parent",
      merchandiseId: "gid://shopify/ProductVariant/1",
      canRemove: true,
      canUpdateQuantity: true,
      attributes: [
        { key: SPECIAL_INSTRUCTIONS_ATTRIBUTE_KEY, value: "no onions" },
        { key: "unrelated", value: "ignore me" },
      ],
    });
    const child = rawCartLine({
      id: "line-child",
      merchandiseId: "gid://shopify/ProductVariant/addon-1",
      canRemove: false,
      canUpdateQuantity: false,
      parentId: "line-parent",
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        fakeResponse({
          data: { cart: rawCart([parent, child]) },
        })
      )
    );

    const cart = await getCart("gid://shopify/Cart/1");
    const normalizedParent = cart?.lines.find((l) => l.id === "line-parent");
    const normalizedChild = cart?.lines.find((l) => l.id === "line-child");

    expect(normalizedParent?.parentLineId).toBeNull();
    expect(normalizedParent?.specialInstructions).toBe("no onions");
    expect(normalizedChild?.parentLineId).toBe("line-parent");
    expect(normalizedChild?.canRemove).toBe(false);
    expect(normalizedChild?.canUpdateQuantity).toBe(false);
    expect(normalizedChild?.specialInstructions).toBeNull();
  });

  it("returns null from getCart when data.cart is null (no exception thrown)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(fakeResponse({ data: { cart: null } }))
    );

    await expect(getCart("gid://shopify/Cart/missing")).resolves.toBeNull();
  });
});

describe("mutation userErrors handling", () => {
  it("createCart throws ShopifyApiError when cartCreate.userErrors is non-empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        fakeResponse({
          data: {
            cartCreate: {
              cart: rawCart([]),
              userErrors: [{ message: "Something went wrong" }],
            },
          },
        })
      )
    );

    const error = await createCart().catch((e) => e);
    expect(error).toBeInstanceOf(ShopifyApiError);
    expect(error.message).toContain("Something went wrong");
  });

  it("addCartLines throws ShopifyApiError when cartLinesAdd.userErrors is non-empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        fakeResponse({
          data: {
            cartLinesAdd: {
              cart: rawCart([]),
              userErrors: [{ message: "Variant not available" }],
            },
          },
        })
      )
    );

    const error = await addCartLines("gid://shopify/Cart/1", [
      { merchandiseId: "gid://shopify/ProductVariant/1", quantity: 1 },
    ]).catch((e) => e);
    expect(error).toBeInstanceOf(ShopifyApiError);
    expect(error.message).toContain("Variant not available");
  });

  it("updateCartLines throws ShopifyApiError when cartLinesUpdate.userErrors is non-empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        fakeResponse({
          data: {
            cartLinesUpdate: {
              cart: rawCart([]),
              userErrors: [{ message: "Line item quantity must be positive" }],
            },
          },
        })
      )
    );

    const error = await updateCartLines("gid://shopify/Cart/1", [
      { id: "line-1", quantity: 2 },
    ]).catch((e) => e);
    expect(error).toBeInstanceOf(ShopifyApiError);
    expect(error.message).toContain("Line item quantity must be positive");
  });

  it("removeCartLines throws ShopifyApiError when cartLinesRemove.userErrors is non-empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        fakeResponse({
          data: {
            cartLinesRemove: {
              cart: rawCart([]),
              userErrors: [{ message: "Line does not exist" }],
            },
          },
        })
      )
    );

    const error = await removeCartLines("gid://shopify/Cart/1", ["line-1"]).catch(
      (e) => e
    );
    expect(error).toBeInstanceOf(ShopifyApiError);
    expect(error.message).toContain("Line does not exist");
  });
});

describe("getCart's catch behavior", () => {
  it("rethrows ShopifyConfigError instead of swallowing it to null", async () => {
    delete process.env.SHOPIFY_STORE_DOMAIN;
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("fetch should not have been called")))
    );

    await expect(getCart("gid://shopify/Cart/1")).rejects.toBeInstanceOf(
      ShopifyConfigError
    );
  });

  it("swallows a genuine ShopifyApiError (e.g. a non-2xx response) into null", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(fakeResponse({}, { ok: false, status: 500 }))
    );

    await expect(getCart("gid://shopify/Cart/1")).resolves.toBeNull();
  });

  it("swallows a network-level fetch rejection (e.g. a stale/unreachable cart id) into null", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    await expect(getCart("gid://shopify/Cart/stale-id")).resolves.toBeNull();
  });
});
