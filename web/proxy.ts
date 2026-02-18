import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/* ================================================================== */
/*  ROUTE CONFIGURATION                                                */
/*  Centralised lists that define the protection rules.                */
/*  Add new paths here — the proxy logic stays untouched.              */
/* ================================================================== */

/** Routes that require an active session (redirect to /login if none). */
const PROTECTED_ROUTES = [
  "/dashboard",
  "/shipments",
  "/status",
  "/settings",
  "/admin", // IMPORTANT: Added /admin based on middleware.ts logic
];

/** Routes reserved for guests (redirect to /dashboard if session exists). */
const AUTH_ROUTES = ["/login", "/register"];

/* ================================================================== */
/*  HELPERS                                                            */
/* ================================================================== */

/**
 * Returns true if `pathname` starts with any of the given `routes`.
 * Covers both exact matches and sub-routes (e.g. /dashboard/anything).
 */
function matchesAny(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

/* ================================================================== */
/*  PROXY (Middleware)                                                 */
/*  The "bouncer" — runs before every matched request (Next.js 16+).   */
/*                                                                     */
/*  Uses @supabase/ssr's createServerClient which reads/writes auth    */
/*  tokens via cookies on the NextRequest/NextResponse pair.           */
/*  This is the ONLY reliable way to check sessions server-side.       */
/* ================================================================== */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Start with a "pass-through" response that we'll modify.
   * This response object is shared with the cookie handlers below
   * so any session-refresh cookies get forwarded to the browser.
   */
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  /*
   * Create a Supabase client that reads cookies from the request
   * and writes refreshed cookies back onto the response.
   */
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[],
        ) {
          /*
           * 1. Set on the request (for downstream server components)
           * 2. Set on the response (to send back to the browser)
           */
          cookiesToSet.forEach(
            ({ name, value }: { name: string; value: string }) => {
              request.cookies.set(name, value);
            },
          );

          response = NextResponse.next({
            request: { headers: request.headers },
          });

          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }: {
              name: string;
              value: string;
              options?: Record<string, unknown>;
            }) => {
              response.cookies.set(name, value, options);
            },
          );
        },
      },
    },
  );

  /*
   * IMPORTANT: getUser() validates the JWT against the Supabase Auth
   * server AND refreshes expired tokens. This call also triggers
   * setAll() above if the token was refreshed, ensuring the new
   * cookies are written to the response.
   */
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const hasSession = !!user && !error;

  /* ---- Debug logging (remove once stable) ---- */
  console.log(
    `[middleware] path=${pathname} | hasSession=${hasSession} | user=${user?.email ?? "none"}`,
  );

  /* ---- Rule 1: Protect private routes ---- */
  if (!hasSession && matchesAny(pathname, PROTECTED_ROUTES)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);

    console.log(`[middleware] → redirecting to /login (no session)`);
    return NextResponse.redirect(loginUrl, 302);
  }

  /* ---- Rule 2: Redirect authenticated users away from auth pages ---- */
  if (hasSession && matchesAny(pathname, AUTH_ROUTES)) {
    const redirectTo =
      request.nextUrl.searchParams.get("redirectTo") || "/dashboard";
    const targetUrl = request.nextUrl.clone();
    targetUrl.pathname = redirectTo;
    targetUrl.searchParams.delete("redirectTo");

    console.log(
      `[middleware] → redirecting to ${redirectTo} (already logged in)`,
    );
    return NextResponse.redirect(targetUrl, 302);
  }

  /* ---- No redirect — return response with refreshed cookies ---- */
  return response;
}

/* ================================================================== */
/*  MATCHER                                                            */
/*  Only run middleware on these paths — skip static assets, API routes, */
/*  images, and Next.js internals.                                     */
/* ================================================================== */

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/shipments/:path*",
    "/status/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
