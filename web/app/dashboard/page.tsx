"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, PackageOpen } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useShipments } from "@/hooks/useShipments";
import type { IShipment } from "@/types/database";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import ShipmentList from "@/components/shipments/ShipmentList";
import ShipmentForm from "@/components/shipments/ShipmentForm";
import Modal from "@/components/ui/Modal";
import ErrorMessage from "@/components/ui/ErrorMessage";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

/* ================================================================== */
/*  Dashboard Page                                                     */
/*  The main hub that composes all child components.                   */
/* ================================================================== */

const RECENT_SHIPMENTS_LIMIT = 5;

export default function DashboardPage(): React.JSX.Element {
  const router = useRouter();

  /* ---- resolve userId from session ---- */
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const resolveUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setUserId(session.user.id);
    };
    resolveUser();
  }, []);

  /* ---- single data source ---- */
  const {
    shipments,
    isLoading,
    error,
    loadShipments,
    refetch,
    removeShipment,
  } = useShipments();

  useEffect(() => {
    if (!userId) return;
    loadShipments(userId);
  }, [userId, loadShipments]);

  /* ---- modal & edit state ---- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IShipment | null>(null);

  /* ---- derived booleans ---- */
  const hasData = !isLoading && !error && shipments.length > 0;
  const isEmpty = !isLoading && !error && shipments.length === 0;

  /* ================================================================ */
  /*  EVENT HANDLERS                                                   */
  /* ================================================================ */

  const handleRetry = useCallback(() => refetch(), [refetch]);

  /** Opens Create Modal (clears edit state) */
  const handleOpenCreateModal = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  /** Opens Edit Modal (sets edit state) */
  const handleOpenEditModal = useCallback((shipment: IShipment) => {
    setEditingItem(shipment);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setEditingItem(null), 300);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
    refetch();
  }, [refetch]);

  const handleDelete = useCallback(
    async (shipment: IShipment) => {
      const success = await removeShipment(shipment.id);
      if (success) {
        // refetch() // optional, hook handles opt-update
      }
    },
    [removeShipment],
  );

  const handleViewAll = useCallback(() => {
    router.push("/shipments");
  }, [router]);

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* ======================================================== */}
          {/*  Page Header                                               */}
          {/* ======================================================== */}
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                Dashboard
              </h1>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Overview of your logistics
              </p>
            </div>

            {/* "New Shipment" button — visible only when data exists */}
            {hasData && (
              <button
                type="button"
                onClick={handleOpenCreateModal} // <--- Wire create handler
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:from-indigo-700 active:to-violet-700"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Shipment</span>
              </button>
            )}
          </header>

          {/* ======================================================== */}
          {/*  Loading                                                   */}
          {/* ======================================================== */}
          {isLoading && (
            <>
              <DashboardMetrics shipments={[]} isLoading />
              <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80 sm:p-8">
                <SkeletonLoader rows={4} />
              </section>
            </>
          )}

          {/* ======================================================== */}
          {/*  Error                                                     */}
          {/* ======================================================== */}
          {!isLoading && error && (
            <ErrorMessage message={error} onRetry={handleRetry} />
          )}

          {/* ======================================================== */}
          {/*  Empty                                                     */}
          {/* ======================================================== */}
          {isEmpty && (
            <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-10 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80 sm:p-14">
              <div className="flex flex-col items-center gap-5 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950/40 dark:to-violet-950/40">
                  <PackageOpen className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    No shipments yet
                  </h2>
                  <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    Create your first shipment to see real-time metrics and
                    tracking info on this dashboard.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenCreateModal} // <--- Wire create handler
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Shipment
                </button>
              </div>
            </section>
          )}

          {/* ======================================================== */}
          {/*  Metrics Grid                                              */}
          {/* ======================================================== */}
          {hasData && (
            <section aria-label="Shipment metrics">
              <DashboardMetrics shipments={shipments} isLoading={false} />
            </section>
          )}

          {/* ======================================================== */}
          {/*  Recent Shipments                                          */}
          {/* ======================================================== */}
          {hasData && (
            <section aria-label="Recent shipments">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Recent Shipments
                </h2>
                {shipments.length > RECENT_SHIPMENTS_LIMIT && (
                  <button
                    type="button"
                    onClick={handleViewAll}
                    className="text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    View all →
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80 sm:p-6">
                <ShipmentList
                  shipments={shipments}
                  onCardClick={handleOpenEditModal} // <--- Edit on click
                  limit={RECENT_SHIPMENTS_LIMIT}
                  onDelete={handleDelete}
                />
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Create/Edit Modal                                             */}
      {/* ============================================================ */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? "Edit Shipment" : "Create New Shipment"}
      >
        {userId && (
          <ShipmentForm
            userId={userId}
            initialData={editingItem} // <--- Pass editingItem
            onSuccess={handleFormSuccess}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}
