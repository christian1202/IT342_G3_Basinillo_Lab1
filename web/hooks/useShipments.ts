"use client";

import { useState, useCallback, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import type {
  IShipment,
  IShipmentDetail,
  ICreateShipmentPayload,
  IUpdateShipmentPayload,
  ShipmentStatus,
  LaneStatus,
} from "@/types/database";
import {
  createShipment,
  fetchShipments,
  fetchShipmentById,
  updateShipment,
  updateShipmentStatus,
  updateShipmentLane,
  deleteShipment,
  fetchDemurrageStatus,
} from "@/services/shipmentService";
import type { ShipmentFilters } from "@/services/shipmentService";

/* ================================================================== */
/*  useShipments                                                       */
/*  Custom hook for all shipment operations against the backend API.   */
/*  Automatically obtains the Clerk JWT and passes it to every call.   */
/* ================================================================== */

export function useShipments() {
  const { getToken } = useAuth();

  /* ----------------------- state ---------------------------------- */
  const [shipments, setShipments] = useState<IShipment[]>([]);
  const [shipment, setShipment] = useState<IShipmentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Stores the last-used filters so refetch() can repeat the query. */
  const lastFiltersRef = useRef<ShipmentFilters | undefined>(undefined);

  /* ----------------------- LIST ----------------------------------- */

  const loadShipments = useCallback(
    async (filters?: ShipmentFilters) => {
      lastFiltersRef.current = filters;
      setIsLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const result = await fetchShipments(filters, token);
        if (result.error) {
          setError(result.error);
          return;
        }
        setShipments(result.data ?? []);
      } catch {
        setError("An unexpected error occurred while loading shipments.");
      } finally {
        setIsLoading(false);
      }
    },
    [getToken],
  );

  /* ----------------------- REFETCH -------------------------------- */

  const refetch = useCallback(async () => {
    await loadShipments(lastFiltersRef.current);
  }, [loadShipments]);

  /* ----------------------- SINGLE --------------------------------- */

  const loadShipment = useCallback(
    async (shipmentId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const result = await fetchShipmentById(shipmentId, token);
        if (result.error) {
          setError(result.error);
          return;
        }
        setShipment(result.data);
      } catch {
        setError("An unexpected error occurred while loading the shipment.");
      } finally {
        setIsLoading(false);
      }
    },
    [getToken],
  );

  /* ----------------------- CREATE --------------------------------- */

  const addShipment = useCallback(
    async (payload: ICreateShipmentPayload): Promise<IShipment | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const result = await createShipment(payload, token);
        if (result.error) {
          setError(result.error);
          return null;
        }

        const created = result.data!;
        setShipments((prev) => [created, ...prev]);
        return created;
      } catch {
        setError("An unexpected error occurred while creating the shipment.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [getToken],
  );

  /* ----------------------- UPDATE --------------------------------- */

  const editShipment = useCallback(
    async (
      shipmentId: string,
      payload: IUpdateShipmentPayload,
    ): Promise<IShipment | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const result = await updateShipment(shipmentId, payload, token);
        if (result.error) {
          setError(result.error);
          return null;
        }

        const updated = result.data!;
        setShipments((prev) =>
          prev.map((s) => (s.id === shipmentId ? updated : s)),
        );
        setShipment((prev) =>
          prev?.id === shipmentId ? { ...prev, ...updated } : prev,
        );
        return updated;
      } catch {
        setError("An unexpected error occurred while updating the shipment.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [getToken],
  );

  /* ----------------------- STATUS --------------------------------- */

  const changeStatus = useCallback(
    async (shipmentId: string, status: ShipmentStatus): Promise<boolean> => {
      setError(null);
      try {
        const token = await getToken();
        const result = await updateShipmentStatus(shipmentId, status, token);
        if (result.error) {
          setError(result.error);
          return false;
        }
        const updated = result.data!;
        setShipments((prev) =>
          prev.map((s) => (s.id === shipmentId ? updated : s)),
        );
        return true;
      } catch {
        setError("Failed to update status.");
        return false;
      }
    },
    [getToken],
  );

  /* ----------------------- LANE ----------------------------------- */

  const changeLane = useCallback(
    async (shipmentId: string, laneStatus: LaneStatus): Promise<boolean> => {
      setError(null);
      try {
        const token = await getToken();
        const result = await updateShipmentLane(shipmentId, laneStatus, token);
        if (result.error) {
          setError(result.error);
          return false;
        }
        const updated = result.data!;
        setShipments((prev) =>
          prev.map((s) => (s.id === shipmentId ? updated : s)),
        );
        return true;
      } catch {
        setError("Failed to update lane status.");
        return false;
      }
    },
    [getToken],
  );

  /* ----------------------- DELETE --------------------------------- */

  const removeShipment = useCallback(
    async (shipmentId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const result = await deleteShipment(shipmentId, token);
        if (result.error) {
          setError(result.error);
          return false;
        }

        setShipments((prev) => prev.filter((s) => s.id !== shipmentId));
        setShipment((prev) => (prev?.id === shipmentId ? null : prev));
        return true;
      } catch {
        setError("An unexpected error occurred while deleting the shipment.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [getToken],
  );

  /* ----------------------- DEMURRAGE ------------------------------ */

  const getDemurrageStatus = useCallback(
    async (shipmentId: string) => {
      const token = await getToken();
      const result = await fetchDemurrageStatus(shipmentId, token);
      if (result.error) {
        setError(result.error);
        return null;
      }
      return result.data;
    },
    [getToken],
  );

  /* ----------------------- RETURN --------------------------------- */

  return {
    shipments,
    shipment,
    isLoading,
    error,

    loadShipments,
    loadShipment,
    refetch,
    addShipment,
    editShipment,
    changeStatus,
    changeLane,
    removeShipment,
    getDemurrageStatus,
  } as const;
}
