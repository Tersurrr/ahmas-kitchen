import type { CartItem, FulfillmentType } from "./types";

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "18572615923";

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export type CheckoutDetails = {
  name: string;
  phone: string;
  address: string;
  fulfillment: FulfillmentType;
  date: string;
  time: string;
  instructions: string;
};

/** Builds the formatted order message sent to the business owner's WhatsApp. */
export function buildWhatsAppMessage(details: CheckoutDetails, items: CartItem[]) {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const lines = [
    `*New Order  Amahs kitchen*`,
    ``,
    `*Name:* ${details.name}`,
    `*Phone:* ${details.phone}`,
    `*Fulfillment:* ${details.fulfillment === "delivery" ? "Delivery" : "Pickup"}`,
  ];

  if (details.fulfillment === "delivery" && details.address) {
    lines.push(`*Address:* ${details.address}`);
  }

  if (details.date) lines.push(`*Preferred Date:* ${details.date}`);
  if (details.time) lines.push(`*Preferred Time:* ${details.time}`);

  lines.push(``, `*Order Items:*`);
  items.forEach((item) => {
    const label = item.optionName ? `${item.name} (${item.optionName})` : item.name;
    lines.push(
      `• ${item.quantity} x ${label} — ${formatCurrency(item.price * item.quantity)}`
    );
    if (item.specialInstructions) {
      lines.push(`   ↳ Note: ${item.specialInstructions}`);
    }
  });

  if (details.instructions) {
    lines.push(``, `*Special Instructions:* ${details.instructions}`);
  }

  lines.push(``, `*Total: ${formatCurrency(total)}*`);

  return lines.join("\n");
}

/** Opens WhatsApp (app on mobile, web on desktop) with the pre-filled order message. */
export function getWhatsAppOrderUrl(details: CheckoutDetails, items: CartItem[]) {
  const message = buildWhatsAppMessage(details, items);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
