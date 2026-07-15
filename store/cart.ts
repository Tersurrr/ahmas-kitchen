"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

/** Cart lines are identified by product + selected option, so two options of the same product stay separate. */
function lineKey(menuItemId: string, optionId: string | null) {
  return `${menuItemId}::${optionId ?? "none"}`;
}

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  lastAdded: { name: string; token: number } | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string, optionId?: string | null) => void;
  increment: (menuItemId: string, optionId?: string | null) => void;
  decrement: (menuItemId: string, optionId?: string | null) => void;
  clear: () => void;
  subtotal: () => number;
  totalCount: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAdded: null,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (item) =>
        set((state) => {
          const key = lineKey(item.menuItemId, item.optionId ?? null);
          const existing = state.items.find(
            (i) => lineKey(i.menuItemId, i.optionId ?? null) === key
          );
          const lastAdded = { name: item.name, token: Date.now() };
          if (existing) {
            return {
              items: state.items.map((i) =>
                lineKey(i.menuItemId, i.optionId ?? null) === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              lastAdded,
            };
          }
          return { items: [...state.items, item], lastAdded };
        }),
      removeItem: (menuItemId, optionId = null) =>
        set((state) => ({
          items: state.items.filter(
            (i) => lineKey(i.menuItemId, i.optionId ?? null) !== lineKey(menuItemId, optionId)
          ),
        })),
      increment: (menuItemId, optionId = null) =>
        set((state) => ({
          items: state.items.map((i) =>
            lineKey(i.menuItemId, i.optionId ?? null) === lineKey(menuItemId, optionId)
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        })),
      decrement: (menuItemId, optionId = null) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              lineKey(i.menuItemId, i.optionId ?? null) === lineKey(menuItemId, optionId)
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "amahs-kitchen-cart",
      partialize: (state) => ({ items: state.items }),
      version: 2,
      migrate: (persisted) => {
        // v1 carts didn't have optionId; treat existing lines as option-less.
        const state = persisted as { items?: CartItem[] };
        if (state?.items) {
          state.items = state.items.map((i) => ({ ...i, optionId: i.optionId ?? null }));
        }
        return state as CartState;
      },
    }
  )
);
