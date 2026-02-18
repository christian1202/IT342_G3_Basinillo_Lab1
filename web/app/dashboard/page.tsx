"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, PackageOpen, Search } from "lucide-react";

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

  /* ---- features state: search ---- */
  const [searchQuery, setSearchQuery] = useState("");
  // Removed local darkMode state in favor of global theme

  /* ---- derived filtering logic ---- */
  const filteredShipments = useMemo(() => {
    if (!searchQuery) return shipments;
    const lowerQuery = searchQuery.toLowerCase();
    return shipments.filter((s) => {
      return (
        s.bl_number.toLowerCase().includes(lowerQuery) ||
        (s.vessel_name && s.vessel_name.toLowerCase().includes(lowerQuery)) ||
        (s.container_number &&
          s.container_number.toLowerCase().includes(lowerQuery))
      );
    });
  }, [shipments, searchQuery]);

  const hasData = !isLoading && !error && filteredShipments.length > 0;
  const isEmpty = !isLoading && !error && filteredShipments.length === 0;

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

  // Removed wrapper div with local darkMode toggle class logic
  // because ThemeProvider handles it at the root.

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <DashboardLayout>
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-8">
            {/* ======================================================== */}
            {/*  Page Header                                               */}
            {/* ======================================================== */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  Dashboard
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Overview of your logistics
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search Bar */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 sm:w-64"
                    placeholder="Search BL, Vessel, Container..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* "New Shipment" button — visible only when data exists (or filtered) */}
                {(shipments.length > 0 || searchQuery) && (
                  <button
                    type="button"
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:from-indigo-700 active:to-violet-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Shipment</span>
                  </button>
                )}
              </div>
            </header>

            {/* ======================================================== */}
            {/*  Loading                                                   */}
            {/* ======================================================== */}
            {isLoading && (
              <>
                <DashboardMetrics shipments={[]} isLoading />
                <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80 sm:p-8">
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
            {/*  Empty State (No Data)                                     */}
            {/* ======================================================== */}
            {!isLoading && !error && shipments.length === 0 && (
              <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-10 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80 sm:p-14">
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
                    onClick={handleOpenCreateModal}
                    className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500"
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Shipment
                  </button>
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/*  Empty State (No Filter Results)                           */}
            {/* ======================================================== */}
            {!isLoading &&
              !error &&
              shipments.length > 0 &&
              filteredShipments.length === 0 && (
                <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-10 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80 sm:p-10 text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    No shipments found matching &quot;
                    <strong>{searchQuery}</strong>&quot;.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    Clear Search
                  </button>
                </section>
              )}

            {/* ======================================================== */}
            {/*  Metrics Grid (Uses filtered data if desired, or all?)      */}
            {/*  Usually metrics should reflect ALL data, not filtered.    */}
            {/* ======================================================== */}
            {shipments.length > 0 && (
              <section aria-label="Shipment metrics">
                <DashboardMetrics shipments={shipments} isLoading={false} />
              </section>
            )}

            {/* ======================================================== */}
            {/*  Recent Shipments (Filtered)                               */}
            {/* ======================================================== */}
            {hasData && (
              <section aria-label="Recent shipments">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Recent Shipments
                  </h2>
                  {filteredShipments.length > RECENT_SHIPMENTS_LIMIT && (
                    <button
                      type="button"
                      onClick={handleViewAll}
                      className="text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      View all →
                    </button>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80 sm:p-6 transition-colors duration-300">
                  <ShipmentList
                    shipments={filteredShipments}
                    onCardClick={handleOpenEditModal}
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
              initialData={editingItem}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseModal}
            />
          )}
        </Modal>
      </DashboardLayout>
    </div>
  );
}
