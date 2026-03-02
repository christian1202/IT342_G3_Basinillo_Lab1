"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";

/* ================================================================== */
/*  Admin Page                                                         */
/*  Uses Clerk publicMetadata.role for authorization.                  */
/* ================================================================== */

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const role = user.publicMetadata?.role as string | undefined;
    if (role !== "admin") {
      console.warn("Access Denied: User is not admin. Role:", role);
      router.push("/dashboard");
      return;
    }

    setIsAuthorized(true);
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Verifying privileges...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <DashboardLayout>
      <AdminDashboard />
    </DashboardLayout>
  );
}
