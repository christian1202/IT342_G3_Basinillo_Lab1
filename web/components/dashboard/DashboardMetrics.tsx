"use client";

import { useMemo } from "react";
import {
  LucideIcon,
  Package,
  Anchor,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import type { IShipment } from "@/types/database";

/* ================================================================== */
/*  METRIC DEFINITIONS                                                 */
/*  Maps each metric → a filter function + visual styling.             */
/*  Uses the 5-stage lifecycle: ARRIVED→LODGED→ASSESSED→PAID→RELEASED  */
/* ================================================================== */

interface MetricDefinition {
  title: string;
  icon: LucideIcon;
  iconBg: string;
  iconShadow: string;
  valueColor: string;
  filter: (s: IShipment) => boolean;
}

const METRIC_DEFS: MetricDefinition[] = [
  {
    title: "Total Shipments",
    icon: Package,
    iconBg: "from-blue-600 to-cyan-600",
    iconShadow: "shadow-blue-500/30",
    valueColor: "text-blue-700 dark:text-blue-400",
    filter: () => true,
  },
  {
    title: "In Progress",
    icon: Clock,
    iconBg: "from-amber-500 to-orange-500",
    iconShadow: "shadow-amber-500/30",
    valueColor: "text-amber-700 dark:text-amber-400",
    filter: (s) => ["ARRIVED", "LODGED", "ASSESSED", "PAID"].includes(s.status),
  },
  {
    title: "Released",
    icon: CheckCircle,
    iconBg: "from-emerald-600 to-green-600",
    iconShadow: "shadow-emerald-500/30",
    valueColor: "text-emerald-700 dark:text-emerald-400",
    filter: (s) => s.status === "RELEASED",
  },
  {
    title: "Demurrage Risk",
    icon: AlertTriangle,
    iconBg: "from-red-500 to-rose-600",
    iconShadow: "shadow-red-500/30",
    valueColor: "text-red-700 dark:text-red-400",
    filter: (s) => {
      if (!s.doomsdayDate) return false;
      const days = Math.ceil(
        (new Date(s.doomsdayDate).getTime() - Date.now()) / 86_400_000,
      );
      return days <= 3 && s.status !== "RELEASED";
    },
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
  iconShadow: string;
  valueColor: string;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconShadow,
  valueColor,
}: MetricCardProps): React.JSX.Element {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/80">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconBg} shadow-lg ${iconShadow}`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      </div>
    </article>
  );
}

/* ================================================================== */
/*  MetricCardSkeleton                                                 */
/* ================================================================== */

function MetricCardSkeleton(): React.JSX.Element {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-slate-700/60 dark:bg-slate-900/80">
      <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-2">
        <div className="h-3 w-20 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-12 rounded-lg bg-slate-200/70 dark:bg-slate-700/70" />
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
  const metrics = useMemo(() => {
    return METRIC_DEFS.map((def) => ({
      ...def,
      value: shipments.filter(def.filter).length,
    }));
  }, [shipments]);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading metrics"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {METRIC_DEFS.map((def) => (
          <MetricCardSkeleton key={def.title} />
        ))}
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map(({ title, value, icon, iconBg, iconShadow, valueColor }) => (
        <MetricCard
          key={title}
          title={title}
          value={value}
          icon={icon}
          iconBg={iconBg}
          iconShadow={iconShadow}
          valueColor={valueColor}
        />
      ))}
    </div>
  );
}
