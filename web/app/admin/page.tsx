"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push("/login");
          return;
        }

        // Check profile for role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          router.push("/dashboard"); // Fallback to safe zone
          return;
        }

        if (profile?.role !== "admin") {
          router.push("/dashboard");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Admin check failed:", error);
        router.push("/dashboard");
      } finally {
        setChecking(false);
      }
    }

    checkAdminAccess();
  }, [router, supabase]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm text-gray-500">Verifying privileges...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return (
    <DashboardLayout>
      <AdminDashboard />
    </DashboardLayout>
  );
}
