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

function messageValue(value: string) {
  return value
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Builds the formatted order message sent to the business owner's WhatsApp. */
export function buildWhatsAppMessage(
  details: CheckoutDetails,
  items: CartItem[],
  orderReference?: string
) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lines = [
    "*New Order - Amahs kitchen*",
    "",
    ...(orderReference ? [`*Order Reference:* ${messageValue(orderReference)}`] : []),
    `*Name:* ${messageValue(details.name)}`,
    `*Phone:* ${messageValue(details.phone)}`,
    `*Fulfillment:* ${details.fulfillment === "delivery" ? "Delivery" : "Pickup"}`,
  ];

  if (details.fulfillment === "delivery" && details.address) {
    lines.push(`*Address:* ${messageValue(details.address)}`);
  }
  if (details.date) lines.push(`*Preferred Date:* ${messageValue(details.date)}`);
  if (details.time) lines.push(`*Preferred Time:* ${messageValue(details.time)}`);

  lines.push("", "*Order Items:*");
  items.forEach((item) => {
    const label = item.optionName
      ? `${messageValue(item.name)} (${messageValue(item.optionName)})`
      : messageValue(item.name);
    lines.push(`- ${item.quantity} x ${label} - ${formatCurrency(item.price * item.quantity)}`);
    if (item.specialInstructions) {
      lines.push(`  Note: ${messageValue(item.specialInstructions)}`);
    }
  });

  if (details.instructions) {
    lines.push("", `*Special Instructions:* ${messageValue(details.instructions)}`);
  }

  lines.push("", `*Total: ${formatCurrency(total)}*`);
  return lines.join("\n");
}

/** Returns a WhatsApp deep link containing the encoded order message. */
export function getWhatsAppOrderUrl(
  details: CheckoutDetails,
  items: CartItem[],
  orderReference?: string
) {
  const message = buildWhatsAppMessage(details, items, orderReference);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
