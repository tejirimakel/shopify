import type { Product } from "./types";

function money(amount: string): Product["priceRange"]["minVariantPrice"] {
  return { amount, currencyCode: "USD" };
}

function placeholderImage(seed: string, alt: string) {
  return {
    url: `https://picsum.photos/seed/${seed}/800/800`,
    altText: alt,
    width: 800,
    height: 800,
  };
}

function simpleVariant(id: string, price: string) {
  return [
    {
      id,
      title: "Default Title",
      availableForSale: true,
      price: money(price),
      image: null,
      selectedOptions: [{ name: "Title", value: "Default Title" }],
    },
  ];
}

const SIMPLE_OPTIONS = [{ name: "Title", values: ["Default Title"] }];

// Mock add-on "products" — lookup targets only, not exposed via
// getMockProducts/getMockProduct, mirroring how real add-ons are real
// Shopify products/variants that just happen not to appear in the catalog grid.
export const MOCK_ADDON_PRODUCTS: Product[] = [
  {
    id: "gid://shopify/Product/mock-addon-rice",
    handle: "extra-rice",
    title: "Extra Rice",
    description: "An extra portion of steamed rice.",
    descriptionHtml: "<p>An extra portion of steamed rice.</p>",
    productType: "Add-on",
    availableForSale: true,
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("extra-rice", "Extra Rice")],
    variants: simpleVariant(
      "gid://shopify/ProductVariant/mock-addon-rice-1",
      "2.00"
    ),
    addons: [],
    priceRange: {
      minVariantPrice: money("2.00"),
      maxVariantPrice: money("2.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-addon-sauce",
    handle: "extra-sauce",
    title: "Extra Sauce",
    description: "An extra side of sauce.",
    descriptionHtml: "<p>An extra side of sauce.</p>",
    productType: "Add-on",
    availableForSale: true,
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("extra-sauce", "Extra Sauce")],
    variants: simpleVariant(
      "gid://shopify/ProductVariant/mock-addon-sauce-1",
      "1.00"
    ),
    addons: [],
    priceRange: {
      minVariantPrice: money("1.00"),
      maxVariantPrice: money("1.00"),
    },
  },
];

function addonsFor(...products: Product[]) {
  return products.map((product) => ({
    ...product.variants[0],
    productTitle: product.title,
  }));
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "gid://shopify/Product/mock-1",
    handle: "canvas-tote-bag",
    title: "Canvas Tote Bag",
    description: "A durable canvas tote bag for everyday errands.",
    descriptionHtml:
      "<p>A durable canvas tote bag for everyday errands.</p>",
    productType: "Bags",
    availableForSale: true,
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("tote", "Canvas Tote Bag")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-1-1", "24.00"),
    addons: addonsFor(MOCK_ADDON_PRODUCTS[0], MOCK_ADDON_PRODUCTS[1]),
    priceRange: {
      minVariantPrice: money("24.00"),
      maxVariantPrice: money("24.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-2",
    handle: "ceramic-mug",
    title: "Ceramic Mug",
    description: "A hand-glazed ceramic mug that keeps drinks warm longer.",
    descriptionHtml:
      "<p>A hand-glazed ceramic mug that keeps drinks warm longer.</p>",
    productType: "Home",
    availableForSale: true,
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("mug", "Ceramic Mug")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-2-1", "18.00"),
    addons: addonsFor(MOCK_ADDON_PRODUCTS[0], MOCK_ADDON_PRODUCTS[1]),
    priceRange: {
      minVariantPrice: money("18.00"),
      maxVariantPrice: money("18.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-3",
    handle: "wool-beanie",
    title: "Wool Beanie",
    description: "A soft wool beanie for cold mornings.",
    descriptionHtml: "<p>A soft wool beanie for cold mornings.</p>",
    productType: "Apparel",
    availableForSale: true,
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("beanie", "Wool Beanie")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-3-1", "22.00"),
    addons: [],
    priceRange: {
      minVariantPrice: money("22.00"),
      maxVariantPrice: money("22.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-4",
    handle: "leather-notebook",
    title: "Leather Notebook",
    description: "A refillable leather notebook with 120 lined pages.",
    descriptionHtml:
      "<p>A refillable leather notebook with 120 lined pages.</p>",
    productType: "Stationery",
    availableForSale: true,
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("notebook", "Leather Notebook")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-4-1", "32.00"),
    addons: [],
    priceRange: {
      minVariantPrice: money("32.00"),
      maxVariantPrice: money("32.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-5",
    handle: "scented-candle",
    title: "Scented Candle",
    description: "A soy wax candle with a 40-hour burn time.",
    descriptionHtml: "<p>A soy wax candle with a 40-hour burn time.</p>",
    productType: "Home",
    availableForSale: true,
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("candle", "Scented Candle")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-5-1", "16.00"),
    addons: [],
    priceRange: {
      minVariantPrice: money("16.00"),
      maxVariantPrice: money("16.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-6",
    handle: "stainless-water-bottle",
    title: "Stainless Water Bottle",
    description: "A double-walled bottle that keeps drinks cold for 24 hours.",
    descriptionHtml:
      "<p>A double-walled bottle that keeps drinks cold for 24 hours.</p>",
    productType: "Accessories",
    availableForSale: true,
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("bottle", "Stainless Water Bottle")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-6-1", "28.00"),
    addons: [],
    priceRange: {
      minVariantPrice: money("28.00"),
      maxVariantPrice: money("28.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-7",
    handle: "linen-throw-pillow",
    title: "Linen Throw Pillow",
    description: "A washed-linen pillow cover with a hidden zip closure.",
    descriptionHtml:
      "<p>A washed-linen pillow cover with a hidden zip closure.</p>",
    productType: "Home",
    availableForSale: true,
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("pillow", "Linen Throw Pillow")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-7-1", "34.00"),
    addons: [],
    priceRange: {
      minVariantPrice: money("34.00"),
      maxVariantPrice: money("34.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-8",
    handle: "sunglasses",
    title: "Polarized Sunglasses",
    description: "UV400 polarized sunglasses with an acetate frame.",
    descriptionHtml:
      "<p>UV400 polarized sunglasses with an acetate frame.</p>",
    productType: "Accessories",
    availableForSale: true,
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("sunglasses", "Polarized Sunglasses")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-8-1", "45.00"),
    addons: [],
    priceRange: {
      minVariantPrice: money("45.00"),
      maxVariantPrice: money("45.00"),
    },
  },
];

export function getMockProducts(): Product[] {
  return MOCK_PRODUCTS;
}

export function getMockProduct(handle: string): Product | null {
  return MOCK_PRODUCTS.find((product) => product.handle === handle) ?? null;
}

export function findMockVariant(
  variantId: string
): { product: Product; variant: Product["variants"][number] } | null {
  for (const product of [...MOCK_PRODUCTS, ...MOCK_ADDON_PRODUCTS]) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) {
      return { product, variant };
    }
  }
  return null;
}
