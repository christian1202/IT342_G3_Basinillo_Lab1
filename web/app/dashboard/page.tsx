"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Ship, AlertTriangle, Package, Users } from "lucide-react";
import { useShipments } from "@/hooks/useShipments";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import ShipmentList from "@/components/shipments/ShipmentList";
import type { IShipment } from "@/types/database";

/* ================================================================== */
/*  Dashboard Overview                                                 */
/*  Shows summary metrics + shipments sorted by demurrage urgency.     */
/* ================================================================== */

/** Sort helper: most urgent doomsday first, nulls last. */
function sortByDemurrageUrgency(a: IShipment, b: IShipment): number {
  if (!a.doomsdayDate && !b.doomsdayDate) return 0;
  if (!a.doomsdayDate) return 1;
  if (!b.doomsdayDate) return -1;
  return (
    new Date(a.doomsdayDate).getTime() - new Date(b.doomsdayDate).getTime()
  );
}

export default function DashboardOverviewPage() {
  const router = useRouter();

  const { shipments, isLoading, error, loadShipments } = useShipments();

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  const sortedShipments = [...shipments]
    .filter((s) => s.status !== "RELEASED")
    .sort(sortByDemurrageUrgency);

  const handleCardClick = (shipment: IShipment) => {
    router.push(`/shipments/${shipment.id}`);
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Overview
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Customs clearance at a glance — sorted by demurrage urgency
            </p>
          </header>

          {/* Metrics */}
          <section className="mb-8">
            <DashboardMetrics shipments={shipments} isLoading={isLoading} />
          </section>

          {/* Active Shipments — Sorted by Urgency */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
              Active Shipments
            </h2>

            {isLoading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-xl border border-slate-200/60 bg-white/80 dark:border-slate-700/60 dark:bg-slate-900/80"
                  />
                ))}
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
                {error}
              </div>
            )}

            {!isLoading && !error && sortedShipments.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <Ship className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No active shipments. All clear!
                </p>
              </div>
            )}

            {!isLoading && !error && sortedShipments.length > 0 && (
              <ShipmentList
                shipments={sortedShipments}
                onCardClick={handleCardClick}
                limit={10}
              />
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
