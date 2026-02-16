import { createBrowserClient } from "@supabase/ssr";

/* ================================================================== */
/*  Browser Supabase Client                                            */
/*  Uses @supabase/ssr so auth tokens are stored in COOKIES instead   */
/*  of localStorage. This makes the session visible to the proxy.ts   */
/*  (server-side middleware) and Server Components.                     */
/*                                                                     */
/*  Import this in all client components ("use client").               */
/* ================================================================== */

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/**
 * Convenience singleton for components that just need `supabase`.
 * Still cookie-based via @supabase/ssr under the hood.
 */
export const supabase = createClient();
