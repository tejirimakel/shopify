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
  searchProducts,
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

/** Stubs global fetch to resolve with a fake HTTP response carrying `body`. */
function stubFetchResolved(body: unknown, init?: { ok?: boolean; status?: number }) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(fakeResponse(body, init)));
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
  handle?: string;
  createdAt?: string;
}) {
  return {
    id: "gid://shopify/Product/1",
    handle: overrides?.handle ?? "test-product",
    title: "Test Product",
    description: "A product.",
    descriptionHtml: "<p>A product.</p>",
    productType: "Widgets",
    availableForSale: true,
    createdAt: overrides?.createdAt ?? "2024-01-01T00:00:00Z",
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

function rawSearchResult(nodes: ReturnType<typeof rawProduct>[]) {
  return {
    totalCount: nodes.length,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
    productFilters: [
      {
        id: "filter.v.availability",
        label: "Availability",
        type: "LIST",
        values: [
          { id: "a", label: "In stock", count: nodes.length, input: '{"available":true}' },
        ],
      },
    ],
    nodes,
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
    stubFetchResolved({}, { ok: false, status: 500 });

    const error = await getProducts().catch((e) => e);
    expect(error).toBeInstanceOf(ShopifyApiError);
    expect(error.status).toBe(500);
  });

  it("throws ShopifyApiError when the GraphQL response carries an errors array", async () => {
    stubFetchResolved({ errors: [{ message: "Field 'foo' doesn't exist" }] });

    const error = await getProducts().catch((e) => e);
    expect(error).toBeInstanceOf(ShopifyApiError);
    expect(error.message).toContain("Field 'foo' doesn't exist");
  });

  it("throws ShopifyApiError when the response has no data field", async () => {
    stubFetchResolved({});

    const error = await getProducts().catch((e) => e);
    expect(error).toBeInstanceOf(ShopifyApiError);
    expect(error.message).toMatch(/no data/i);
  });
});

describe("normalizeProduct (via getProducts / getProduct)", () => {
  it("flattens image and variant connections into flat arrays", async () => {
    stubFetchResolved({ data: { products: { edges: [{ node: rawProduct() }] } } });

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
    stubFetchResolved({
      data: {
        product: rawProduct({ addons: { references: { nodes: [addonNode] } } }),
      },
    });

    const product = await getProduct("test-product");
    expect(product?.addons).toEqual([
      { ...rawVariant("gid://shopify/ProductVariant/addon-1", "2.00"), productTitle: "Extra Rice" },
    ]);
  });

  it("defaults addons to an empty array when the addons field is null", async () => {
    stubFetchResolved({ data: { product: rawProduct({ addons: null }) } });

    const product = await getProduct("test-product");
    expect(product?.addons).toEqual([]);
  });

  it("returns null from getProduct when data.product is null", async () => {
    stubFetchResolved({ data: { product: null } });

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

    stubFetchResolved({ data: { cart: rawCart([parent, child]) } });

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
    stubFetchResolved({ data: { cart: null } });

    await expect(getCart("gid://shopify/Cart/missing")).resolves.toBeNull();
  });
});

describe("mutation userErrors handling", () => {
  it.each([
    {
      name: "createCart",
      field: "cartCreate",
      message: "Something went wrong",
      call: () => createCart(),
    },
    {
      name: "addCartLines",
      field: "cartLinesAdd",
      message: "Variant not available",
      call: () =>
        addCartLines("gid://shopify/Cart/1", [
          { merchandiseId: "gid://shopify/ProductVariant/1", quantity: 1 },
        ]),
    },
    {
      name: "updateCartLines",
      field: "cartLinesUpdate",
      message: "Line item quantity must be positive",
      call: () => updateCartLines("gid://shopify/Cart/1", [{ id: "line-1", quantity: 2 }]),
    },
    {
      name: "removeCartLines",
      field: "cartLinesRemove",
      message: "Line does not exist",
      call: () => removeCartLines("gid://shopify/Cart/1", ["line-1"]),
    },
  ])(
    "$name throws ShopifyApiError when $field.userErrors is non-empty",
    async ({ field, message, call }) => {
      stubFetchResolved({
        data: {
          [field]: { cart: rawCart([]), userErrors: [{ message }] },
        },
      });

      const error = await call().catch((e) => e);
      expect(error).toBeInstanceOf(ShopifyApiError);
      expect(error.message).toContain(message);
    }
  );
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
    stubFetchResolved({}, { ok: false, status: 500 });

    await expect(getCart("gid://shopify/Cart/1")).resolves.toBeNull();
  });

  it("swallows a network-level fetch rejection (e.g. a stale/unreachable cart id) into null", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    await expect(getCart("gid://shopify/Cart/stale-id")).resolves.toBeNull();
  });
});

describe("searchProducts", () => {
  it("returns products/totalCount/pageInfo/facets from the search response", async () => {
    const product = rawProduct();
    stubFetchResolved({ data: { search: rawSearchResult([product]) } });

    const result = await searchProducts({ query: "dosai" });

    expect(result.products).toHaveLength(1);
    expect(result.products[0].handle).toBe("test-product");
    expect(result.totalCount).toBe(1);
    expect(result.pageInfo).toEqual({
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    });
    expect(result.facets).toHaveLength(1);
    expect(result.facets[0].label).toBe("Availability");
  });

  it("sends '*' as the query when none is given (browse-all)", async () => {
    stubFetchResolved({ data: { search: rawSearchResult([rawProduct()]) } });

    await searchProducts({});

    const [, requestInit] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(requestInit.body as string);
    expect(body.variables.query).toBe("*");
  });

  it("drops a malformed filter string instead of throwing", async () => {
    stubFetchResolved({ data: { search: rawSearchResult([rawProduct()]) } });

    await searchProducts({ filters: ["not json", '{"available":true}'] });

    const [, requestInit] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(requestInit.body as string);
    expect(body.variables.productFilters).toEqual([{ available: true }]);
  });

  it("re-sorts the fetched page by createdAt descending when sort is 'newest'", async () => {
    const older = rawProduct({ handle: "older", createdAt: "2024-01-01T00:00:00Z" });
    const newer = rawProduct({ handle: "newer", createdAt: "2024-06-01T00:00:00Z" });
    stubFetchResolved({ data: { search: rawSearchResult([older, newer]) } });

    const result = await searchProducts({ sort: "newest" });

    expect(result.products.map((p) => p.handle)).toEqual(["newer", "older"]);
  });
});
