"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";
import { MAX_ITEM_QUANTITY, MAX_ORDER_LINES } from "@/lib/order-validation";

/** Cart lines are identified by product + selected option, so two options of the same product stay separate. */
function lineKey(menuItemId: string, optionId: string | null, specialInstructions?: string) {
  return JSON.stringify([menuItemId, optionId, specialInstructions?.trim() || ""]);
}

function lastAddedMessage(name: string, quantity: number) {
  return quantity === 1 ? `Added ${name} to cart` : `Added ${quantity} × ${name} to cart`;
}

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  lastAdded: { message: string; token: number; error?: boolean } | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string, optionId?: string | null, specialInstructions?: string) => void;
  increment: (menuItemId: string, optionId?: string | null, specialInstructions?: string) => void;
  decrement: (menuItemId: string, optionId?: string | null, specialInstructions?: string) => void;
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
          const key = lineKey(item.menuItemId, item.optionId ?? null, item.specialInstructions);
          const existing = state.items.find(
            (i) => lineKey(i.menuItemId, i.optionId ?? null, i.specialInstructions) === key
          );
          const requestedQuantity = Number.isInteger(item.quantity) ? Math.max(1, item.quantity) : 1;
          const quantityToAdd = Math.min(
            requestedQuantity,
            MAX_ITEM_QUANTITY - (existing?.quantity ?? 0),
          );
          const lastAdded = (message: string, error = false) => ({ message, error, token: Date.now() });
          if (quantityToAdd <= 0) {
            return { lastAdded: lastAdded(`Maximum ${MAX_ITEM_QUANTITY} of each dish per order.`, true) };
          }
          if (existing) {
            return {
              items: state.items.map((i) =>
                lineKey(i.menuItemId, i.optionId ?? null, i.specialInstructions) === key
                  ? { ...i, quantity: i.quantity + quantityToAdd }
                  : i
              ),
              lastAdded: lastAdded(lastAddedMessage(item.name, quantityToAdd)),
            };
          }
          if (state.items.length >= MAX_ORDER_LINES) {
            return { lastAdded: lastAdded(`Orders can include up to ${MAX_ORDER_LINES} different items.`, true) };
          }
          return {
            items: [...state.items, { ...item, quantity: quantityToAdd }],
            lastAdded: lastAdded(lastAddedMessage(item.name, quantityToAdd)),
          };
        }),
      removeItem: (menuItemId, optionId = null, specialInstructions) =>
        set((state) => ({
          items: state.items.filter(
            (i) => lineKey(i.menuItemId, i.optionId ?? null, i.specialInstructions) !== lineKey(menuItemId, optionId, specialInstructions)
          ),
        })),
      increment: (menuItemId, optionId = null, specialInstructions) =>
        set((state) => ({
          items: state.items.map((i) =>
            lineKey(i.menuItemId, i.optionId ?? null, i.specialInstructions) === lineKey(menuItemId, optionId, specialInstructions)
              ? { ...i, quantity: Math.min(MAX_ITEM_QUANTITY, i.quantity + 1) }
              : i
          ),
        })),
      decrement: (menuItemId, optionId = null, specialInstructions) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              lineKey(i.menuItemId, i.optionId ?? null, i.specialInstructions) === lineKey(menuItemId, optionId, specialInstructions)
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
      version: 3,
      migrate: (persisted) => {
        // Older carts may omit option IDs or contain quantities above API limits.
        const state = persisted as { items?: CartItem[] };
        if (state?.items) {
          state.items = state.items.map((i) => ({
            ...i,
            optionId: i.optionId ?? null,
            quantity: Number.isInteger(i.quantity)
              ? Math.max(1, Math.min(MAX_ITEM_QUANTITY, i.quantity))
              : 1,
          }));
        }
        return state as CartState;
      },
    }
  )
);
