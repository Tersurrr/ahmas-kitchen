"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { formatCurrency } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";
import { buildCartItem, getDefaultOption, getDisplayPrice, getSortedOptions } from "@/lib/menuItemOptions";

export default function FoodModal({
  item,
  open,
  onClose,
}: {
  item: MenuItem;
  open: boolean;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const addItem = useCart((s) => s.addItem);
  const image = item.menu_images?.[0]?.url;

  const options = getSortedOptions(item);
  const hasOptions = options.length > 0;
  const [selectedOptionId, setSelectedOptionId] = useState(getDefaultOption(item)?.id ?? "");
  const selectedOption = options.find((o) => o.id === selectedOptionId) ?? null;
  const unitPrice = getDisplayPrice(item, selectedOption);

  function handleAdd() {
    addItem(
      buildCartItem({
        item,
        selectedOption,
        quantity,
        image,
        specialInstructions: instructions || undefined,
      })
    );
    setQuantity(1);
    setInstructions("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-[80]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 md:inset-0 md:m-auto md:max-w-lg md:h-fit z-[90] bg-surface rounded-t-2xl md:rounded-2xl shadow-modal max-h-[90vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {image && (
              <div className="relative aspect-[16/10] bg-surface-container-high">
                <Image src={image} alt={item.name} fill sizes="600px" className="object-cover" />
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-bold text-primary">{item.name}</h2>
                  {item.description && (
                    <p className="text-sm text-on-surface-variant mt-2">{item.description}</p>
                  )}
                </div>
                {!image && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="shrink-0 w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {item.ingredients && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1">
                    Ingredients
                  </p>
                  <p className="text-sm text-on-surface-variant">{item.ingredients}</p>
                </div>
              )}

              {hasOptions && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2">
                    Choose an option
                  </p>
                  <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Options">
                    {options.map((option) => {
                      const active = option.id === selectedOptionId;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setSelectedOptionId(option.id)}
                          className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                            active
                              ? "bg-primary text-on-primary border-primary"
                              : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                          }`}
                        >
                          <span>{option.name}</span>
                          <span className={active ? "text-on-primary" : "text-on-surface-variant"}>
                            {formatCurrency(option.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold text-primary">
                  {formatCurrency(unitPrice)}
                </span>
                <div className="flex items-center gap-3 bg-surface-container-low rounded-full px-3 py-1.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-1 hover:bg-surface-container rounded-full"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-5 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="p-1 hover:bg-surface-container rounded-full"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1.5 block">
                  Special Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={2}
                  placeholder="Extra spicy, no onions, etc."
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <button
                onClick={handleAdd}
                disabled={!item.is_available}
                className="w-full py-3.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98] disabled:opacity-50"
              >
                {item.is_available
                  ? `Add to Cart — ${formatCurrency(unitPrice * quantity)}`
                  : "Currently Unavailable"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
