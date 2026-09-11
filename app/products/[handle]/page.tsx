import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ConfigErrorNotice } from "@/components/ConfigErrorNotice";
import { ProductImage } from "@/components/products/ProductImage";
import { ProductOptions } from "@/components/products/ProductOptions";
import { ShopifyConfigError, getProduct } from "@/lib/shopify/client";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;

  try {
    const product = await getProduct(handle);

    if (!product) {
      return { title: "Product not found" };
    }

    return {
      title: product.title,
      description: product.description,
    };
  } catch {
    // Don't let a metadata failure preempt the page body's own error
    // handling below (which distinguishes config vs. API errors) — fall
    // back to a generic title and let the page body render the real UI.
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  let product;
  try {
    product = await getProduct(handle);
  } catch (error) {
    // See app/products/page.tsx for why this check has to happen here
    // (server-side, before crossing into a client error boundary) rather
    // than in app/products/error.tsx.
    if (error instanceof ShopifyConfigError) {
      return <ConfigErrorNotice />;
    }
    throw error;
  }

  if (!product) {
    notFound();
  }

  const image = product.images[0];

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-12">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface">
        <ProductImage src={image?.url} alt={image?.altText ?? product.title} priority />
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-text">{product.title}</h1>
        <div
          className="prose prose-sm max-w-none text-text/80"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
        <ProductOptions product={product} />
      </div>
    </div>
  );
}
