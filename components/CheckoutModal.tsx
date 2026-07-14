"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatCurrency, getWhatsAppOrderUrl } from "@/lib/whatsapp";
import { createClient } from "@/lib/supabase/client";
import type { FulfillmentType } from "@/lib/types";

export default function CheckoutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, subtotal, clear } = useCart();
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [instructions, setInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    name.trim() &&
    phone.trim() &&
    (fulfillment === "pickup" || address.trim()) &&
    items.length > 0 &&
    !submitting;

  async function handlePlaceOrder() {
    if (!canSubmit) return;
    if (name.trim().length > 100 || phone.trim().length > 30 || address.trim().length > 250 || instructions.trim().length > 500) {
      setError("Please shorten the information provided and try again.");
      return;
    }
    setSubmitting(true);
    setError("");

    const details = {
      name,
      phone,
      address,
      fulfillment,
      date,
      time,
      instructions,
    };

    // Best-effort: save a copy of the order in Supabase for record keeping.
    // The WhatsApp handoff below still happens even if this fails.
    try {
      const supabase = createClient();
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: name,
          phone,
          address: fulfillment === "delivery" ? address : null,
          fulfillment_type: fulfillment,
          preferred_date: date || null,
          preferred_time: time || null,
          special_instructions: instructions || null,
          total_price: subtotal(),
        })
        .select()
        .single();

      if (!orderError && order) {
        await supabase.from("order_items").insert(
          items.map((i) => ({
            order_id: order.id,
            menu_item_id: i.menuItemId,
            name: i.name,
            quantity: i.quantity,
            unit_price: i.price,
            notes: i.specialInstructions || null,
          }))
        );
      }
    } catch {
      // Supabase not configured yet — order still proceeds to WhatsApp.
    }

    const url = getWhatsAppOrderUrl(details, items);
    window.open(url, "_blank", "noopener,noreferrer");
    clear();
    setSubmitting(false);
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
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20 sticky top-0 bg-surface z-10">
              <h2 className="font-display text-xl font-bold text-primary">Checkout</h2>
              <button onClick={onClose} aria-label="Close" className="p-2 hover:bg-surface-container rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillment("pickup")}
                  className={`py-3 rounded-lg border text-sm font-semibold transition-colors ${
                    fulfillment === "pickup"
                      ? "bg-primary text-on-primary border-primary"
                      : "border-outline-variant text-on-surface-variant"
                  }`}
                >
                  Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment("delivery")}
                  className={`py-3 rounded-lg border text-sm font-semibold transition-colors ${
                    fulfillment === "delivery"
                      ? "bg-primary text-on-primary border-primary"
                      : "border-outline-variant text-on-surface-variant"
                  }`}
                >
                  Delivery
                </button>
              </div>

              <Field label="Full Name" value={name} onChange={setName} placeholder="Jane Doe" required />
              <Field label="Phone Number" value={phone} onChange={setPhone} placeholder="(555) 555-5555" type="tel" required />
              {fulfillment === "delivery" && (
                <Field label="Delivery Address" value={address} onChange={setAddress} placeholder="Street, City, State, ZIP" required />
              )}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Preferred Date" value={date} onChange={setDate} type="date" />
                <Field label="Preferred Time" value={time} onChange={setTime} type="time" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1.5 block">
                  Special Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Any allergies, spice preference, etc."
                />
              </div>

              <div className="rounded-lg bg-surface-container-low p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Order Summary
                </p>
                {items.map((i) => (
                  <div key={i.cartItemId} className="flex justify-between text-sm">
                    <span>{i.quantity} x {i.name}</span>
                    <span>{formatCurrency(i.price * i.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-outline-variant/30">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(subtotal())}</span>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                onClick={handlePlaceOrder}
                disabled={!canSubmit}
                className="w-full py-3.5 rounded-lg bg-secondary text-on-secondary font-semibold hover:bg-secondary-dark transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? "Sending to WhatsApp…" : "Place Order via WhatsApp"}
              </button>
              <p className="text-xs text-center text-on-surface-variant">
                No online payment. You&apos;ll finalize payment directly with Amahs kitchen after confirming your order.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1.5 block">
        {label}{required && <span className="text-secondary"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={type === "tel" ? 30 : type === "date" || type === "time" ? undefined : 100}
        className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
      />
    </div>
  );
}
