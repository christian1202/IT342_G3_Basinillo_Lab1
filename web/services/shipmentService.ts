import { supabase } from "@/lib/supabase";
import type {
  IShipment,
  ICreateShipmentPayload,
  IUpdateShipmentPayload,
  IServiceResult,
} from "@/types/database";

/* ================================================================== */
/*  Shipment Service                                                   */
/*  Repository-pattern data access for the `shipments` table.          */
/* ================================================================== */

/** Table name — defined once to satisfy the DRY principle. */
const TABLE = "shipments";

/* ------------------------------------------------------------------ */
/*  CREATE                                                             */
/* ------------------------------------------------------------------ */

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

/**
 * Creates a new shipment via the Spring Boot backend REST API.
 *
 * This bypasses Supabase directly to allow the backend to handle
 * ownership, tenant assignment (organization), and 5-stage defaults.
 *
 * @param payload - The shipment fields to insert
 * @returns A result containing the created shipment or an error message
 */
export async function createShipment(
  payload: ICreateShipmentPayload,
): Promise<IServiceResult<IShipment>> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/shipments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brokerId: payload.user_id,
        blNumber: payload.bl_number,
        vesselName: payload.vessel_name,
        containerNumber: payload.container_number,
        arrivalDate: payload.arrival_date,
        serviceFee: payload.service_fee,
        clientName: payload.client_name,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        data: null,
        error: errorData.error || `Backend error: ${response.status}`,
      };
    }

    const data = await response.json();
    return { data: data as IShipment, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/* ------------------------------------------------------------------ */
/*  READ — List by user                                                */
/* ------------------------------------------------------------------ */

/**
 * Fetches all shipments belonging to a specific user, newest first.
 *
 * Used on the Dashboard to show a client their cargo consignments.
 * Results are ordered by `created_at` descending so the most recent
 * shipment appears at the top.
 *
 * @param userId - The UUID of the shipment owner
 * @returns A result containing the list of shipments or an error message
 */
export async function fetchShipmentsByUser(
  userId: string,
): Promise<IServiceResult<IShipment[]>> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as IShipment[], error: null };
}

/* ------------------------------------------------------------------ */
/*  READ — Single by ID                                                */
/* ------------------------------------------------------------------ */

/**
 * Fetches a single shipment by its primary key.
 *
 * @param shipmentId - The UUID of the shipment
 * @returns A result containing the shipment or an error message
 */
export async function fetchShipmentById(
  shipmentId: string,
): Promise<IServiceResult<IShipment>> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", shipmentId)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as IShipment, error: null };
}

/* ------------------------------------------------------------------ */
/*  UPDATE                                                             */
/* ------------------------------------------------------------------ */

/**
 * Updates mutable fields on an existing shipment.
 *
 * Only the fields present in the payload are overwritten;
 * unspecified fields remain unchanged. Immutable fields
 * (id, user_id, bl_number, created_at) cannot be modified.
 *
 * @param shipmentId - The UUID of the shipment to update
 * @param payload    - An object containing only the fields to change
 * @returns A result containing the updated shipment or an error message
 */
export async function updateShipment(
  shipmentId: string,
  payload: IUpdateShipmentPayload,
): Promise<IServiceResult<IShipment>> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", shipmentId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as IShipment, error: null };
}

/* ------------------------------------------------------------------ */
/*  UPDATE — Status only (Step 4: frontend chain to backend PATCH)     */
/* ------------------------------------------------------------------ */

/**
 * Updates only the lifecycle status of an existing shipment.
 *
 * Frontend counterpart to the backend chain:
 *   Step 1 → UpdateStatusRequest DTO
 *   Step 2 → ShipmentService.updateStatus()
 *   Step 3 → PATCH /api/shipments/{id}/status
 *
 * @param shipmentId - The UUID of the shipment to update
 * @param status     - The new ShipmentStatus value
 * @returns A result containing the updated shipment or an error message
 */
export async function updateShipmentStatus(
  shipmentId: string,
  status: import("@/types/database").ShipmentStatus,
): Promise<IServiceResult<IShipment>> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ status })
    .eq("id", shipmentId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as IShipment, error: null };
}

/* ------------------------------------------------------------------ */
/*  DELETE                                                             */
/* ------------------------------------------------------------------ */

/**
 * Permanently removes a shipment and its associated documents.
 *
 * The `ON DELETE CASCADE` foreign key on shipment_documents ensures
 * that child documents are deleted automatically by the database.
 *
 * @param shipmentId - The UUID of the shipment to delete
 * @returns A result with `true` on success or an error message
 */
export async function deleteShipment(
  shipmentId: string,
): Promise<IServiceResult<boolean>> {
  const { error } = await supabase.from(TABLE).delete().eq("id", shipmentId);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: true, error: null };
}
