"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Anchor, Plus, RefreshCw, ArrowLeft, LogOut } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useShipments } from "@/hooks/useShipments";
import type { IShipment } from "@/types/database";

import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Modal from "@/components/ui/Modal";
import ShipmentCard from "@/components/shipments/ShipmentCard";
import ShipmentForm from "@/components/shipments/ShipmentForm";

/* ================================================================== */
/*  ShipmentDashboard                                                  */
/*  Main page component that lists the current user's shipments.       */
/*                                                                     */
/*  State flow (early-return pattern):                                 */
/*    1. if (isAuthLoading) → auth spinner                             */
/*    2. if (isLoading)     → SkeletonLoader                          */
/*    3. if (error)         → ErrorMessage with retry                  */
/*    4. else               → ShipmentCard list                        */
/*                                                                     */
/*  Modal integration:                                                 */
/*    • isModalOpen controls the Create Shipment form overlay.         */
/*    • handleCreateSuccess closes the modal and calls refetch().      */
/* ================================================================== */

export default function ShipmentDashboard(): React.JSX.Element {
  const router = useRouter();

  /* ---- auth state (resolve current user) ---- */
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  /* ---- modal state ---- */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ---- shipment hook ---- */
  const { shipments, isLoading, error, loadShipments, refetch } =
    useShipments();

  /* ---- resolve session on mount ---- */
  useEffect(() => {
    const resolveSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUserId(session.user.id);
      setIsAuthLoading(false);
    };

    resolveSession();
  }, [router]);

  /* ---- load shipments once userId is known ---- */
  useEffect(() => {
    if (!userId) return;
    loadShipments(userId);
  }, [userId, loadShipments]);

  /* ================================================================ */
  /*  EVENT HANDLERS (memoized)                                        */
  /* ================================================================ */

  /** Retry / refresh the shipment list. */
  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  /** Sign out and redirect to login. */
  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
  }, [router]);

  /** Navigate to shipment detail (future). */
  const handleCardClick = useCallback((shipment: IShipment) => {
    // Future: router.push(`/shipments/${shipment.id}`);
    console.log("Navigate to shipment:", shipment.id);
  }, []);

  /** Open the create-shipment modal. */
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  /** Close the create-shipment modal. */
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  /**
   * THE GLUE — called by ShipmentForm on successful creation.
   * 1. Closes the modal.
   * 2. Refetches the shipment list so the new entry appears immediately.
   */
  const handleCreateSuccess = useCallback(() => {
    setIsModalOpen(false);
    refetch();
  }, [refetch]);

  /* ================================================================ */
  /*  EARLY RETURN — Auth Loading                                      */
  /* ================================================================ */

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 dark:from-slate-950 dark:via-indigo-950/30 dark:to-violet-950/20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Authenticating…
          </p>
        </div>
      </main>
    );
  }

  /* ================================================================ */
  /*  MAIN RENDER                                                      */
  /* ================================================================ */

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 dark:from-slate-950 dark:via-indigo-950/30 dark:to-violet-950/20 px-4 py-8 sm:px-6 lg:px-8">
      {/* ---- Decorative Blobs ---- */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />
      </div>

      {/* ---- Content Container ---- */}
      <div className="relative mx-auto max-w-4xl">
        {/* ============================================================ */}
        {/*  Header                                                       */}
        {/* ============================================================ */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30">
                <Anchor className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  Shipments
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Track your cargo consignments
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Create New Shipment */}
              <button
                type="button"
                onClick={handleOpenModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:from-indigo-700 active:to-violet-700"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Shipment</span>
              </button>

              {/* Refresh */}
              <button
                type="button"
                onClick={handleRetry}
                aria-label="Refresh shipments"
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200/60 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-slate-200"
              >
                <RefreshCw className="h-4 w-4" />
              </button>

              {/* Sign Out */}
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Sign out"
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* ============================================================ */}
        {/*  Content Card                                                  */}
        {/* ============================================================ */}
        <section
          aria-label="Shipment list"
          className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-lg dark:border-slate-700/60 dark:bg-slate-900/80 dark:shadow-slate-900/40 sm:p-8"
        >
          {/* ---- Loading State ---- */}
          {isLoading && <SkeletonLoader rows={4} />}

          {/* ---- Error State ---- */}
          {!isLoading && error && (
            <ErrorMessage message={error} onRetry={handleRetry} />
          )}

          {/* ---- Empty State ---- */}
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
                onClick={handleOpenModal}
                className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500"
              >
                <Plus className="h-4 w-4" />
                Create First Shipment
              </button>
            </div>
          )}

          {/* ---- Shipment List ---- */}
          {!isLoading && !error && shipments.length > 0 && (
            <div className="space-y-3">
              {shipments.map((shipment) => (
                <ShipmentCard
                  key={shipment.id}
                  shipment={shipment}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          )}
        </section>

        {/* ---- Back Link ---- */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>

      {/* ============================================================ */}
      {/*  Create Shipment Modal                                         */}
      {/* ============================================================ */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Shipment"
      >
        {userId && (
          <ShipmentForm
            userId={userId}
            onSuccess={handleCreateSuccess}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </main>
  );
}
