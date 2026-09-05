import type { LineErrors, LineGroup } from "./cart-line-utils";
import { CartLineRow } from "./CartLineRow";

export function CartLineGroup({
  group,
  disabled,
  errors,
  onUpdate,
  onRemove,
}: {
  group: LineGroup;
  disabled: boolean;
  errors: LineErrors;
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
