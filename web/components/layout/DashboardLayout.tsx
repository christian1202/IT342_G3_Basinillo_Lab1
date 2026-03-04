"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { Menu } from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";

/* ================================================================== */
/*  DashboardLayout                                                    */
/*  The shell wrapping every authenticated page.                       */
/*  Design: #0A0F1E main bg, #0D1221 sidebar bg, 240px sidebar width. */
/* ================================================================== */

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): React.JSX.Element {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isAdmin = (user?.publicMetadata?.role as string) === "admin";
  const userName = user?.fullName || user?.firstName || "User";

  const handleLogout = useCallback(async () => {
    await signOut();
    router.push("/auth/sign-in");
  }, [signOut, router]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  /* Loading State */
  if (!isLoaded) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#0A0F1E" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#0A0F1E" }}
    >
      {/* Desktop Sidebar */}
      <div className="hidden w-[240px] shrink-0 lg:block">
        <Sidebar
          onLogout={handleLogout}
          isAdmin={isAdmin}
          userName={userName}
        />
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[280px] shadow-2xl">
            <Sidebar
              onLogout={handleLogout}
              isMobile
              onClose={closeDrawer}
              isAdmin={isAdmin}
              userName={userName}
            />
          </div>
        </div>
      )}

      {/* Right Column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header
          className="flex h-14 shrink-0 items-center border-b border-white/5 px-4 lg:hidden"
          style={{ backgroundColor: "#0D1221" }}
        >
          <button
            type="button"
            onClick={openDrawer}
            aria-label="Open navigation menu"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 text-sm font-bold text-white">PortKey</span>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
