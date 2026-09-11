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

function simpleVariant(id: string, price: string, availableForSale = true) {
  return [
    {
      id,
      title: "Default Title",
      availableForSale,
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
    createdAt: "2024-01-01T00:00:00Z",
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
    createdAt: "2024-02-01T00:00:00Z",
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
    handle: "vegetable-samosas",
    title: "Vegetable Samosas",
    description:
      "Crisp pastry parcels filled with spiced potatoes and peas, served with tamarind chutney.",
    descriptionHtml:
      "<p>Crisp pastry parcels filled with spiced potatoes and peas, served with tamarind chutney.</p>",
    productType: "Starters & Street Food",
    availableForSale: true,
    createdAt: "2024-01-01T00:00:00Z",
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("samosas", "Vegetable Samosas")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-1-1", "8.00"),
    addons: [],
    priceRange: {
      minVariantPrice: money("8.00"),
      maxVariantPrice: money("8.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-2",
    handle: "masala-dosa",
    title: "Masala Dosa",
    description:
      "A crisp rice-and-lentil crepe filled with spiced potato masala, served with sambar and chutney.",
    descriptionHtml:
      "<p>A crisp rice-and-lentil crepe filled with spiced potato masala, served with sambar and chutney.</p>",
    productType: "Starters & Street Food",
    availableForSale: true,
    createdAt: "2024-02-01T00:00:00Z",
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("dosa", "Masala Dosa")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-2-1", "12.00"),
    addons: [],
    priceRange: {
      minVariantPrice: money("12.00"),
      maxVariantPrice: money("12.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-3",
    handle: "dhal-makhani",
    title: "Dhal Makhani",
    description:
      "Slow-cooked black lentils finished with cream, butter, and a hint of smoky spice.",
    descriptionHtml:
      "<p>Slow-cooked black lentils finished with cream, butter, and a hint of smoky spice.</p>",
    productType: "Mains",
    availableForSale: true,
    createdAt: "2024-03-01T00:00:00Z",
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("dhal", "Dhal Makhani")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-3-1", "18.00"),
    addons: addonsFor(MOCK_ADDON_PRODUCTS[0], MOCK_ADDON_PRODUCTS[1]),
    priceRange: {
      minVariantPrice: money("18.00"),
      maxVariantPrice: money("18.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-4",
    handle: "butter-chicken",
    title: "Butter Chicken",
    description:
      "Tender chicken simmered in a velvety tomato and butter gravy with warming spices.",
    descriptionHtml:
      "<p>Tender chicken simmered in a velvety tomato and butter gravy with warming spices.</p>",
    productType: "Mains",
    availableForSale: true,
    createdAt: "2024-04-01T00:00:00Z",
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("butter-chicken", "Butter Chicken")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-4-1", "24.00"),
    addons: addonsFor(MOCK_ADDON_PRODUCTS[0], MOCK_ADDON_PRODUCTS[1]),
    priceRange: {
      minVariantPrice: money("24.00"),
      maxVariantPrice: money("24.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-5",
    handle: "chicken-biryani",
    title: "Chicken Biryani",
    description:
      "Fragrant basmati rice layered with succulent chicken, saffron, and slow-cooked spices.",
    descriptionHtml:
      "<p>Fragrant basmati rice layered with succulent chicken, saffron, and slow-cooked spices.</p>",
    productType: "Mains",
    availableForSale: true,
    createdAt: "2024-05-01T00:00:00Z",
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("biryani", "Chicken Biryani")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-5-1", "26.00"),
    addons: addonsFor(MOCK_ADDON_PRODUCTS[0], MOCK_ADDON_PRODUCTS[1]),
    priceRange: {
      minVariantPrice: money("26.00"),
      maxVariantPrice: money("26.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-6",
    handle: "lamb-rogan-josh",
    title: "Lamb Rogan Josh",
    description:
      "Classic Kashmiri lamb curry cooked in a rich, onion-based sauce with ginger and garam masala.",
    descriptionHtml:
      "<p>Classic Kashmiri lamb curry cooked in a rich, onion-based sauce with ginger and garam masala.</p>",
    productType: "Mains",
    availableForSale: false,
    createdAt: "2024-06-01T00:00:00Z",
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("rogan-josh", "Lamb Rogan Josh")],
    variants: simpleVariant(
      "gid://shopify/ProductVariant/mock-6-1",
      "30.00",
      false
    ),
    addons: addonsFor(MOCK_ADDON_PRODUCTS[0], MOCK_ADDON_PRODUCTS[1]),
    priceRange: {
      minVariantPrice: money("30.00"),
      maxVariantPrice: money("30.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-7",
    handle: "gulab-jamun",
    title: "Gulab Jamun",
    description: "Soft milk-solid dumplings soaked in rose-scented sugar syrup.",
    descriptionHtml:
      "<p>Soft milk-solid dumplings soaked in rose-scented sugar syrup.</p>",
    productType: "Desserts",
    availableForSale: true,
    createdAt: "2024-07-01T00:00:00Z",
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("gulab-jamun", "Gulab Jamun")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-7-1", "8.00"),
    addons: [],
    priceRange: {
      minVariantPrice: money("8.00"),
      maxVariantPrice: money("8.00"),
    },
  },
  {
    id: "gid://shopify/Product/mock-8",
    handle: "saffron-kheer",
    title: "Saffron Kheer",
    description:
      "Creamy rice pudding slow-simmered with saffron, cardamom, and toasted nuts.",
    descriptionHtml:
      "<p>Creamy rice pudding slow-simmered with saffron, cardamom, and toasted nuts.</p>",
    productType: "Desserts",
    availableForSale: true,
    createdAt: "2024-08-01T00:00:00Z",
    options: SIMPLE_OPTIONS,
    images: [placeholderImage("kheer", "Saffron Kheer")],
    variants: simpleVariant("gid://shopify/ProductVariant/mock-8-1", "9.00"),
    addons: [],
    priceRange: {
      minVariantPrice: money("9.00"),
      maxVariantPrice: money("9.00"),
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
