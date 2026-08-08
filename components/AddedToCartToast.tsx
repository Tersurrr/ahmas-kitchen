"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/store/cart";

export default function AddedToCartToast() {
  const lastAdded = useCart((s) => s.lastAdded);
  const openCart = useCart((s) => s.openCart);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastAdded) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(timer);
  }, [lastAdded]);

  return (
    <AnimatePresence>
      {visible && lastAdded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed inset-x-3 bottom-20 z-[65] flex justify-center md:bottom-6"
        >
          <div className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full bg-primary py-2 pl-3 pr-2 text-on-primary shadow-modal sm:gap-3 sm:pl-4">
            <CheckCircle2 size={18} className="shrink-0 text-secondary" />
            <span className="min-w-0 truncate text-sm font-medium">
              Added {lastAdded.name} to cart
            </span>
            <button
              onClick={() => {
                openCart();
                setVisible(false);
              }}
              className="shrink-0 whitespace-nowrap rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white/25"
            >
              View Cart
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
