import type { CartLine } from "@/lib/shopify/types";

import { CartLineRow } from "./CartLineRow";

export function CartLineGroup({
  group,
  disabled,
  errors,
  onUpdate,
  onRemove,
}: {
  group: { parent: CartLine; children: CartLine[] };
  disabled: boolean;
  errors: Record<string, string>;
  onUpdate: (lineId: string, quantity: number, cascadeIds?: string[]) => void;
  onRemove: (lineId: string, cascadeIds?: string[]) => void;
}) {
  const childIds = group.children.map((child) => child.id);

  return (
    <>
      <CartLineRow
        line={group.parent}
        disabled={disabled}
        error={errors[group.parent.id]}
        onUpdate={(id, quantity) => onUpdate(id, quantity, childIds)}
        onRemove={(id) => onRemove(id, childIds)}
      />
      {group.children.map((child) => (
        <CartLineRow
          key={child.id}
          line={child}
          disabled={disabled}
          error={errors[child.id]}
          indent
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
    </>
  );
}
