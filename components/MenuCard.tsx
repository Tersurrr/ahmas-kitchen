"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { formatCurrency } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";
import { buildCartItem, getDefaultOption, getDisplayPrice, getSortedOptions } from "@/lib/menuItemOptions";
import FoodModal from "./FoodModal";

export default function MenuCard({ item }: { item: MenuItem }) {
  const [modalOpen, setModalOpen] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const image = item.menu_images?.[0]?.url;

  const options = getSortedOptions(item);
  const hasOptions = options.length > 0;
  const [selectedOptionId, setSelectedOptionId] = useState(getDefaultOption(item)?.id ?? "");
  const selectedOption = options.find((o) => o.id === selectedOptionId) ?? null;
  const displayPrice = getDisplayPrice(item, selectedOption);

  function quickAdd(e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation();
    addItem(
      buildCartItem({ item, selectedOption, quantity: 1, image })
    );
  }

  function handleOptionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.stopPropagation();
    setSelectedOptionId(e.target.value);
  }

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setModalOpen(true);
        }}
        className="group text-left bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-modal transition-shadow flex flex-col cursor-pointer"
      >
        {image && (
          <div className="relative aspect-[4/3] bg-surface-container-high overflow-hidden">
            <Image
              src={image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 50vw, 300px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {!item.is_available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">Sold Out</span>
              </div>
            )}
          </div>
        )}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-semibold text-lg text-primary leading-snug">{item.name}</h3>
            {!image && !item.is_available && (
              <span className="shrink-0 text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                Sold Out
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{item.description}</p>
          )}

          {hasOptions && (
            <select
              value={selectedOptionId}
              onChange={handleOptionChange}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Choose an option for ${item.name}`}
              className="mt-3 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name} — {formatCurrency(option.price)}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold text-primary">{formatCurrency(displayPrice)}</span>
            <span
              onClick={quickAdd}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") quickAdd(e);
              }}
              aria-label={`Add ${item.name} to cart`}
              className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center hover:bg-secondary-dark transition-colors active:scale-90"
            >
              <Plus size={18} />
            </span>
          </div>
        </div>
      </div>

      <FoodModal item={item} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
