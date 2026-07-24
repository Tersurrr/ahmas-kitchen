export const MAX_ORDER_LINES = 30;
export const MAX_ITEM_QUANTITY = 50;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

export type ValidatedOrderItem = {
  menuItemId: string;
  optionId: string | null;
  quantity: number;
  notes: string | null;
};

export type ValidatedOrderRequest = {
  name: string;
  phone: string;
  address: string | null;
  fulfillment: "pickup" | "delivery";
  date: string | null;
  time: string | null;
  instructions: string | null;
  items: ValidatedOrderItem[];
};

export type OrderValidationResult =
  | { ok: true; value: ValidatedOrderRequest }
  | { ok: false; error: string };

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function cleanSingleLine(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned && cleaned.length <= maxLength ? cleaned : null;
}

function cleanOptionalLine(value: unknown, maxLength: number): string | null {
  if (value === undefined || value === null || value === "") return null;
  return cleanSingleLine(value, maxLength);
}

function hasValue(value: unknown) {
  return value !== undefined && value !== null && value !== "";
}

export function validateOrderRequest(input: unknown): OrderValidationResult {
  const body = record(input);
  if (!body) return { ok: false, error: "Invalid order request." };

  const name = cleanSingleLine(body.name, 100);
  const phone = cleanSingleLine(body.phone, 30);
  const fulfillment =
    body.fulfillment === "pickup" || body.fulfillment === "delivery"
      ? body.fulfillment
      : null;
  const address = cleanOptionalLine(body.address, 250);
  const date = cleanOptionalLine(body.date, 10);
  const time = cleanOptionalLine(body.time, 5);
  const instructions = cleanOptionalLine(body.instructions, 500);

  if (!name || !phone || !fulfillment) {
    return { ok: false, error: "Please provide valid contact and fulfillment details." };
  }
  if (
    (hasValue(body.address) && !address) ||
    (hasValue(body.date) && !date) ||
    (hasValue(body.time) && !time) ||
    (hasValue(body.instructions) && !instructions)
  ) {
    return { ok: false, error: "One or more order details are too long or invalid." };
  }
  if (!/^[+\d().\-\s]+$/.test(phone) || (phone.match(/\d/g) || []).length < 7) {
    return { ok: false, error: "Please provide a valid phone number." };
  }
  if (fulfillment === "delivery" && !address) {
    return { ok: false, error: "Please provide a delivery address." };
  }
  if (date && !DATE_PATTERN.test(date)) {
    return { ok: false, error: "Please provide a valid preferred date." };
  }
  if (time) {
    const [hour, minute] = time.split(":").map(Number);
    if (!TIME_PATTERN.test(time) || hour > 23 || minute > 59) {
      return { ok: false, error: "Please provide a valid preferred time." };
    }
  }
  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > MAX_ORDER_LINES) {
    return { ok: false, error: "The order contains an invalid number of items." };
  }

  const items: ValidatedOrderItem[] = [];
  for (const candidate of body.items) {
    const item = record(candidate);
    const menuItemId = item?.menuItemId;
    const optionId = item?.optionId;
    const quantity = item?.quantity;
    const notes = cleanOptionalLine(item?.notes, 500);

    if (
      typeof menuItemId !== "string" ||
      !UUID_PATTERN.test(menuItemId) ||
      (optionId !== null && optionId !== undefined &&
        (typeof optionId !== "string" || !UUID_PATTERN.test(optionId))) ||
      !Number.isInteger(quantity) ||
      (quantity as number) < 1 ||
      (quantity as number) > MAX_ITEM_QUANTITY ||
      (item?.notes !== undefined && item.notes !== null && item.notes !== "" && !notes)
    ) {
      return { ok: false, error: "One or more order items are invalid." };
    }

    items.push({
      menuItemId,
      optionId: typeof optionId === "string" ? optionId : null,
      quantity: quantity as number,
      notes,
    });
  }

  return {
    ok: true,
    value: {
      name,
      phone,
      address: fulfillment === "delivery" ? address : null,
      fulfillment,
      date,
      time,
      instructions,
      items,
    },
  };
}
