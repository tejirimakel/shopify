import { NextResponse } from "next/server";

import {
  ShopifyApiError,
  ShopifyConfigError,
  getProducts,
} from "@/lib/shopify/client";

export async function GET() {
  const mode = process.env.SHOPIFY_MOCK_DATA === "true" ? "mock" : "live";
  const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-01";
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN ?? null;

  try {
    const products = await getProducts();

    return NextResponse.json({
      ok: true,
      mode,
      apiVersion,
      storeDomain,
      productCount: products.length,
      products: products.map((product) => ({
        handle: product.handle,
        title: product.title,
        variantCount: product.variants.length,
        availableVariantCount: product.variants.filter(
          (variant) => variant.availableForSale
        ).length,
      })),
    });
  } catch (error) {
    const status =
      error instanceof ShopifyConfigError
        ? 503
        : error instanceof ShopifyApiError
          ? 503
          : 500;

    return NextResponse.json(
      {
        ok: false,
        mode,
        apiVersion,
        storeDomain,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status }
    );
  }
}
