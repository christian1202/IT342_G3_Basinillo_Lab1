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
  /* CTO NOTE: We add '||' to provide a fake value during the Build process.
     This prevents the "Error: supabaseKey is required" crash.
     When the app runs in the real browser, it will use the real keys.
  */
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  return createBrowserClient(supabaseUrl, supabaseKey);
}

/**
 * Convenience singleton for components that just need `supabase`.
 * Still cookie-based via @supabase/ssr under the hood.
 */
export const supabase = createClient();
