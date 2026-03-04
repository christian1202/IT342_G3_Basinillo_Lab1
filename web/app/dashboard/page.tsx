"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { useShipments } from "@/hooks/useShipments";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import DemurrageWatch from "@/components/dashboard/DemurrageWatch";
import ActiveShipmentsTable from "@/components/dashboard/ActiveShipmentsTable";
import type { IShipment } from "@/types/database";

/* ================================================================== */
/*  Dashboard Overview Page                                            */
/*  Layout: Header → Stat Cards → Demurrage Watch → Active Shipments  */
/* ================================================================== */

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { user } = useUser();
  const { shipments, isLoading, error, loadShipments } = useShipments();

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  const handleShipmentAction = (shipment: IShipment) => {
    router.push(`/shipments/${shipment.id}`);
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-[1400px] space-y-8">
          {/* ======================================================== */}
          {/*  Page Header                                              */}
          {/* ======================================================== */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Overview
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Welcome back, here&apos;s what&apos;s happening with your
                shipments today.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search bill of lading..."
                  className="h-9 w-56 rounded-lg border bg-transparent pl-9 pr-3 text-sm text-slate-300 placeholder-slate-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                  style={{ borderColor: "#1F2937" }}
                />
              </div>

              {/* Notification Bell */}
              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-white/5"
                style={{ borderColor: "#1F2937" }}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </header>

          {/* ======================================================== */}
          {/*  Error State                                              */}
          {/* ======================================================== */}
          {!isLoading && error && (
            <div
              className="rounded-xl border border-red-500/30 px-4 py-3 text-sm text-red-400"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.08)" }}
            >
              {error}
            </div>
          )}

          {/* ======================================================== */}
          {/*  Stat Cards                                               */}
          {/* ======================================================== */}
          <DashboardMetrics shipments={shipments} isLoading={isLoading} />

          {/* ======================================================== */}
          {/*  Demurrage Watch                                          */}
          {/* ======================================================== */}
          <DemurrageWatch
            shipments={shipments}
            isLoading={isLoading}
            onViewAll={() => router.push("/shipments")}
            onAction={handleShipmentAction}
          />

          {/* ======================================================== */}
          {/*  Active Shipments Table                                   */}
          {/* ======================================================== */}
          <ActiveShipmentsTable shipments={shipments} isLoading={isLoading} />
        </div>
      </div>
    </DashboardLayout>
  );
}
