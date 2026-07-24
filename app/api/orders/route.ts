import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateOrderRequest } from "@/lib/order-validation";
import type { CartItem } from "@/lib/types";

export const runtime = "nodejs";

type RateLimitResult = {
  allowed: boolean;
  retry_after: number;
};

type CreatedOrder = {
  id: string;
  total: number;
  items: CartItem[];
};

function noStore(status: number, body: Record<string, unknown>, retryAfter?: number) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (retryAfter) headers.set("Retry-After", String(retryAfter));
  return NextResponse.json(body, { status, headers });
}

function clientAddress(request: Request) {
  const isManagedPlatform = process.env.VERCEL === "1" || process.env.NETLIFY === "true";
  if (!isManagedPlatform) return null;
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > 32_768) {
    return noStore(413, { error: "The order request is too large." });
  }
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return noStore(415, { error: "The order request must be JSON." });
  }
  if (!hasSameOrigin(request)) {
    return noStore(403, { error: "Invalid order request origin." });
  }

  const raw = await request.text().catch(() => "");
  if (Buffer.byteLength(raw, "utf8") > 32_768) {
    return noStore(413, { error: "The order request is too large." });
  }
  let body: unknown = null;
  try {
    body = JSON.parse(raw);
  } catch {
    return noStore(400, { error: "The order request is not valid JSON." });
  }

  const parsed = validateOrderRequest(body);
  if (!parsed.ok) return noStore(400, { error: parsed.error });

  try {
    const supabase = createAdminClient();
    const { data: limitData, error: limitError } = await supabase.rpc(
      "consume_public_order_rate_limit",
      {
        p_phone: parsed.value.phone,
        p_ip: clientAddress(request),
      }
    );
    const limit = (Array.isArray(limitData) ? limitData[0] : limitData) as
      | RateLimitResult
      | null;

    if (
      limitError ||
      !limit ||
      typeof limit.allowed !== "boolean" ||
      !Number.isFinite(limit.retry_after)
    ) {
      return noStore(503, { error: "Ordering is temporarily unavailable. Please try again." });
    }
    if (!limit.allowed) {
      return noStore(
        429,
        { error: "Too many orders were submitted. Please try again later." },
        limit.retry_after
      );
    }

    const order = parsed.value;
    const { data, error } = await supabase.rpc("create_public_order", {
      p_customer_name: order.name,
      p_phone: order.phone,
      p_address: order.address,
      p_fulfillment_type: order.fulfillment,
      p_preferred_date: order.date,
      p_preferred_time: order.time,
      p_special_instructions: order.instructions,
      p_items: order.items.map((item) => ({
        menu_item_id: item.menuItemId,
        option_id: item.optionId,
        quantity: item.quantity,
        notes: item.notes,
      })),
    });

    if (error || !data) {
      return noStore(400, {
        error: "Some menu items changed or are unavailable. Refresh the menu and try again.",
      });
    }

    const created = data as CreatedOrder;
    if (
      typeof created.id !== "string" ||
      !Number.isFinite(Number(created.total)) ||
      !Array.isArray(created.items)
    ) {
      return noStore(503, { error: "The order could not be confirmed. Please try again." });
    }

    return noStore(201, {
      order: {
        ...created,
        total: Number(created.total),
        items: created.items.map((item) => ({
          ...item,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
      },
    });
  } catch {
    return noStore(503, { error: "Ordering is temporarily unavailable. Please try again." });
  }
}
