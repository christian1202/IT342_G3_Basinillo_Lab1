"use client";

import { Ship, Calendar, Package, Tag, Trash2 } from "lucide-react";
import type { IShipment } from "@/types/database";

/* ================================================================== */
/*  STATUS STYLING MAP                                                 */
/*  Maps each ShipmentStatus to a colour set (badge + dot).            */
/*  Extracted as a constant for DRY — used by ShipmentCard below.      */
/* ================================================================== */

const STATUS_STYLES: Record<
  string,
  { badge: string; dot: string; label: string }
> = {
  PENDING: {
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    dot: "bg-amber-500",
    label: "Pending",
  },
  IN_TRANSIT: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    dot: "bg-blue-500",
    label: "In Transit",
  },
  ARRIVED: {
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    dot: "bg-cyan-500",
    label: "Arrived",
  },
  CUSTOMS_HOLD: {
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    dot: "bg-red-500",
    label: "Customs Hold",
  },
  RELEASED: {
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
    label: "Released",
  },
  DELIVERED: {
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    dot: "bg-violet-500",
    label: "Delivered",
  },
};

/** Fallback for unknown statuses to prevent runtime crashes. */
const DEFAULT_STYLE = {
  badge: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  dot: "bg-slate-500",
  label: "Unknown",
};

/* ================================================================== */
/*  ShipmentCard                                                       */
/*  Presentational sub-component for a single shipment list item.      */
/*  Receives data via props — zero business logic.                     */
/* ================================================================== */

interface ShipmentCardProps {
  shipment: IShipment;
  /** Optional click handler for navigating to the detail view. */
  onClick?: (shipment: IShipment) => void;
  /** Optional handler for deleting a shipment. */
  onDelete?: (shipment: IShipment) => void;
}

export default function ShipmentCard({
  shipment,
  onClick,
  onDelete,
}: ShipmentCardProps): React.JSX.Element {
  const style = STATUS_STYLES[shipment.status] ?? DEFAULT_STYLE;

  /* Format ETA for display */
  const formattedArrival = shipment.arrival_date
    ? new Date(shipment.arrival_date).toLocaleDateString("en-US", {
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
      {/* ---- Top Row: BL Number + Status Badge + Edit ---- */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Tag className="h-4 w-4 shrink-0 text-indigo-500" />
          <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
            {shipment.bl_number}
          </h3>
        </div>

        {/* Status Badge + Edit Button Group */}
        <div className="flex items-center gap-4">
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {style.label}
          </span>

          {/* Edit Button (Visible) */}
          <button
            type="button"
            className="text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            aria-label="Edit shipment"
            onClick={(e) => {
              e.stopPropagation(); // Pass up to parent row click (or handle here if preferred, but list usually handles row click)
              onClick?.(shipment);
            }}
          >
            {/* Reusing existing Pencil icon or just text if preferred, but user requested Edit Button specifically. Use Pencil from lucide if available or just text 'Edit' if icon not imported. 
                 Wait, user said "Edit Button (Pencil icon)". I need to check imports.
                 Top imports: Ship, Calendar, Package, Tag, Trash2.
                 I need to import Pencil.
             */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
        </div>
      </div>

      {/* ---- Detail Grid ---- */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {/* Vessel */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Ship className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
          <span className="truncate">{shipment.vessel_name || "—"}</span>
        </div>

        {/* Container */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Package className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
          <span className="truncate">{shipment.container_number || "—"}</span>
        </div>

        {/* ETA */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
          <span>{formattedArrival}</span>
        </div>
      </div>

      {/* ---- Delete Button (visible on hover) ---- */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent card click
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
