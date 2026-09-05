import type { AddonVariant } from "@/lib/shopify/types";

import { formatMoney } from "./price";

export function AddonSelector({
  addons,
  selectedIds,
  onToggle,
}: {
  addons: AddonVariant[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  if (addons.length === 0) {
    return null;
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-text">Add-ons</legend>
      <div className="flex flex-col gap-2">
        {addons.map((addon) => (
          <label
            key={addon.id}
            className={`flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2 text-sm ${
              addon.availableForSale ? "text-text" : "text-text/40"
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(addon.id)}
                disabled={!addon.availableForSale}
                onChange={() => onToggle(addon.id)}
                className="h-4 w-4 accent-primary"
              />
              {addon.productTitle}
              {!addon.availableForSale && " (sold out)"}
            </span>
            <span>{formatMoney(addon.price)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
