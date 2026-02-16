import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

/* ================================================================== */
/*  ROUTE CONFIGURATION                                                */
/*  Centralised lists that define the protection rules.                */
/*  Add new paths here — the middleware logic stays untouched.         */
/* ================================================================== */

/** Routes that require an active session (redirect to /login if none). */
const PROTECTED_ROUTES = ["/dashboard", "/shipments", "/status", "/settings"];

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
/*  MIDDLEWARE                                                         */
/*  The "bouncer" — runs before every matched request.                 */
/*                                                                     */
/*  1. Creates a lightweight Supabase client for session inspection.   */
/*  2. Reads the auth token from the request cookies.                  */
/*  3. Applies redirect rules based on session state + route type.     */
/* ================================================================== */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Create a Supabase client scoped to this request.
   * We read the sb-<ref>-auth-token cookie that the browser client sets
   * and inject it into the client so getUser() can verify the session.
   */
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
      },
    },
  );

  /*
   * Refresh the session & verify the token in one call.
   * getUser() is preferred over getSession() because it validates
   * the JWT against the Supabase Auth server rather than just
   * decoding it locally, providing stronger security.
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hasSession = !!user;

  /* ---- Rule 1: Protect private routes ---- */
  if (!hasSession && matchesAny(pathname, PROTECTED_ROUTES)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl, 302);
  }

  /* ---- Rule 2: Redirect authenticated users away from auth pages ---- */
  if (hasSession && matchesAny(pathname, AUTH_ROUTES)) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl, 302);
  }

  /* ---- No redirect needed — pass through ---- */
  return NextResponse.next();
}

/* ================================================================== */
/*  MATCHER                                                            */
/*  Only run middleware on these paths — skip static assets, API       */
/*  routes, images, and Next.js internals.                             */
/* ================================================================== */

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/shipments/:path*",
    "/status/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
