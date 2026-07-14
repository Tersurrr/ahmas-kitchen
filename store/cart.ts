"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  lastAdded: { name: string; token: number } | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  increment: (cartItemId: string) => void;
  decrement: (cartItemId: string) => void;
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
          const existing = state.items.find((i) => i.cartItemId === item.cartItemId);
          const lastAdded = { name: item.name, token: Date.now() };
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cartItemId === item.cartItemId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              lastAdded,
            };
          }
          return { items: [...state.items, item], lastAdded };
        }),
      removeItem: (cartItemId) =>
        set((state) => ({ items: state.items.filter((i) => i.cartItemId !== cartItemId) })),
      increment: (cartItemId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),
      decrement: (cartItemId) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.cartItemId === cartItemId ? { ...i, quantity: i.quantity - 1 } : i
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
    }
  )
);
