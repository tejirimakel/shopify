"use client";

import { useState, useTransition } from "react";

import { addToCart } from "@/lib/shopify/cart-actions";

export function AddToCartButton({
  variantId,
  availableForSale,
  addonVariantIds = [],
  specialInstructions,
}: {
  variantId: string | null;
  availableForSale: boolean;
  addonVariantIds?: string[];
  specialInstructions?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "added" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!variantId) return;
    setStatus("idle");
    setError(null);
    startTransition(async () => {
      const result = await addToCart(
        variantId,
        1,
        addonVariantIds,
        specialInstructions
      );
      if (result.success) {
        setStatus("added");
      } else {
        setStatus("error");
        setError(result.error);
      }
    });
  }

  const label = !variantId
    ? "Select options"
    : !availableForSale
      ? "Sold out"
      : isPending
        ? "Adding..."
        : status === "added"
          ? "Added ✓"
          : "Add to cart";

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={!variantId || !availableForSale || isPending}
        className="mt-4 w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {label}
      </button>
      <p aria-live="polite" className="sr-only">
        {status === "added" ? "Added to cart" : ""}
      </p>
      {status === "error" && error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
