"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { IUserProfile } from "@/types/database";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkRole() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login"); // Should be handled by middleware, but safe fallback
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || !profile) {
          console.error("Error fetching profile:", error);
          router.push("/dashboard");
          return;
        }

        if (profile.role !== "admin") {
          console.warn("Unauthorized access attempt to admin area.");
          router.push("/dashboard");
        } else {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Unexpected error in useAdmin:", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    checkRole();
  }, [router, supabase]);

  return { isAdmin, loading };
}
