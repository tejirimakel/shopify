import { getMockProduct, getMockProducts } from "./mock-data";
import {
  mockAddLines,
  mockCreateCart,
  mockGetCart,
  mockRemoveLines,
  mockUpdateLines,
} from "./mock-cart";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
} from "./mutations";
import { PRODUCT_QUERY, PRODUCTS_QUERY } from "./queries";
import {
  SPECIAL_INSTRUCTIONS_ATTRIBUTE_KEY,
  type AddonVariant,
  type Cart,
  type CartLine,
  type Connection,
  type Product,
  type ProductQueryResponse,
  type ProductsQueryResponse,
  type ShopifyErrorLike,
} from "./types";

const USE_MOCK_DATA = process.env.SHOPIFY_MOCK_DATA === "true";

const API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-01";

const PRODUCT_REVALIDATE_SECONDS = Number(
  process.env.SHOPIFY_REVALIDATE_SECONDS ?? 30
);

function getStoreDomain(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    throw new ShopifyConfigError("SHOPIFY_STORE_DOMAIN is not set");
  }
  return domain.startsWith("http") ? domain : `https://${domain}`;
}

function getStorefrontToken(): string {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!token) {
    throw new ShopifyConfigError(
      "SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set"
    );
  }
  return token;
}

export class ShopifyConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyConfigError";
  }
}

export class ShopifyApiError extends Error implements ShopifyErrorLike {
  status: number;
  cause?: unknown;

  constructor(message: string, status: number, cause?: unknown) {
    super(message);
    this.name = "ShopifyApiError";
    this.status = status;
    this.cause = cause;
  }
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

type ShopifyFetchOptions = {
  /** Seconds before this query is revalidated. Omit for no caching (e.g. cart mutations). */
  revalidateSeconds?: number;
  /** Cache tags for later `revalidateTag` calls. */
  tags?: string[];
};

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: ShopifyFetchOptions
): Promise<T> {
  const endpoint = `${getStoreDomain()}/api/${API_VERSION}/graphql.json`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": getStorefrontToken(),
      },
      body: JSON.stringify({ query, variables }),
      ...(options?.revalidateSeconds !== undefined
        ? { next: { revalidate: options.revalidateSeconds, tags: options.tags } }
        : { cache: "no-store" as const }),
    });
  } catch (cause) {
    throw new ShopifyApiError("Shopify API is unreachable", 0, cause);
  }

  if (!response.ok) {
    throw new ShopifyApiError(
      `Shopify API responded with ${response.status}`,
      response.status
    );
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new ShopifyApiError(
      json.errors.map((error) => error.message).join("; "),
      response.status
    );
  }

  if (!json.data) {
    throw new ShopifyApiError("Shopify API returned no data", response.status);
  }

  return json.data;
}

type RawAddonNode = Omit<AddonVariant, "productTitle"> & {
  product: { title: string };
};

type RawProduct = Omit<Product, "images" | "variants" | "addons"> & {
  images: Connection<Product["images"][number]>;
  variants: Connection<Product["variants"][number]>;
  addons: { references: { nodes: RawAddonNode[] } } | null;
};

function normalizeProduct(raw: RawProduct): Product {
  return {
    ...raw,
    images: raw.images.edges.map((edge) => edge.node),
    variants: raw.variants.edges.map((edge) => edge.node),
    addons: (raw.addons?.references?.nodes ?? []).map(
      ({ product, ...variant }) => ({
        ...variant,
        productTitle: product.title,
      })
    ),
  };
}

export async function getProducts(first = 20): Promise<Product[]> {
  if (USE_MOCK_DATA) {
    return getMockProducts().slice(0, first);
  }
  const data = await shopifyFetch<{ products: Connection<RawProduct> }>(
    PRODUCTS_QUERY,
    { first },
    { revalidateSeconds: PRODUCT_REVALIDATE_SECONDS, tags: ["products"] }
  );
  return data.products.edges.map((edge) => normalizeProduct(edge.node));
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (USE_MOCK_DATA) {
    return getMockProduct(handle);
  }
  const data = await shopifyFetch<{ product: RawProduct | null }>(
    PRODUCT_QUERY,
    { handle },
    {
      revalidateSeconds: PRODUCT_REVALIDATE_SECONDS,
      tags: ["products", `product:${handle}`],
    }
  );
  return data.product ? normalizeProduct(data.product) : null;
}

