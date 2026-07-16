import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

function contentSecurityPolicy(nonce: string) {
  const developmentEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src 'self' 'nonce-${nonce}'${developmentEval}`,
    `style-src 'self' 'nonce-${nonce}'`,
    // Framer Motion applies per-element transforms and opacity through style attributes.
    // This is narrower than allowing inline <style> blocks and keeps script execution strict.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com",
    // Uploaded kitchen videos are served directly from the existing Supabase Storage bucket.
    "media-src 'self' blob: https://*.supabase.co",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  ].join("; ");
}

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const nonce = btoa(crypto.randomUUID());
  const csp = contentSecurityPolicy(nonce);

  // Pass the nonce to the renderer so Next can apply it to framework-generated tags.
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  // Do not accept client-supplied route markers used by the layout guard.
  requestHeaders.delete("x-amahs-admin-login");
  requestHeaders.delete("x-amahs-admin-protected");

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin") && path !== "/admin/login";
  requestHeaders.set(
    isAdminRoute ? "x-amahs-admin-protected" : "x-amahs-admin-login",
    "1"
  );

  const nextResponse = () => {
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("Content-Security-Policy", csp);
    return response;
  };
  let response = nextResponse();

  // Public pages do not use an authenticated session. Avoid making a remote
  // Supabase auth request for every visitor, which otherwise blocks first
  // loads and route transitions. Protected admin routes still verify the user
  // below before access is granted.
  if (!isAdminRoute) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = nextResponse();
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // A stale browser refresh token must be treated as a signed-out visitor. This
  // keeps the public site available while the admin guard still denies access.
  let user: User | null = null;
  try {
    const {
      data: { user: authenticatedUser },
    } = await supabase.auth.getUser();
    user = authenticatedUser;
  } catch {
    user = null;
  }

  // This is deliberately duplicated in app/admin/layout.tsx as a defense in depth.
  const isAdmin = user?.app_metadata?.role === "admin";

  if (isAdminRoute && !isAdmin) {
    const loginUrl = new URL("/admin/login", request.url);
    const redirect = NextResponse.redirect(loginUrl);
    redirect.headers.set("Content-Security-Policy", csp);
    return redirect;
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
