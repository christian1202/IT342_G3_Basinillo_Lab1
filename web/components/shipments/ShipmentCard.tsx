"use client";

import {
  Ship,
  Calendar,
  Package,
  Tag,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import type { IShipment } from "@/types/database";

/* ================================================================== */
/*  STATUS STYLING MAP                                                 */
/*  5-stage lifecycle: ARRIVED → LODGED → ASSESSED → PAID → RELEASED  */
/* ================================================================== */

const STATUS_STYLES: Record<
  string,
  { badge: string; dot: string; label: string }
> = {
  ARRIVED: {
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    dot: "bg-cyan-500",
    label: "Arrived",
  },
  LODGED: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    dot: "bg-blue-500",
    label: "Lodged",
  },
  ASSESSED: {
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    dot: "bg-amber-500",
    label: "Assessed",
  },
  PAID: {
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    dot: "bg-violet-500",
    label: "Paid",
  },
  RELEASED: {
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
    label: "Released",
  },
};

const LANE_STYLES: Record<string, { badge: string; label: string }> = {
  PENDING: {
    badge:
      "bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-400",
    label: "Pending",
  },
  GREEN: {
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    label: "Green",
  },
  YELLOW: {
    badge:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    label: "Yellow",
  },
  RED: {
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    label: "Red",
  },
};

const DEFAULT_STATUS_STYLE = {
  badge: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  dot: "bg-slate-500",
  label: "Unknown",
};

/* ================================================================== */
/*  Doomsday Countdown helpers                                         */
/* ================================================================== */

function getDaysRemaining(doomsdayDate?: string): number | null {
  if (!doomsdayDate) return null;
  return Math.ceil(
    (new Date(doomsdayDate).getTime() - Date.now()) / 86_400_000,
  );
}

function getDoomsdayColor(days: number): string {
  if (days <= 0) return "text-red-600 dark:text-red-400";
  if (days <= 3) return "text-amber-600 dark:text-amber-400";
  return "text-emerald-600 dark:text-emerald-400";
}

function getDoomsdayPulse(days: number): string {
  if (days <= 0) return "animate-pulse";
  if (days <= 3) return "animate-pulse";
  return "";
}

/* ================================================================== */
/*  ShipmentCard                                                       */
/*  Displays a single shipment with status, lane, doomsday countdown.  */
/* ================================================================== */

interface ShipmentCardProps {
  shipment: IShipment;
  onClick?: (shipment: IShipment) => void;
  onDelete?: (shipment: IShipment) => void;
}

export default function ShipmentCard({
  shipment,
  onClick,
  onDelete,
}: ShipmentCardProps): React.JSX.Element {
  const statusStyle = STATUS_STYLES[shipment.status] ?? DEFAULT_STATUS_STYLE;
  const laneStyle = LANE_STYLES[shipment.laneStatus];
  const daysRemaining = getDaysRemaining(shipment.doomsdayDate);

  const formattedArrival = shipment.arrivalDate
    ? new Date(shipment.arrivalDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <article
      className="group relative cursor-pointer rounded-xl border border-slate-200/60 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/70 dark:hover:border-indigo-600"
      onClick={() => onClick?.(shipment)}
    >
      {/* ---- Top Row: BL Number + Badges ---- */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Tag className="h-4 w-4 shrink-0 text-indigo-500" />
          <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
            {shipment.blNumber}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
            {statusStyle.label}
          </span>

          {/* Lane Badge */}
          {laneStyle && (
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${laneStyle.badge}`}
            >
              {laneStyle.label}
            </span>
          )}
        </div>
      </div>

      {/* ---- Detail Grid ---- */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {/* Vessel */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Ship className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
          <span className="truncate">{shipment.vesselName || "—"}</span>
        </div>

        {/* Container */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Package className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
          <span className="truncate">{shipment.containerNumber || "—"}</span>
        </div>

        {/* Arrival Date */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
          <span>{formattedArrival}</span>
        </div>
      </div>

      {/* ---- Doomsday Countdown ---- */}
      {daysRemaining !== null && shipment.status !== "RELEASED" && (
        <div
          className={`mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${getDoomsdayColor(daysRemaining)} ${getDoomsdayPulse(daysRemaining)} border-current/20 bg-current/5`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          {daysRemaining <= 0
            ? `${Math.abs(daysRemaining)} day(s) overdue — demurrage accruing`
            : `${daysRemaining} day(s) until doomsday`}
        </div>
      )}

      {/* ---- Bottom Row: client + items/docs counts ---- */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{shipment.clientName || "No client"}</span>
        <span>
          {shipment.itemCount} items · {shipment.documentCount} docs
        </span>
      </div>

      {/* ---- Delete Button ---- */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (
              window.confirm("Are you sure you want to delete this shipment?")
            ) {
              onDelete(shipment);
            }
          }}
          className="absolute -right-2 -top-2 rounded-full border border-slate-200 bg-white p-2 text-slate-400 opacity-0 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 md:right-4 md:top-4 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Delete shipment"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </article>
  );
}
