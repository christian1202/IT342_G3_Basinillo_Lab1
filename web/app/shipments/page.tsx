"use client";

import { useEffect, useState, useCallback } from "react";
import { Anchor, Plus, RefreshCw } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useShipments } from "@/hooks/useShipments";
import type { IShipment } from "@/types/database";

import DashboardLayout from "@/components/layout/DashboardLayout";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Modal from "@/components/ui/Modal";
import ShipmentList from "@/components/shipments/ShipmentList";
import ShipmentForm from "@/components/shipments/ShipmentForm";

/* ================================================================== */
/*  ShipmentDashboard                                                  */
/*  Displays the current user's shipments inside the DashboardLayout.  */
/* ================================================================== */

export default function ShipmentDashboard(): React.JSX.Element {
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

  /* ---- shipment hook ---- */
  const {
    shipments,
    isLoading,
    error,
    loadShipments,
    refetch,
    removeShipment,
  } = useShipments();

  /* ---- modal & edit state ---- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IShipment | null>(null);

  /* ---- load shipments once userId is known ---- */
  useEffect(() => {
    if (!userId) return;
    loadShipments(userId);
  }, [userId, loadShipments]);

  /* ================================================================ */
  /*  EVENT HANDLERS                                                   */
  /* ================================================================ */

  const handleRetry = useCallback(() => refetch(), [refetch]);

  /** Opens modal in "Create" mode (clears editingItem) */
  const handleOpenCreateModal = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  /** Opens modal in "Edit" mode (sets editingItem) */
  const handleOpenEditModal = useCallback((shipment: IShipment) => {
    setEditingItem(shipment);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // slight delay to prevent UI flicker while modal fades out
    setTimeout(() => setEditingItem(null), 300);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
    refetch();
  }, [refetch]);

  const handleDelete = useCallback(
    async (shipment: IShipment) => {
      await removeShipment(shipment.id);
    },
    [removeShipment],
  );

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* ======================================================== */}
          {/*  Page Header                                               */}
          {/* ======================================================== */}
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  Shipments
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Track your cargo consignments
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Create Button */}
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:from-indigo-700 active:to-violet-700"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Shipment</span>
                </button>

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={handleRetry}
                  aria-label="Refresh shipments"
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200/60 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-slate-200"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          {/* ======================================================== */}
          {/*  Content Card                                               */}
          {/* ======================================================== */}
          <section
            aria-label="Shipment list"
            className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-lg dark:border-slate-700/60 dark:bg-slate-900/80 dark:shadow-slate-900/40 sm:p-8"
          >
            {/* Loading */}
            {isLoading && <SkeletonLoader rows={4} />}

            {/* Error */}
            {!isLoading && error && (
              <ErrorMessage message={error} onRetry={handleRetry} />
            )}

            {/* Empty */}
            {!isLoading && !error && shipments.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <Anchor className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    No shipments yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Create your first shipment to start tracking cargo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500"
                >
                  <Plus className="h-4 w-4" />
                  Create First Shipment
                </button>
              </div>
            )}

            {/* List */}
            {/* Clicking a card now triggers Edit Mode */}
            {!isLoading && !error && shipments.length > 0 && (
              <ShipmentList
                shipments={shipments}
                onCardClick={handleOpenEditModal} // <--- Wire edit handler
                onDelete={handleDelete}
              />
            )}
          </section>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Create/Edit Shipment Modal                                   */}
      {/* ============================================================ */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? "Edit Shipment" : "Create New Shipment"}
      >
        {userId && (
          <ShipmentForm
            userId={userId}
            initialData={editingItem} // <--- Pass item to edit
            onSuccess={handleFormSuccess}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}
