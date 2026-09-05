/** Cart line attribute key used to store a customer's per-item note. */
export const SPECIAL_INSTRUCTIONS_ATTRIBUTE_KEY = "Special instructions";

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  image: ShopifyImage | null;
  selectedOptions: { name: string; value: string }[];
};

/** A priced add-on: a real Shopify product variant, labeled by its parent product's title. */
export type AddonVariant = ProductVariant & { productTitle: string };

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  availableForSale: boolean;
  options: { name: string; values: string[] }[];
  images: ShopifyImage[];
  variants: ProductVariant[];
  addons: AddonVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
};

export type Connection<T> = {
  edges: { node: T }[];
};

export type ProductsQueryResponse = {
  products: Connection<Product>;
};

export type ProductQueryResponse = {
  product: Product | null;
};

export type ShopifyErrorLike = {
  status: number;
  message: string;
  cause?: unknown;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    price: Money;
    image: ShopifyImage | null;
    product: {
      title: string;
      handle: string;
    };
  };
  parentLineId: string | null;
  canRemove: boolean;
  canUpdateQuantity: boolean;
  specialInstructions: string | null;
};

export type Cart = {
  id: string;
  checkoutUrl: string | null;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: CartLine[];
};
