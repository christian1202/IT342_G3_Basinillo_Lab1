"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Activity } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { fetchDashboardStatus, DashboardStatusResponse } from "@/lib/api";
import { useShipments } from "@/hooks/useShipments";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";

/* ================================================================== */
/*  DashboardPage                                                      */
/*  Home page: shipment metrics grid + backend connection status.      */
/* ================================================================== */

export default function DashboardPage(): React.JSX.Element {
  /* ---- resolve userId ---- */
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const resolveUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setUserId(session.user.id);
    };
    resolveUser();
  }, []);

  /* ---- shipment data (for metrics) ---- */
  const {
    shipments,
    isLoading: isShipmentsLoading,
    loadShipments,
  } = useShipments();

  useEffect(() => {
    if (!userId) return;
    loadShipments(userId);
  }, [userId, loadShipments]);

  /* ---- backend status ---- */
  const [dashboardData, setDashboardData] =
    useState<DashboardStatusResponse | null>(null);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);

  const loadDashboardStatus = async () => {
    setIsStatusLoading(true);
    setStatusError(null);

    try {
      const data = await fetchDashboardStatus();
      setDashboardData(data);
    } catch (err: unknown) {
      setStatusError(
        err instanceof Error
          ? err.message
          : "Failed to connect to the backend.",
      );
    } finally {
      setIsStatusLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStatus();
  }, []);

  const formattedTimestamp = dashboardData?.timestamp
    ? new Date(dashboardData.timestamp).toLocaleString()
    : "";

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* ======================================================== */}
          {/*  Page Header                                               */}
          {/* ======================================================== */}
          <header className="mb-8">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              Dashboard
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Overview of your shipment operations
            </p>
          </header>

          {/* ======================================================== */}
          {/*  Metrics Grid                                               */}
          {/* ======================================================== */}
          <section aria-label="Shipment metrics" className="mb-8">
            <DashboardMetrics
              shipments={shipments}
              isLoading={isShipmentsLoading}
            />
          </section>

          {/* ======================================================== */}
          {/*  Backend Status Card                                        */}
          {/* ======================================================== */}
          <section aria-label="Backend status" className="max-w-lg">
            <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              System Status
            </h2>

            <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
              {/* Loading */}
              {isStatusLoading && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <RefreshCw className="h-7 w-7 animate-spin text-indigo-500" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Connecting to backend…
                  </p>
                </div>
              )}

              {/* Error */}
              {!isStatusLoading && statusError && (
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
                    {statusError}
                  </div>
                  <button
                    onClick={loadDashboardStatus}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:hover:bg-indigo-950/80"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry
                  </button>
                </div>
              )}

              {/* Success */}
              {!isStatusLoading && !statusError && dashboardData && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {dashboardData.message}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {formattedTimestamp}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {dashboardData.status}
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
