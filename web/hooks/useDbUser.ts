"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { syncClerkUser, BackendUser } from "@/lib/api";

/* ================================================================== */
/*  useDbUser                                                          */
/*  Bridges Clerk auth → backend database user.                        */
/*                                                                     */
/*  Problem:                                                           */
/*    Clerk user.id = "user_3ANa..." (string)                          */
/*    Database user_id columns = UUID                                   */
/*                                                                     */
/*  Solution:                                                          */
/*    On mount, sync Clerk user → backend → get internal UUID.         */
/*    All data queries use this UUID, not the Clerk ID.                 */
/* ================================================================== */

export function useDbUser() {
  const { user, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<BackendUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Prevent duplicate sync calls with a ref */
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || hasSynced.current) return;

    hasSynced.current = true;

    async function sync() {
      try {
        const backendUser = await syncClerkUser({
          clerkId: user!.id,
          email: user!.primaryEmailAddress?.emailAddress ?? "",
          fullName: user!.fullName ?? "",
          avatarUrl: user!.imageUrl ?? "",
        });

        setDbUser(backendUser);
      } catch (err) {
        console.error("Failed to sync user with backend:", err);
        setError(err instanceof Error ? err.message : "User sync failed");
      } finally {
        setIsLoading(false);
      }
    }

    sync();
  }, [isLoaded, user]);

  return {
    /** The internal DB UUID — use this for all data queries. */
    dbUserId: dbUser?.id ?? null,
    /** The full backend user object. */
    dbUser,
    /** True until the sync completes. */
    isLoading: !isLoaded || isLoading,
    /** Error message if sync failed. */
    error,
  } as const;
}
