"use client";

import Link from "next/link";
import type { Category, MenuItem } from "@/lib/types";
import { formatCurrency } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";

export default function HomeMenu({ categories, items }: { categories: Category[]; items: MenuItem[] }) {
  const addItem = useCart((state) => state.addItem);
  if (items.length === 0) return null;

  const sections = categories
    .map((category) => ({ category, items: items.filter((item) => item.category_id === category.id) }))
    .filter((section) => section.items.length > 0);
  const categorizedItemIds = new Set(sections.flatMap((section) => section.items.map((item) => item.id)));
  const remainingItems = items.filter((item) => !categorizedItemIds.has(item.id));
  if (remainingItems.length > 0) {
    sections.push({
      category: { id: "other-menu-items", name: "More from the Menu", slug: "more", sort_order: Number.MAX_SAFE_INTEGER },
      items: remainingItems,
    });
  }

  return (
    <section id="menu" className="max-w-container-max mx-auto px-4 py-section-gap md:px-gutter">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-secondary">Order with ease</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">Menu</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Choose a meal and add it to your cart in one tap.</p>
        </div>
        <Link href="/menu" className="shrink-0 text-sm font-semibold text-primary underline underline-offset-4 hover:text-secondary">View details →</Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ category, items: categoryItems }) => (
          <section key={category.id} aria-labelledby={`home-category-${category.id}`} className="rounded-xl bg-white p-5 shadow-soft">
            <div className="mb-3 flex items-center gap-3">
              <h3 id={`home-category-${category.id}`} className="font-display text-2xl font-bold text-primary">{category.name}</h3>
              <span className="h-px flex-1 bg-secondary/40" />
            </div>
            <ul className="divide-y divide-outline-variant/25">
              {categoryItems.slice(0, 3).map((item) => (
                <li key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 py-3 first:pt-1 last:pb-1">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-primary">{item.name}</p>
                    {item.description && <p className="mt-0.5 truncate text-xs text-on-surface-variant">{item.description}</p>}
                  </div>
                  <span className="shrink-0 whitespace-nowrap font-semibold text-primary">{formatCurrency(item.price)}</span>
                  <button
                    type="button"
                    disabled={!item.is_available}
                    aria-label={`Add ${item.name} to cart`}
                    onClick={() => addItem({ menuItemId: item.id, name: item.name, price: item.price, image: item.menu_images?.[0]?.url, quantity: 1 })}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-lg font-bold leading-none text-on-secondary transition-colors hover:bg-secondary-dark disabled:cursor-not-allowed disabled:bg-surface-container-high disabled:text-on-surface-variant"
                  >
                    {item.is_available ? "+" : "—"}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
