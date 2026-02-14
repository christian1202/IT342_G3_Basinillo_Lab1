"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { syncUserWithBackend } from "@/lib/api";

/**
 * OAuth Callback page.
 *
 * After Google OAuth redirects back, Supabase sets the session via the URL hash.
 * This page listens for the auth state change, syncs the user with the backend,
 * then redirects to /dashboard.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          try {
            await syncUserWithBackend(session);
            router.push("/dashboard");
          } catch {
            router.push("/login?error=sync_failed");
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm text-slate-500">Signing you in…</p>
      </div>
    </div>
  );
}
