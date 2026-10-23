"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatCurrency, getWhatsAppOrderUrl } from "@/lib/whatsapp";
import type { CartItem, FulfillmentType } from "@/lib/types";

type OrderResponse = {
  order?: {
    id: string;
    total: number;
    items: CartItem[];
  };
  error?: string;
};

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
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    name.trim() &&
    (fulfillment === "pickup" || address.trim()) &&
    items.length > 0 &&
    !submitting;

  async function handlePlaceOrder() {
    if (!canSubmit) return;
    if (
      name.trim().length > 100 ||
      address.trim().length > 250 ||
      instructions.trim().length > 500
    ) {
      setError("Please shorten the information provided and try again.");
      return;
    }

    setSubmitting(true);
    setError("");

    const details = {
      name,
      phone: null,
      address,
      fulfillment,
      instructions,
    };
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...details,
          items: items.map((item) => ({
            menuItemId: item.menuItemId,
            optionId: item.optionId,
            quantity: item.quantity,
            notes: item.specialInstructions || null,
          })),
        }),
        signal: controller.signal,
      });
      const result = (await response.json().catch(() => ({}))) as OrderResponse;

      if (!response.ok || !result.order) {
        setError(result.error || "We couldn't confirm the order. Please try again.");
        return;
      }

      const url = getWhatsAppOrderUrl(details, result.order.items, result.order.id);
      clear();
      onClose();
      window.location.assign(url);
    } catch (requestError) {
      setError(
        requestError instanceof DOMException && requestError.name === "AbortError"
          ? "The order request timed out. Please check your connection and try again."
          : "We couldn't confirm the order. Please check your connection and try again."
      );
    } finally {
      window.clearTimeout(timeout);
      setSubmitting(false);
    }
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            className="fixed inset-x-0 bottom-0 md:inset-0 md:m-auto md:max-w-lg md:h-fit z-[90] bg-surface rounded-t-2xl md:rounded-2xl shadow-modal max-h-[90vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20 sticky top-0 bg-surface z-10">
              <h2 id="checkout-title" className="font-display text-xl font-bold text-primary">Checkout</h2>
              <button onClick={onClose} aria-label="Close" className="p-2 hover:bg-surface-container rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  aria-pressed={fulfillment === "pickup"}
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
                  aria-pressed={fulfillment === "delivery"}
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

              <Field id="checkout-name" label="Full Name" value={name} onChange={setName} placeholder="Jane Doe" required />
              {fulfillment === "delivery" && (
                <Field id="checkout-address" label="Delivery Address" value={address} onChange={setAddress} placeholder="Street, City, State, ZIP" required />
              )}
              <div>
                <label htmlFor="checkout-instructions" className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1.5 block">
                  Special Instructions
                </label>
                <textarea
                  id="checkout-instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Any allergies, spice preference, etc."
                />
              </div>

              <div className="rounded-lg bg-surface-container-low p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Order Summary
                </p>
                {items.map((i) => (
                  <div key={JSON.stringify([i.menuItemId, i.optionId, i.specialInstructions || ""])} className="flex justify-between text-sm">
                    <span>
                      {i.quantity} x {i.name}
                      {i.optionName && <span className="text-on-surface-variant"> ({i.optionName})</span>}
                    </span>
                    <span>{formatCurrency(i.price * i.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-outline-variant/30">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(subtotal())}</span>
                </div>
              </div>

              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

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
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1.5 block">
        {label}{required && <span className="text-secondary"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={type === "tel" ? 30 : 100}
        className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
      />
    </div>
  );
}
