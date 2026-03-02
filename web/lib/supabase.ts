import { createClient } from "@supabase/supabase-js";

/* ================================================================== */
/*  Supabase Client — Data Access Only                                 */
/*                                                                     */
/*  Authentication is handled by Clerk.                                */
/*  This client is used ONLY for querying/mutating data in NeonDB      */
/*  via the Supabase PostgREST API.                                    */
/*                                                                     */
/*  Import this in any component that needs database access.           */
/* ================================================================== */

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

/**
 * Singleton Supabase client for data operations.
 * No auth — Clerk manages sessions separately.
 *
 * persistSession + autoRefreshToken disabled to prevent
 * stale Supabase cookies from triggering refresh errors.
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
