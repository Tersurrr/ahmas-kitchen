import type { CartItem, MenuItem, MenuItemOption } from "@/lib/types";

/** Returns this item's options sorted for display, or an empty array if it has none. */
export function getSortedOptions(item: MenuItem): MenuItemOption[] {
  if (!item.menu_item_options || item.menu_item_options.length === 0) return [];
  return [...item.menu_item_options].sort((a, b) => a.sort_order - b.sort_order);
}

/** The option that should be pre-selected when a product card/modal first renders. */
export function getDefaultOption(item: MenuItem): MenuItemOption | null {
  const options = getSortedOptions(item);
  return options[0] ?? null;
}

/** The price to display for an item, given the currently selected option (if any). */
export function getDisplayPrice(item: MenuItem, selectedOption: MenuItemOption | null) {
  return selectedOption ? selectedOption.price : item.price;
}

/**
 * The lowest price across an item's options, for "From $X" style previews where no option
 * has been selected yet (e.g. compact list views). Falls back to the item's base price
 * when it has no options.
 */
export function getFromPrice(item: MenuItem) {
  const options = getSortedOptions(item);
  if (options.length === 0) return item.price;
  return Math.min(...options.map((o) => o.price));
}

/** The name to display/send to the cart & WhatsApp order, e.g. "Meat Pie - Medium". */
export function getDisplayName(item: MenuItem, selectedOption: MenuItemOption | null) {
  return selectedOption ? `${item.name} - ${selectedOption.name}` : item.name;
}

/** A stable, unique cart line key so different options of the same product don't merge. */
export function getCartItemId(item: MenuItem, selectedOption: MenuItemOption | null) {
  return selectedOption ? `${item.id}:${selectedOption.id}` : item.id;
}

/** Builds a complete CartItem for a given item/option/quantity selection. */
export function buildCartItem({
  item,
  selectedOption,
  quantity,
  image,
  specialInstructions,
}: {
  item: MenuItem;
  selectedOption: MenuItemOption | null;
  quantity: number;
  image?: string;
  specialInstructions?: string;
}): CartItem {
  return {
    cartItemId: getCartItemId(item, selectedOption),
    menuItemId: item.id,
    name: getDisplayName(item, selectedOption),
    price: getDisplayPrice(item, selectedOption),
    image,
    quantity,
    specialInstructions,
    optionId: selectedOption?.id,
    optionName: selectedOption?.name,
  };
}
