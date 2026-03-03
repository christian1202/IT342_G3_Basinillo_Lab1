"use client";

import { useEffect, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useShipments } from "@/hooks/useShipments";
import {
  Package,
  Activity,
  CheckCircle2,
  TrendingUp,
  Anchor,
  Calendar,
  AlertTriangle,
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
/*  Analytics Page                                                     */
/*  Shipment analysis with charts — uses backend API via useShipments. */
/* ================================================================== */

/** Status labels for the pie chart. */
const STATUS_LABELS: Record<string, string> = {
  ARRIVED: "Arrived",
  LODGED: "Lodged",
  ASSESSED: "Assessed",
  PAID: "Paid",
  RELEASED: "Released",
};

const COLORS = ["#06b6d4", "#6366f1", "#f59e0b", "#8b5cf6", "#10b981"];

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const { shipments, isLoading, loadShipments } = useShipments();

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  /* ---- Derived Metrics ---- */
  const metrics = useMemo(() => {
    const total = shipments.length;
    if (total === 0)
      return { total: 0, active: 0, released: 0, demurrageRisk: 0 };

    const active = shipments.filter((s) =>
      ["ARRIVED", "LODGED", "ASSESSED", "PAID"].includes(s.status),
    ).length;

    const released = shipments.filter((s) => s.status === "RELEASED").length;

    const demurrageRisk = shipments.filter((s) => {
      if (!s.doomsdayDate || s.status === "RELEASED") return false;
      const days = Math.ceil(
        (new Date(s.doomsdayDate).getTime() - Date.now()) / 86_400_000,
      );
      return days <= 3;
    }).length;

    return { total, active, released, demurrageRisk };
  }, [shipments]);

  const topPorts = useMemo(() => {
    const counts: Record<string, number> = {};
    shipments.forEach((s) => {
      const port = s.portOfDischarge || "Unknown";
      counts[port] = (counts[port] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [shipments]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    shipments.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: STATUS_LABELS[name] || name,
      value,
    }));
  }, [shipments]);

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
                Real-time customs clearance insights
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Calendar className="h-4 w-4" />
              <span>All Time</span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Total Shipments"
              value={metrics.total}
              icon={Package}
              accent="indigo"
            />
            <KPICard
              title="In Progress"
              value={metrics.active}
              icon={Activity}
              accent="violet"
            />
            <KPICard
              title="Released"
              value={metrics.released}
              icon={CheckCircle2}
              accent="emerald"
            />
            <KPICard
              title="Demurrage Risk"
              value={metrics.demurrageRisk}
              icon={AlertTriangle}
              accent="red"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
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
                      {statusData.map((_, index) => (
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

            {/* Top Ports */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-6 flex items-center gap-2">
                <Anchor className="h-5 w-5 text-emerald-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Top Ports of Discharge
                </h3>
              </div>

              <div className="space-y-4">
                {topPorts.length > 0 ? (
                  topPorts.map((port) => (
                    <div key={port.name} className="flex items-center gap-4">
                      <span className="w-32 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                        {port.name}
                      </span>
                      <div className="flex-1">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                            style={{
                              width: `${Math.max(
                                5,
                                (port.count / metrics.total) * 100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="w-8 text-right text-sm font-semibold text-slate-900 dark:text-white">
                        {port.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    No port data available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ================================================================== */
/*  KPICard — Reusable metric card for the analytics grid              */
/* ================================================================== */

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  accent: "indigo" | "violet" | "emerald" | "red";
}

const ACCENT_MAP = {
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    text: "text-indigo-600 dark:text-indigo-400",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    text: "text-violet-600 dark:text-violet-400",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
  },
};

function KPICard({ title, value, icon: Icon, accent }: KPICardProps) {
  const a = ACCENT_MAP[accent];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${a.bg} ${a.text}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
