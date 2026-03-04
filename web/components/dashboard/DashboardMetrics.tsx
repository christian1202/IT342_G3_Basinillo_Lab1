"use client";

import { useMemo } from "react";
import {
  LucideIcon,
  Ship,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { IShipment } from "@/types/database";

/* ================================================================== */
/*  DESIGN TOKENS                                                      */
/* ================================================================== */

const CARD_BG = "#131B2E";
const CARD_BORDER = "#1F2937";

/* ================================================================== */
/*  METRIC DEFINITIONS                                                 */
/*  3 cards: Active Shipments, Critical/Overdue, Cleared (MTD)         */
/* ================================================================== */

interface MetricDefinition {
  title: string;
  icon: LucideIcon;
  iconBg: string;
  valueColor: string;
  isCritical?: boolean;
  filter: (s: IShipment) => boolean;
  trendDirection?: "up" | "down";
  trendValue?: string;
  trendSubtext?: string;
}

const METRIC_DEFS: MetricDefinition[] = [
  {
    title: "Active Shipments",
    icon: AlertTriangle,
    iconBg: "bg-amber-500",
    valueColor: "text-white",
    filter: (s) => s.status !== "RELEASED",
    trendDirection: "up",
    trendValue: "12%",
    trendSubtext: "vs last month",
  },
  {
    title: "Critical / Overdue",
    icon: AlertTriangle,
    iconBg: "bg-red-500",
    valueColor: "text-orange-500",
    isCritical: true,
    filter: (s) => {
      if (!s.doomsdayDate || s.status === "RELEASED") return false;
      const days = Math.ceil(
        (new Date(s.doomsdayDate).getTime() - Date.now()) / 86_400_000,
      );
      return days <= 3;
    },
  },
  {
    title: "Cleared (MTD)",
    icon: CheckCircle,
    iconBg: "bg-emerald-500",
    valueColor: "text-white",
    filter: (s) => s.status === "RELEASED",
    trendDirection: "down",
    trendValue: "5%",
    trendSubtext: "vs last month",
  },
];

/* ================================================================== */
/*  MetricCard                                                         */
/* ================================================================== */

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
  valueColor: string;
  isCritical?: boolean;
  trendDirection?: "up" | "down";
  trendValue?: string;
  trendSubtext?: string;
  subtitle?: string;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  iconBg,
  valueColor,
  isCritical,
  trendDirection,
  trendValue,
  trendSubtext,
  subtitle,
}: MetricCardProps): React.JSX.Element {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        isCritical
          ? "border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
          : ""
      }`}
      style={{
        backgroundColor: CARD_BG,
        borderColor: isCritical ? undefined : CARD_BORDER,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-400">{title}</p>
            {isCritical && (
              <span className="h-2 w-2 rounded-full bg-orange-500" />
            )}
          </div>
          <p className={`mt-2 text-4xl font-bold tracking-tight ${valueColor}`}>
            {value.toLocaleString()}
          </p>
          {subtitle && (
            <p className="mt-1.5 text-xs text-blue-400">{subtitle}</p>
          )}
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Trend indicator */}
      {trendDirection && trendValue && (
        <div className="mt-3 flex items-center gap-2">
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              trendDirection === "up"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {trendDirection === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trendValue}
          </div>
          {trendSubtext && (
            <span className="text-xs text-slate-500">{trendSubtext}</span>
          )}
        </div>
      )}
    </article>
  );
}

/* ================================================================== */
/*  Skeleton                                                           */
/* ================================================================== */

function MetricCardSkeleton(): React.JSX.Element {
  return (
    <div
      className="animate-pulse rounded-2xl border p-5"
      style={{ backgroundColor: CARD_BG, borderColor: CARD_BORDER }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-4 w-28 rounded bg-slate-700" />
          <div className="h-10 w-16 rounded bg-slate-700/70" />
        </div>
        <div className="h-10 w-10 rounded-xl bg-slate-700" />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  DashboardMetrics                                                   */
/* ================================================================== */

interface DashboardMetricsProps {
  shipments: IShipment[];
  isLoading: boolean;
}

export default function DashboardMetrics({
  shipments,
  isLoading,
}: DashboardMetricsProps): React.JSX.Element {
  const metrics = useMemo(
    () =>
      METRIC_DEFS.map((def) => {
        const value = shipments.filter(def.filter).length;
        const subtitle =
          def.isCritical && value > 0
            ? `${Math.min(value, 2)} shipments at Manila Port`
            : undefined;
        return { ...def, value, subtitle };
      }),
    [shipments],
  );

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading metrics"
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {METRIC_DEFS.map((def) => (
          <MetricCardSkeleton key={def.title} />
        ))}
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {metrics.map((m) => (
        <MetricCard key={m.title} {...m} />
      ))}
    </div>
  );
}
