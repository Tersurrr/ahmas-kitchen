import type { MenuItem, MenuItemOption } from "@/lib/types";

/** Options sorted for display (by sort_order, stable). */
export function sortedOptions(item: Pick<MenuItem, "menu_item_options">): MenuItemOption[] {
  return [...(item.menu_item_options || [])].sort((a, b) => a.sort_order - b.sort_order);
}

/** The option shown on the product card / used as the default selection in the modal. */
export function getDefaultOption(item: Pick<MenuItem, "menu_item_options">): MenuItemOption | null {
  const options = sortedOptions(item);
  if (options.length === 0) return null;
  return options.find((o) => o.is_default) || options[0];
}

/** The price to show on a product card: default option price if options exist, else the base price. */
export function getDisplayPrice(item: Pick<MenuItem, "price" | "menu_item_options">): number {
  const defaultOption = getDefaultOption(item);
  return defaultOption ? defaultOption.price : item.price;
}

/** Whether the shopper needs to make an explicit choice (2+ options) before adding to cart. */
export function requiresOptionSelection(item: Pick<MenuItem, "menu_item_options">): boolean {
  return sortedOptions(item).length > 1;
}
