import type { ProductVariant } from "@/lib/shopify/types";

function isValueAvailable(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>,
  optionName: string,
  value: string
): boolean {
  const candidate = { ...selectedOptions, [optionName]: value };
  return variants.some(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.every(
        ({ name, value: v }) => candidate[name] === v
      )
  );
}

export function VariantSelector({
  options,
  selectedOptions,
  variants,
  onSelect,
}: {
  options: { name: string; values: string[] }[];
  selectedOptions: Record<string, string>;
  variants: ProductVariant[];
  onSelect: (optionName: string, value: string) => void;
}) {
  if (options.length === 0 || (options.length === 1 && options[0].values.length <= 1)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => (
        <fieldset key={option.name} className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-text">
            {option.name}
          </legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const selected = selectedOptions[option.name] === value;
              const available = isValueAvailable(
                variants,
                selectedOptions,
                option.name,
                value
              );

              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  aria-label={available ? value : `${value} (sold out)`}
                  onClick={() => onSelect(option.name, value)}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                    selected
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface text-text hover:border-primary"
                  } ${available ? "" : "opacity-50"}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
