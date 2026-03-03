"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/* ================================================================== */
/*  useAdmin                                                           */
/*  Returns the admin status of the current Clerk user.                */
/*  Reads role from Clerk publicMetadata (set in Clerk Dashboard).     */
/* ================================================================== */

export function useAdmin() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const isAdmin = (user?.publicMetadata?.role as string) === "admin";

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    if (!isAdmin) {
      console.warn("Unauthorized access attempt to admin area.");
      router.push("/dashboard");
    }
  }, [isLoaded, user, isAdmin, router]);

  return { isAdmin: isLoaded && isAdmin, loading: !isLoaded };
}
