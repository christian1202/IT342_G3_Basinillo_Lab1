"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Activity } from "lucide-react";

import { fetchDashboardStatus, DashboardStatusResponse } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";

/* ================================================================== */
/*  DashboardPage                                                      */
/*  Displays real-time backend connection status inside the layout.    */
/* ================================================================== */

export default function DashboardPage(): React.JSX.Element {
  /* ---- state ---- */
  const [dashboardData, setDashboardData] =
    useState<DashboardStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---- fetch helper ---- */
  const loadDashboardStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchDashboardStatus();
      setDashboardData(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to the backend.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ---- fetch on mount ---- */
  useEffect(() => {
    loadDashboardStatus();
  }, []);

  /* ---- format timestamp ---- */
  const formattedTimestamp = dashboardData?.timestamp
    ? new Date(dashboardData.timestamp).toLocaleString()
    : "";

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* ---- Header ---- */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Backend connection status
            </p>
          </div>

          {/* ---- Card ---- */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-lg dark:border-slate-700/60 dark:bg-slate-900/80 dark:shadow-slate-900/40">
            {/* Loading */}
            {isLoading && (
              <div className="flex flex-col items-center gap-4 py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Connecting to backend…
                </p>
              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
                  {error}
                </div>
                <button
                  onClick={loadDashboardStatus}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:hover:bg-indigo-950/80"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry Connection
                </button>
              </div>
            )}

            {/* Success */}
            {!isLoading && !error && dashboardData && (
              <div className="space-y-5">
                {/* Status badge */}
                <div className="flex items-center justify-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    {dashboardData.status}
                  </span>
                </div>

                {/* Message */}
                <p className="text-center text-base font-medium text-slate-700 dark:text-slate-200">
                  {dashboardData.message}
                </p>

                {/* Timestamp */}
                <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                  Responded at: {formattedTimestamp}
                </p>

                {/* Refresh */}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={loadDashboardStatus}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
