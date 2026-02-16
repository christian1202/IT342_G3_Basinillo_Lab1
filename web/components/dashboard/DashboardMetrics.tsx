"use client";

import { useMemo } from "react";
import { LucideIcon, Package, Truck, CheckCircle, Clock } from "lucide-react";
import type { IShipment } from "@/types/database";

/* ================================================================== */
/*  METRIC DEFINITIONS                                                 */
/*  Config-driven: add a new card by adding an entry here.             */
/*  Each definition maps a label → a filter fn + visual styling.       */
/* ================================================================== */

interface MetricDefinition {
  title: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon container gradient. */
  iconBg: string;
  /** Tailwind class for the icon container shadow colour. */
  iconShadow: string;
  /** Tailwind class for the value text colour. */
  valueColor: string;
  /** Filter function applied to shipments to derive the count. */
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
    title: "In Transit",
    icon: Truck,
    iconBg: "from-amber-500 to-orange-500",
    iconShadow: "shadow-amber-500/30",
    valueColor: "text-amber-700 dark:text-amber-400",
    filter: (s) => s.status === "IN_TRANSIT",
  },
  {
    title: "Delivered",
    icon: CheckCircle,
    iconBg: "from-emerald-600 to-green-600",
    iconShadow: "shadow-emerald-500/30",
    valueColor: "text-emerald-700 dark:text-emerald-400",
    filter: (s) => s.status === "DELIVERED",
  },
  {
    title: "Pending",
    icon: Clock,
    iconBg: "from-slate-500 to-slate-600",
    iconShadow: "shadow-slate-500/30",
    valueColor: "text-slate-700 dark:text-slate-400",
    filter: (s) => s.status === "PENDING",
  },
];

/* ================================================================== */
/*  MetricCard — Reusable sub-component                                */
/*  Displays a single stat (title + count + icon).                     */
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
      {/* Icon */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconBg} shadow-lg ${iconShadow}`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>

      {/* Text */}
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
/*  MetricCardSkeleton — Pulsating placeholder during loading          */
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
/*  Derives counts from the shipments array via useMemo.               */
/*                                                                     */
/*  Props:                                                             */
/*    • shipments — array of IShipment (from the hook / parent)        */
/*    • isLoading — when true, renders 4 skeleton cards                */
/* ================================================================== */

interface DashboardMetricsProps {
  /** The full shipments list to derive stats from. */
  shipments: IShipment[];
  /** When true, renders skeleton placeholders instead of real data. */
  isLoading: boolean;
}

export default function DashboardMetrics({
  shipments,
  isLoading,
}: DashboardMetricsProps): React.JSX.Element {
  /**
   * Derive all metric counts in a single pass through the array.
   * useMemo ensures this only re-runs when `shipments` changes.
   */
  const metrics = useMemo(() => {
    return METRIC_DEFS.map((def) => ({
      ...def,
      value: shipments.filter(def.filter).length,
    }));
  }, [shipments]);

  /* ---- Loading State ---- */
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

  /* ---- Metrics Grid ---- */
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
