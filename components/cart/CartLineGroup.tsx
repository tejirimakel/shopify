import type { CartLine } from "@/lib/shopify/types";

import { CartLineRow } from "./CartLineRow";

export function CartLineGroup({
  group,
  disabled,
  onUpdate,
  onRemove,
}: {
  group: { parent: CartLine; children: CartLine[] };
  disabled: boolean;
  onUpdate: (lineId: string, quantity: number, cascadeIds?: string[]) => void;
  onRemove: (lineId: string, cascadeIds?: string[]) => void;
}) {
  const childIds = group.children.map((child) => child.id);

  return (
    <>
      <CartLineRow
        line={group.parent}
        disabled={disabled}
        onUpdate={(id, quantity) => onUpdate(id, quantity, childIds)}
        onRemove={(id) => onRemove(id, childIds)}
      />
      {group.children.map((child) => (
        <CartLineRow
          key={child.id}
          line={child}
          disabled={disabled}
          indent
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
    </>
  );
}
