"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Download, MoreVertical, ArrowRight } from "lucide-react";
import type { IShipment } from "@/types/database";

/* ================================================================== */
/*  DESIGN TOKENS                                                      */
/* ================================================================== */

const CARD_BG = "#131B2E";
const CARD_BORDER = "#1F2937";

/* ================================================================== */
/*  ActiveShipmentsTable                                               */
/*  Tabular view: ID, Route/Lane, Stage, ETA, Status, Actions         */
/*  Client-side pagination, 5 rows per page.                           */
/* ================================================================== */

const ROWS_PER_PAGE = 5;

/* ------------------------------------------------------------------ */
/*  Stage Badge Config                                                 */
/* ------------------------------------------------------------------ */

const STAGE_STYLES: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  ARRIVED: {
    bg: "bg-transparent",
    text: "text-cyan-400",
    border: "border-cyan-500/40",
    label: "In Transit",
  },
  LODGED: {
    bg: "bg-transparent",
    text: "text-blue-400",
    border: "border-blue-500/40",
    label: "Customs Clearing",
  },
  ASSESSED: {
    bg: "bg-transparent",
    text: "text-amber-400",
    border: "border-amber-500/40",
    label: "Documentation",
  },
  PAID: {
    bg: "bg-transparent",
    text: "text-violet-400",
    border: "border-violet-500/40",
    label: "Paid",
  },
  RELEASED: {
    bg: "bg-transparent",
    text: "text-emerald-400",
    border: "border-emerald-500/40",
    label: "Released",
  },
};

/* ------------------------------------------------------------------ */
/*  Status Dot                                                         */
/* ------------------------------------------------------------------ */

function getStatusInfo(shipment: IShipment) {
  if (shipment.status === "RELEASED") {
    return { dot: "bg-emerald-400", label: "Cleared" };
  }
  if (shipment.doomsdayDate) {
    const days =
      (new Date(shipment.doomsdayDate).getTime() - Date.now()) / 86_400_000;
    if (days <= 0) return { dot: "bg-red-500", label: "Action Req." };
    if (days <= 3) return { dot: "bg-amber-400", label: "Docs Missing" };
  }
  return { dot: "bg-emerald-400", label: "On Track" };
}

/* ------------------------------------------------------------------ */
/*  Route formatter: "CN-SHA → PH-MNL"                                */
/* ------------------------------------------------------------------ */

function formatRoute(shipment: IShipment): { origin: string; dest: string } {
  const origin = shipment.vesselName
    ? shipment.vesselName.substring(0, 6).toUpperCase()
    : "ORIGIN";
  const dest = shipment.portOfDischarge
    ? shipment.portOfDischarge
        .replace(/\s+/g, "-")
        .substring(0, 6)
        .toUpperCase()
    : "DEST";
  return { origin, dest };
}

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

interface ActiveShipmentsTableProps {
  shipments: IShipment[];
  isLoading: boolean;
}

export default function ActiveShipmentsTable({
  shipments,
  isLoading,
}: ActiveShipmentsTableProps): React.JSX.Element {
  const router = useRouter();
  const [page, setPage] = useState(0);

  const activeShipments = useMemo(
    () => shipments.filter((s) => s.status !== "RELEASED"),
    [shipments],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(activeShipments.length / ROWS_PER_PAGE),
  );
  const pageShipments = activeShipments.slice(
    page * ROWS_PER_PAGE,
    (page + 1) * ROWS_PER_PAGE,
  );
  const startIdx = page * ROWS_PER_PAGE + 1;
  const endIdx = Math.min((page + 1) * ROWS_PER_PAGE, activeShipments.length);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Active Shipments</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-white"
            style={{ borderColor: CARD_BORDER, backgroundColor: CARD_BG }}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-white"
            style={{ borderColor: CARD_BORDER, backgroundColor: CARD_BG }}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{ backgroundColor: CARD_BG, borderColor: CARD_BORDER }}
      >
        {isLoading ? (
          <div className="space-y-3 p-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-slate-800"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left"
                  style={{ borderColor: CARD_BORDER }}
                >
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Shipment ID
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Route / Lane
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Stage
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    ETA
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageShipments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      No active shipments found.
                    </td>
                  </tr>
                ) : (
                  pageShipments.map((s) => {
                    const stage = STAGE_STYLES[s.status] ?? {
                      bg: "bg-transparent",
                      text: "text-slate-400",
                      border: "border-slate-600",
                      label: s.status,
                    };
                    const statusInfo = getStatusInfo(s);
                    const route = formatRoute(s);

                    return (
                      <tr
                        key={s.id}
                        className="border-b transition-colors hover:bg-white/[0.02]"
                        style={{ borderColor: `${CARD_BORDER}80` }}
                      >
                        {/* Shipment ID */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => router.push(`/shipments/${s.id}`)}
                            className="text-left"
                          >
                            <span className="font-medium text-blue-400 hover:text-blue-300 hover:underline">
                              {s.blNumber}
                            </span>
                            <span className="block text-xs text-slate-500">
                              {s.clientName || "—"}
                            </span>
                          </button>
                        </td>

                        {/* Route / Lane */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <span className="font-medium">{route.origin}</span>
                            <ArrowRight className="h-3 w-3 text-slate-600" />
                            <span className="font-medium">{route.dest}</span>
                          </div>
                        </td>

                        {/* Stage Badge */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${stage.bg} ${stage.text} ${stage.border}`}
                          >
                            {stage.label}
                          </span>
                        </td>

                        {/* ETA */}
                        <td className="px-5 py-4 text-sm text-slate-400">
                          {formatDate(s.arrivalDate)}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${statusInfo.dot}`}
                            />
                            <span className="text-sm text-slate-300">
                              {statusInfo.label}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => router.push(`/shipments/${s.id}`)}
                            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
                            aria-label={`Actions for ${s.blNumber}`}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && activeShipments.length > 0 && (
          <div
            className="flex items-center justify-between border-t px-5 py-3"
            style={{ borderColor: CARD_BORDER }}
          >
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-300">
                {startIdx}-{endIdx}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-300">
                {activeShipments.length}
              </span>{" "}
              active shipments
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                style={{ borderColor: CARD_BORDER }}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                style={{ borderColor: CARD_BORDER }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
