"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { formatCurrency } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";
import FoodModal from "./FoodModal";

export default function MenuCard({ item }: { item: MenuItem }) {
  const [modalOpen, setModalOpen] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const image = item.menu_images?.[0]?.url;

  function quickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      image,
      quantity: 1,
    });
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="group text-left bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-modal transition-shadow flex flex-col"
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
            <span className="font-semibold text-primary">{formatCurrency(item.price)}</span>
            <span
              onClick={quickAdd}
              role="button"
              aria-label={`Add ${item.name} to cart`}
              className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center hover:bg-secondary-dark transition-colors active:scale-90"
            >
              <Plus size={18} />
            </span>
          </div>
        </div>
      </button>

      <FoodModal item={item} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
