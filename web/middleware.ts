import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/* ================================================================== */
/*  ROUTE CONFIGURATION                                                */
/*  Centralised list of protected routes. Add new paths here.          */
/* ================================================================== */

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/shipments(.*)",
  "/settings(.*)",
  "/admin(.*)",
  "/analytics(.*)",
]);

/* ================================================================== */
/*  MIDDLEWARE                                                         */
/*  Clerk handles session validation, token refresh, and cookie        */
/*  management automatically. No manual cookie logic needed.           */
/* ================================================================== */

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

/* ================================================================== */
/*  MATCHER                                                            */
/*  Skip static assets, images, and Next.js internals.                 */
/* ================================================================== */

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
