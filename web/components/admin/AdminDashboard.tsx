"use client";

import { useAdminData } from "@/hooks/useAdminData";
import { Loader2 } from "lucide-react";
import { KPICards } from "./KPICards";
import { RevenueChart } from "./RevenueChart";
import { StaffTable } from "./StaffTable";

export default function AdminDashboard() {
  const { users, metrics, loading, refresh } = useAdminData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <Loader2 className="animate-spin h-8 w-8 mr-2" />
        Loading Portkey Command Center...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Section */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Operations Overview
        </h2>
        <KPICards
          totalRevenue={metrics.totalRevenue}
          activeShipments={metrics.activeShipments}
          delayedShipments={metrics.delayedShipments}
          totalClients={metrics.uniqueClients}
        />
      </section>

      {/* Analytics Section */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Financial Performance
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <RevenueChart data={metrics.chartData} />
        </div>
      </section>

      {/* Staff Portal Section */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Staff Portal</h2>
        <StaffTable users={users} onRefresh={refresh} />
      </section>
    </div>
  );
}
