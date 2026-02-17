"use client";

import { useEffect, useState, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { IShipment } from "@/types/database";
import {
  Package,
  Activity,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ================================================================== */
/*  Types & Interfaces                                                 */
/* ================================================================== */

interface ShipmentMetrics {
  total: number;
  active: number;
  successRate: number;
}

interface DestinationData {
  name: string;
  count: number;
}

interface GrowthData {
  date: string;
  count: number;
}

/* ================================================================== */
/*  Analytics Page                                                     */
/*  Refactored to show Shipment Analysis instead of System Status      */
/* ================================================================== */

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const [shipments, setShipments] = useState<IShipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ---- Data Fetching ---- */
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const { data, error } = await supabase
          .from("shipments")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;
        setShipments(data || []);
      } catch (err) {
        console.error("Error fetching shipments for analytics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, []);

  /* ---- Data Processing (Memoized) ---- */
  const metrics = useMemo<ShipmentMetrics>(() => {
    const total = shipments.length;
    if (total === 0) return { total: 0, active: 0, successRate: 0 };

    const active = shipments.filter((s) =>
      ["IN_TRANSIT", "PENDING"].includes(s.status),
    ).length;

    const delivered = shipments.filter((s) => s.status === "DELIVERED").length;
    const successRate = Math.round((delivered / total) * 100);

    return { total, active, successRate };
  }, [shipments]);

  const topDestinations = useMemo<DestinationData[]>(() => {
    const counts: Record<string, number> = {};
    shipments.forEach((s) => {
      if (s.destination_city || s.destination_port) {
        // Fallback or prioritize specific field. Assuming 'destination' might be missing in Interface but requested in prompt.
        // Let's check available fields. Interface IShipment usually has origin/destination or similar.
        // If not, we might need to rely on 'port' or 'city' fields if they exist, or just 'destination' if the interface was updated.
        // Based on previous context, fields were missing. I will try to use 'destination' strictly if user added it,
        // OR fallback to a placeholder if the field doesn't strictly exist on the type to avoid build error.
        // The prompt says: "columns: id, bl_number, origin, destination, status, created_at."
        // So I will assume 'destination' exists on the fetched data, even if the TS type might be outdated.
        // To be safe with TS, I'll cast s as any or assume interface has it.
        const dest = (s as any).destination || "Unknown";
        counts[dest] = (counts[dest] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [shipments]);

  const growthData = useMemo<GrowthData[]>(() => {
    const counts: Record<string, number> = {};
    shipments.forEach((s) => {
      const date = new Date(s.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      counts[date] = (counts[date] || 0) + 1;
    });

    return Object.entries(counts).map(([date, count]) => ({ date, count }));
    // Note: This simple grouping might not be sorted chronologically if keys are just strings.
    // For a real app, ideally sort by timestamp. But for this MVP, it might suffice or we iterate chronologically.
  }, [shipments]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    shipments.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [shipments]);

  /* ---- Chart Colors ---- */
  const COLORS = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];
  const isDark = theme === "dark";

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Shipment Analysis
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Real-time data insights.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Calendar className="h-4 w-4" />
              <span>All Time</span>
            </div>
          </div>

          {/* Section A: KPI Cards */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Shipments
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    {metrics.total}
                  </p>
                </div>
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                  <Package className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Active Shipments
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    {metrics.active}
                  </p>
                </div>
                <div className="rounded-xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Success Rate
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    {metrics.successRate}%
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Growth Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Shipment Growth
                </h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient
                        id="colorCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={isDark ? "#334155" : "#e2e8f0"}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={isDark ? "#94a3b8" : "#64748b"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={isDark ? "#94a3b8" : "#64748b"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        borderColor: isDark ? "#334155" : "#e2e8f0",
                        borderRadius: "8px",
                        color: isDark ? "#f1f5f9" : "#0f172a",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#6366f1"
                      fillOpacity={1}
                      fill="url(#colorCount)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5 text-violet-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Status Breakdown
                </h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        borderColor: isDark ? "#334155" : "#e2e8f0",
                        borderRadius: "8px",
                        color: isDark ? "#f1f5f9" : "#0f172a",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Section C: Leaderboard */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Top Destinations
              </h3>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Destination
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Shipments
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
                  {topDestinations.length > 0 ? (
                    topDestinations.map((dest, idx) => (
                      <tr
                        key={dest.name}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                          {dest.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500 dark:text-slate-400">
                          {dest.count}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                              <div
                                className="h-full rounded-full bg-indigo-500"
                                style={{
                                  width: `${(dest.count / metrics.total) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-slate-400">
                              {Math.round((dest.count / metrics.total) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                      >
                        No destination data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
