"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Ship,
  Package,
  Calendar,
  Tag,
  Hash,
  Anchor,
  DollarSign,
  AlertTriangle,
  Clock,
  RefreshCw,
  FileText,
  ScrollText,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StageProgress from "@/components/shipments/StageProgress";
import DocumentVault from "@/components/documents/DocumentVault";
import { fetchShipmentById } from "@/services/shipmentService";
import type { IShipmentDetail, IAuditLog } from "@/types/database";

/* ================================================================== */
/*  Shipment Detail Page                                               */
/*  Shows full shipment info: stage, metadata, items, docs, audit log  */
/* ================================================================== */

export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shipmentId = params.id as string;

  const [shipment, setShipment] = useState<IShipmentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchShipmentById(shipmentId);
    if (result.error) {
      setError(result.error);
    } else {
      setShipment(result.data);
    }
    setIsLoading(false);
  }, [shipmentId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  /* ---- Doomsday helpers ---- */
  const daysRemaining = shipment?.doomsdayDate
    ? Math.ceil(
        (new Date(shipment.doomsdayDate).getTime() - Date.now()) / 86_400_000,
      )
    : null;

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  /* ---- Loading / Error ---- */
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !shipment) {
    return (
      <DashboardLayout>
        <div className="px-4 py-12 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-red-600 dark:text-red-400">
            {error || "Shipment not found"}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            ← Go back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Back button + Title */}
          <header>
            <button
              onClick={() => router.back()}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {shipment.blNumber}
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {shipment.clientName || "No client"} · Created{" "}
                  {formatDate(shipment.createdAt)}
                </p>
              </div>
              <button
                onClick={loadDetail}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200/60 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-slate-200"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Stage Progress */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
            <h2 className="mb-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
              Clearance Progress
            </h2>
            <StageProgress currentStatus={shipment.status} />
          </section>

          {/* Doomsday Alert */}
          {daysRemaining !== null && shipment.status !== "RELEASED" && (
            <div
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${
                daysRemaining <= 0
                  ? "animate-pulse border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/50 dark:text-red-300"
                  : daysRemaining <= 3
                    ? "animate-pulse border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                    : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
              }`}
            >
              <AlertTriangle className="h-5 w-5 shrink-0" />
              {daysRemaining <= 0
                ? `${Math.abs(daysRemaining)} day(s) overdue — demurrage accruing!`
                : `${daysRemaining} day(s) until doomsday (free time expires ${formatDate(shipment.doomsdayDate)})`}
            </div>
          )}

          {/* Metadata Grid */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
            <h2 className="mb-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
              Shipment Details
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <MetaField
                icon={Tag}
                label="BL Number"
                value={shipment.blNumber}
              />
              <MetaField
                icon={Ship}
                label="Vessel"
                value={shipment.vesselName}
              />
              <MetaField icon={Hash} label="Voyage" value={shipment.voyageNo} />
              <MetaField
                icon={Package}
                label="Container"
                value={shipment.containerNumber}
              />
              <MetaField
                icon={Anchor}
                label="Port"
                value={shipment.portOfDischarge}
              />
              <MetaField
                icon={Calendar}
                label="Arrival"
                value={formatDate(shipment.arrivalDate)}
              />
              <MetaField
                icon={Clock}
                label="Free Days"
                value={shipment.freeTimeDays?.toString()}
              />
              <MetaField
                icon={DollarSign}
                label="Service Fee"
                value={
                  shipment.serviceFee
                    ? `₱${shipment.serviceFee.toLocaleString()}`
                    : undefined
                }
              />
            </div>
          </section>

          {/* Items Table */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <Package className="h-4 w-4" />
              Items ({shipment.items.length})
            </h2>
            {shipment.items.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">
                        Description
                      </th>
                      <th className="px-4 py-2.5 text-right font-medium text-slate-500 dark:text-slate-400">
                        Qty
                      </th>
                      <th className="px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">
                        HS Code
                      </th>
                      <th className="px-4 py-2.5 text-right font-medium text-slate-500 dark:text-slate-400">
                        Unit Value
                      </th>
                      <th className="px-4 py-2.5 text-right font-medium text-slate-500 dark:text-slate-400">
                        Est. Duty
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {shipment.items.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="max-w-[200px] truncate px-4 py-2.5 text-slate-800 dark:text-white">
                          {item.description}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">
                          {item.quantity ?? "—"}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                          {item.hsCode || "—"}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">
                          {item.unitValue
                            ? `${item.currency} ${item.unitValue.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold text-slate-800 dark:text-white">
                          {item.estimatedDuty
                            ? `₱${item.estimatedDuty.toLocaleString()}`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                No items added yet
              </p>
            )}
          </section>

          {/* Document Vault */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <FileText className="h-4 w-4" />
              Document Vault ({shipment.documents.length})
            </h2>
            <DocumentVault
              shipmentId={shipmentId}
              documents={shipment.documents}
              onDocumentsChange={loadDetail}
            />
          </section>

          {/* Audit Log Timeline */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <ScrollText className="h-4 w-4" />
              Audit Trail ({shipment.auditLogs.length})
            </h2>
            {shipment.auditLogs.length > 0 ? (
              <div className="space-y-3">
                {shipment.auditLogs.map((log) => (
                  <AuditEntry key={log.id} log={log} />
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                No audit entries yet
              </p>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

function MetaField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800 dark:text-white">
        {value || "—"}
      </p>
    </div>
  );
}

function AuditEntry({ log }: { log: IAuditLog }) {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {log.action.replace(/_/g, " ")}
        </p>
        {log.newValue && (
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
            → {log.newValue}
          </p>
        )}
        <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
          {new Date(log.timestamp).toLocaleString()} · {log.entityType}
        </p>
      </div>
    </div>
  );
}
