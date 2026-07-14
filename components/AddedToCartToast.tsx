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
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[65] bg-primary text-on-primary rounded-full shadow-modal pl-4 pr-2 py-2 flex items-center gap-3"
        >
          <CheckCircle2 size={18} className="text-secondary shrink-0" />
          <span className="text-sm font-medium whitespace-nowrap">
            Added {lastAdded.name} to cart
          </span>
          <button
            onClick={() => {
              openCart();
              setVisible(false);
            }}
            className="text-xs font-semibold bg-white/15 hover:bg-white/25 transition-colors rounded-full px-3 py-1.5 whitespace-nowrap"
          >
            View Cart
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
