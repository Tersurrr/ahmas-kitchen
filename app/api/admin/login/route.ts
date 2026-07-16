import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
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
  const { data: limit, error: limitError } = await supabase.rpc(
    "consume_admin_login_rate_limit",
    { p_email: email, p_ip: clientAddress(request) }
  );
  const result = Array.isArray(limit) ? limit[0] : limit;

  // Fail closed: a missing migration or unavailable limiter must not open the login endpoint.
  if (limitError || !result) {
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
