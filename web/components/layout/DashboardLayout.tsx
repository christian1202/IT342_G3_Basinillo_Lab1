"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/layout/Sidebar";

/* ================================================================== */
/*  DashboardLayout                                                    */
/*  The "shell" that wraps every authenticated page.                   */
/*                                                                     */
/*  Structure:                                                         */
/*    ┌──────────┬─────────────────────────────────────────┐           */
/*    │          │  Top Header (mobile hamburger)          │           */
/*    │ Sidebar  ├─────────────────────────────────────────┤           */
/*    │ (fixed)  │                                        │           */
/*    │          │  Scrollable main content ({children})   │           */
/*    │          │                                        │           */
/*    └──────────┴─────────────────────────────────────────┘           */
/*                                                                     */
/*  Desktop: 250px fixed sidebar.                                      */
/*  Mobile:  Sidebar hidden behind hamburger → slide-over drawer.      */
/*                                                                     */
/*  Auth guard: Redirects to /login if no session is found.            */
/* ================================================================== */

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): React.JSX.Element {
  const router = useRouter();

  /* ---- auth state ---- */
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  /* ---- mobile drawer state ---- */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /* ---- resolve session on mount ---- */
  useEffect(() => {
    const resolveSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      // Check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role === "admin") {
        setIsAdmin(true);
        // Auto-redirect if on the main dashboard
        if (window.location.pathname === "/dashboard") {
          router.replace("/admin");
        }
      }

      setIsAuthLoading(false);
    };

    resolveSession();
  }, [router]);

  /* ---- handlers ---- */
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
  }, [router]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  /* ================================================================ */
  /*  EARLY RETURN — Auth Loading                                      */
  /* ================================================================ */

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  MAIN RENDER                                                      */
  /* ================================================================ */

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ============================================================ */}
      {/*  Desktop Sidebar (hidden on mobile)                           */}
      {/* ============================================================ */}
      <div className="hidden w-[250px] shrink-0 border-r border-slate-200 dark:border-slate-800 lg:block">
        <Sidebar onLogout={handleLogout} isAdmin={isAdmin} />
      </div>

      {/* ============================================================ */}
      {/*  Mobile Drawer Overlay                                        */}
      {/* ============================================================ */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="absolute inset-y-0 left-0 w-[280px] shadow-2xl">
            <Sidebar
              onLogout={handleLogout}
              isMobile
              onClose={closeDrawer}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Right Column (header + content)                              */}
      {/* ============================================================ */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ---- Top Header (mobile only) ---- */}
        <header className="flex h-14 shrink-0 items-center border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          <button
            type="button"
            onClick={openDrawer}
            aria-label="Open navigation menu"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Menu className="h-5 w-5" />
          </button>

          <span className="ml-3 text-sm font-bold text-slate-900 dark:text-white">
            PortKey
          </span>
        </header>

        {/* ---- Scrollable main content ---- */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