type RawCartLine = Omit<
  CartLine,
  | "id"
  | "parentLineId"
  | "canRemove"
  | "canUpdateQuantity"
  | "specialInstructions"
> & {
  id: string;
  attributes: { key: string; value: string }[];
  instructions: { canRemove: boolean; canUpdateQuantity: boolean };
  parentRelationship: { parent: { id: string } } | null;
};
type RawCart = Omit<Cart, "lines"> & { lines: Connection<RawCartLine> };

function normalizeCart(raw: RawCart): Cart {
  return {
    ...raw,
    lines: raw.lines.edges.map((edge) => {
      const { attributes, instructions, parentRelationship, ...rest } =
        edge.node;
      return {
        ...rest,
        parentLineId: parentRelationship?.parent.id ?? null,
        canRemove: instructions.canRemove,
        canUpdateQuantity: instructions.canUpdateQuantity,
        specialInstructions:
          attributes.find(
            (attribute) => attribute.key === SPECIAL_INSTRUCTIONS_ATTRIBUTE_KEY
          )?.value ?? null,
      };
    }),
  };
}

export async function createCart(): Promise<Cart> {
  if (USE_MOCK_DATA) {
    return mockCreateCart();
  }
  const data = await shopifyFetch<{
    cartCreate: { cart: RawCart; userErrors: { message: string }[] };
  }>(CART_CREATE_MUTATION, { lines: [] });
  if (data.cartCreate.userErrors.length) {
    throw new ShopifyApiError(
      data.cartCreate.userErrors.map((e) => e.message).join("; "),
      200
    );
  }
  return normalizeCart(data.cartCreate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  if (USE_MOCK_DATA) {
    return mockGetCart(cartId);
  }
  try {
    const data = await shopifyFetch<{ cart: RawCart | null }>(CART_QUERY, {
      cartId,
    });
    return data.cart ? normalizeCart(data.cart) : null;
  } catch {
    // A stale, expired, or malformed cart id (e.g. left over from a
    // different backend or an old session) is not a real failure — it
    // just means there's no usable cart, which callers already handle.
    return null;
  }
}

export async function addCartLines(
  cartId: string,
  lines: {
    merchandiseId: string;
    quantity: number;
    parent?: { merchandiseId?: string; lineId?: string };
    attributes?: { key: string; value: string }[];
  }[]
): Promise<Cart> {
  if (USE_MOCK_DATA) {
    return mockAddLines(cartId, lines);
  }
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: RawCart; userErrors: { message: string }[] };
  }>(CART_LINES_ADD_MUTATION, { cartId, lines });
  if (data.cartLinesAdd.userErrors.length) {
    throw new ShopifyApiError(
      data.cartLinesAdd.userErrors.map((e) => e.message).join("; "),
      200
    );
  }
  return normalizeCart(data.cartLinesAdd.cart);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart> {
  if (USE_MOCK_DATA) {
    return mockUpdateLines(cartId, lines);
  }
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: RawCart; userErrors: { message: string }[] };
  }>(CART_LINES_UPDATE_MUTATION, { cartId, lines });
  if (data.cartLinesUpdate.userErrors.length) {
    throw new ShopifyApiError(
      data.cartLinesUpdate.userErrors.map((e) => e.message).join("; "),
      200
    );
  }
  return normalizeCart(data.cartLinesUpdate.cart);
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  if (USE_MOCK_DATA) {
    return mockRemoveLines(cartId, lineIds);
  }
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: RawCart; userErrors: { message: string }[] };
  }>(CART_LINES_REMOVE_MUTATION, { cartId, lineIds });
  if (data.cartLinesRemove.userErrors.length) {
    throw new ShopifyApiError(
      data.cartLinesRemove.userErrors.map((e) => e.message).join("; "),
      200
    );
  }
  return normalizeCart(data.cartLinesRemove.cart);
}

// Re-exported for callers that need the raw response shapes.
export type { ProductQueryResponse, ProductsQueryResponse };
