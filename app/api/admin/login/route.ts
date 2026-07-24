import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RateLimitResult = {
  allowed: boolean;
  retry_after: number;
};

function clientAddress(request: Request) {
  // Netlify and Vercel sanitize this header at their managed edge. Do not trust it when self-hosting.
  const isManagedPlatform = process.env.VERCEL === "1" || process.env.NETLIFY === "true";
  if (!isManagedPlatform) return null;
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

function noStore(status: number, body: Record<string, unknown>, retryAfter?: number) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (retryAfter) headers.set("Retry-After", String(retryAfter));
  return NextResponse.json(body, { status, headers });
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
  if (contentLength > 8_192) {
    return noStore(413, { error: "Invalid sign-in request." });
  }
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return noStore(415, { error: "Invalid sign-in request." });
  }
  if (!hasSameOrigin(request)) return noStore(403, { error: "Invalid sign-in request." });

  const raw = await request.text().catch(() => "");
  if (Buffer.byteLength(raw, "utf8") > 8_192) {
    return noStore(413, { error: "Invalid sign-in request." });
  }
  let body: unknown = null;
  try {
    body = JSON.parse(raw);
  } catch {
    return noStore(400, { error: "Invalid sign-in request." });
  }
  const credentials =
    body && typeof body === "object" ? (body as { email?: unknown; password?: unknown }) : {};
  const email = typeof credentials.email === "string" ? credentials.email.trim().toLowerCase() : "";
  const password = typeof credentials.password === "string" ? credentials.password : "";

  if (!email || email.length > 254 || !password || password.length > 1024) {
    return noStore(400, { error: "Invalid email or password." });
  }

  const cookiesToSet: { name: string; value: string; options: CookieOptions }[] = [];
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: (cookies: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.push(...cookies);
        },
      },
    }
  );

  // Atomic, database-backed limiter. It applies independent email and IP buckets.
  // The IP bucket is enabled only on Netlify or Vercel, where x-forwarded-for is trusted.
  let limit: unknown;
  let limitError: unknown;
  try {
    const result = await createAdminClient().rpc("consume_admin_login_rate_limit", {
      p_email: email,
      p_ip: clientAddress(request),
    });
    limit = result.data;
    limitError = result.error;
  } catch {
    return noStore(503, { error: "Sign-in is temporarily unavailable. Please try again shortly." });
  }
  const result = (Array.isArray(limit) ? limit[0] : limit) as RateLimitResult | null;

  // Fail closed: a missing migration or unavailable limiter must not open the login endpoint.
  if (
    limitError ||
    !result ||
    typeof result.allowed !== "boolean" ||
    !Number.isFinite(result.retry_after)
  ) {
    return noStore(503, { error: "Sign-in is temporarily unavailable. Please try again shortly." });
  }

  if (!result.allowed) {
    return noStore(
      429,
      { error: "Too many sign-in attempts. Please try again later.", retryAfter: result.retry_after },
      result.retry_after
    );
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Do not expose whether an email address exists or Supabase implementation details.
    return noStore(401, { error: "Invalid email or password." });
  }

  const response = noStore(200, { ok: true });
  cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  return response;
}
