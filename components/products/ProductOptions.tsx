"use client";

import { useMemo, useState } from "react";

import type { Product, ProductVariant } from "@/lib/shopify/types";

import { AddonSelector } from "./AddonSelector";
import { AddToCartButton } from "./AddToCartButton";
import { VariantSelector } from "./VariantSelector";
import { formatMoney } from "./price";

function toOptionsMap(variant: ProductVariant): Record<string, string> {
  return Object.fromEntries(
    variant.selectedOptions.map(({ name, value }) => [name, value])
  );
}

function findMatchingVariant(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): ProductVariant | null {
  return (
    variants.find((variant) =>
      variant.selectedOptions.every(
        ({ name, value }) => selectedOptions[name] === value
      )
    ) ?? null
  );
}

export function ProductOptions({ product }: { product: Product }) {
  const initialVariant =
    product.variants.find((variant) => variant.availableForSale) ??
    product.variants[0] ??
    null;

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(initialVariant ? toOptionsMap(initialVariant) : {});

  const selectedVariant = useMemo(
    () => findMatchingVariant(product.variants, selectedOptions),
    [product.variants, selectedOptions]
  );

  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");

  const addonsTotal = useMemo(
    () =>
      product.addons
        .filter((addon) => selectedAddonIds.includes(addon.id))
        .reduce((sum, addon) => sum + Number(addon.price.amount), 0),
    [product.addons, selectedAddonIds]
  );

  const basePrice = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const totalPrice = {
    amount: (Number(basePrice.amount) + addonsTotal).toFixed(2),
    currencyCode: basePrice.currencyCode,
  };

  function handleSelect(optionName: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  }

  function handleToggleAddon(id: string) {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((addonId) => addonId !== id) : [...prev, id]
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg text-text/80">{formatMoney(totalPrice)}</p>
      <VariantSelector
        options={product.options}
        selectedOptions={selectedOptions}
        variants={product.variants}
        onSelect={handleSelect}
      />
      {!selectedVariant && (
        <p className="text-sm text-text/60">
          This combination is unavailable.
        </p>
      )}
      <AddonSelector
        addons={product.addons}
        selectedIds={selectedAddonIds}
        onToggle={handleToggleAddon}
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="special-instructions" className="text-sm font-medium text-text">
          Special instructions
        </label>
        <textarea
          id="special-instructions"
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          rows={2}
          placeholder="e.g. no onions, extra spicy"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text"
        />
      </div>
      <AddToCartButton
        variantId={selectedVariant?.id ?? null}
        availableForSale={!!selectedVariant?.availableForSale}
        addonVariantIds={selectedAddonIds}
        specialInstructions={instructions}
      />
    </div>
  );
}
