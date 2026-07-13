"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatCurrency } from "@/lib/whatsapp";
import { useState } from "react";

import CheckoutModal from "./CheckoutModal";

export default function CartDrawer() {
  const { items, isOpen, closeCart, increment, decrement, removeItem, subtotal } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[80]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
            />
            <motion.aside
              className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-surface z-[90] flex flex-col shadow-modal"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
                <h2 className="font-display text-xl font-bold text-primary">Your Cart</h2>
                <button onClick={closeCart} aria-label="Close cart" className="p-2 hover:bg-surface-container rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-on-surface-variant">
                    <ShoppingBag size={40} className="opacity-40" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  <ul className="space-y-5">
                    {items.map((item) => (
                      <li key={item.menuItemId} className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg bg-surface-container-high overflow-hidden shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-semibold text-sm text-on-surface">{item.name}</p>
                            <button
                              onClick={() => removeItem(item.menuItemId)}
                              aria-label={`Remove ${item.name}`}
                              className="text-on-surface-variant hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          {item.specialInstructions && (
                            <p className="text-xs text-on-surface-variant mt-0.5">{item.specialInstructions}</p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3 bg-surface-container-low rounded-full px-2 py-1">
                              <button onClick={() => decrement(item.menuItemId)} aria-label="Decrease quantity" className="p-1 hover:bg-surface-container rounded-full">
                                <Minus size={14} />
                              </button>
                              <span className="text-sm w-4 text-center">{item.quantity}</span>
                              <button onClick={() => increment(item.menuItemId)} aria-label="Increase quantity" className="p-1 hover:bg-surface-container rounded-full">
                                <Plus size={14} />
                              </button>
                            </div>
                            <span className="text-sm font-semibold text-primary">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-outline-variant/20 px-6 py-5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Subtotal</span>
                    <span className="font-semibold text-primary">{formatCurrency(subtotal())}</span>
                  </div>
                  <button
                    onClick={() => setCheckoutOpen(true)}
                    className="w-full py-3.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
