"use client";

import { useState, useCallback, useRef } from "react";
import type {
  IShipment,
  ICreateShipmentPayload,
  IUpdateShipmentPayload,
} from "@/types/database";
import {
  createShipment,
  fetchShipmentsByUser,
  fetchShipmentById,
  updateShipment,
  deleteShipment,
} from "@/services/shipmentService";

/* ================================================================== */
/*  useShipments                                                       */
/*  Custom hook for all shipment operations.                           */
/*                                                                     */
/*  Exposes:                                                           */
/*    • shipments / shipment   — data payloads                         */
/*    • isLoading              — for skeletons / spinners              */
/*    • error                  — nullable error string                 */
/*    • loadShipments()        — fetch list by user                    */
/*    • loadShipment()         — fetch single by id                    */
/*    • refetch()              — re-run last loadShipments call        */
/*    • addShipment()          — create new                            */
/*    • editShipment()         — update existing                       */
/*    • removeShipment()       — delete                                */
/* ================================================================== */

export function useShipments() {
  /* ----------------------- state ---------------------------------- */
  const [shipments, setShipments] = useState<IShipment[]>([]);
  const [shipment, setShipment] = useState<IShipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ref that remembers the last userId passed to loadShipments.
   * Used by refetch() so we can re-run the query without the
   * caller needing to pass the userId again.
   */
  const lastUserIdRef = useRef<string | null>(null);

  /* ----------------------- LIST ----------------------------------- */

  /**
   * Fetches all shipments belonging to the given user (newest first).
   * Also stores the userId so refetch() can repeat the call.
   *
   * @param userId - UUID of the shipment owner
   */
  const loadShipments = useCallback(async (userId: string) => {
    lastUserIdRef.current = userId;
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchShipmentsByUser(userId);

      if (result.error) {
        setError(result.error);
        return;
      }

      setShipments(result.data ?? []);
    } catch (unexpected) {
      setError("An unexpected error occurred while loading shipments.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ----------------------- REFETCH -------------------------------- */

  /**
   * Re-runs the last loadShipments call using the stored userId.
   * Ideal for refreshing the list after a create, update, or delete
   * without requiring the caller to track the userId.
   */
  const refetch = useCallback(async () => {
    if (!lastUserIdRef.current) return;
    await loadShipments(lastUserIdRef.current);
  }, [loadShipments]);

  /* ----------------------- SINGLE --------------------------------- */

  /**
   * Fetches a single shipment by its database ID.
   * Use this when navigating to a shipment detail page.
   *
   * @param shipmentId - UUID of the shipment
   */
  const loadShipment = useCallback(async (shipmentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchShipmentById(shipmentId);

      if (result.error) {
        setError(result.error);
        return;
      }

      setShipment(result.data);
    } catch (unexpected) {
      setError("An unexpected error occurred while loading the shipment.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ----------------------- CREATE --------------------------------- */

  /**
   * Creates a new shipment and appends it to the local list.
   * Returns the created shipment on success, or null on failure.
   *
   * @param payload - The shipment fields to insert
   */
  const addShipment = useCallback(
    async (payload: ICreateShipmentPayload): Promise<IShipment | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createShipment(payload);

        if (result.error) {
          setError(result.error);
          return null;
        }

        const created = result.data!;
        setShipments((prev) => [created, ...prev]);
        return created;
      } catch (unexpected) {
        setError("An unexpected error occurred while creating the shipment.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /* ----------------------- UPDATE --------------------------------- */

  /**
   * Updates mutable fields on an existing shipment and patches
   * the local list in-place so the UI reflects changes immediately.
   *
   * @param shipmentId - UUID of the shipment to update
   * @param payload    - Only the fields to change
   */
  const editShipment = useCallback(
    async (
      shipmentId: string,
      payload: IUpdateShipmentPayload,
    ): Promise<IShipment | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateShipment(shipmentId, payload);

        if (result.error) {
          setError(result.error);
          return null;
        }

        const updated = result.data!;

        /* Patch the list so the UI updates without a full refetch */
        setShipments((prev) =>
          prev.map((s) => (s.id === shipmentId ? updated : s)),
        );

        /* Also update the single-shipment state if it matches */
        setShipment((prev) => (prev?.id === shipmentId ? updated : prev));

        return updated;
      } catch (unexpected) {
        setError("An unexpected error occurred while updating the shipment.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /* ----------------------- DELETE --------------------------------- */

  /**
   * Deletes a shipment and removes it from the local list.
   * Returns true on success, false on failure.
   *
   * @param shipmentId - UUID of the shipment to delete
   */
  const removeShipment = useCallback(
    async (shipmentId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteShipment(shipmentId);

        if (result.error) {
          setError(result.error);
          return false;
        }

        setShipments((prev) => prev.filter((s) => s.id !== shipmentId));

        /* Clear single-shipment state if it was the deleted one */
        setShipment((prev) => (prev?.id === shipmentId ? null : prev));

        return true;
      } catch (unexpected) {
        setError("An unexpected error occurred while deleting the shipment.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /* ----------------------- RETURN --------------------------------- */

  return {
    /* State */
    shipments,
    shipment,
    isLoading,
    error,

    /* Actions */
    loadShipments,
    loadShipment,
    refetch,
    addShipment,
    editShipment,
    removeShipment,
  } as const;
}
