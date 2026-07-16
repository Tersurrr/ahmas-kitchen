"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { formatCurrency } from "@/lib/whatsapp";
import { getDefaultOption, getDisplayPrice, requiresOptionSelection } from "@/lib/menu-options";
import { useCart } from "@/store/cart";
import FoodModal from "./FoodModal";

export default function MenuCard({ item }: { item: MenuItem }) {
  const [modalOpen, setModalOpen] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const image = item.menu_images?.[0]?.url;
  const displayPrice = getDisplayPrice(item);

  function openModal() {
    setModalOpen(true);
  }

  function quickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    if (!item.is_available) return;
    // If there's more than one option, the customer must choose — open the modal instead.
    if (requiresOptionSelection(item)) {
      openModal();
      return;
    }
    const defaultOption = getDefaultOption(item);
    addItem({
      menuItemId: item.id,
      optionId: defaultOption?.id ?? null,
      optionName: defaultOption?.name,
      name: item.name,
      price: defaultOption ? defaultOption.price : item.price,
      image,
      quantity: 1,
    });
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal();
          }
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
          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold text-primary">{formatCurrency(displayPrice)}</span>
            <button
              type="button"
              onClick={quickAdd}
              disabled={!item.is_available}
              aria-label={item.is_available ? `Add ${item.name} to cart` : `${item.name} is sold out`}
              className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center hover:bg-secondary-dark transition-colors active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-secondary disabled:active:scale-100"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      <FoodModal item={item} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
