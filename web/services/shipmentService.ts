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

/**
 * Inserts a new shipment row into the database.
 *
 * The caller provides the owner's user_id, BL number, and optional
 * details. Server-managed fields (id, status, created_at) are
 * generated automatically by Supabase/PostgreSQL.
 *
 * @param payload - The shipment fields to insert
 * @returns A result containing the created shipment or an error message
 */
export async function createShipment(
  payload: ICreateShipmentPayload,
): Promise<IServiceResult<IShipment>> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as IShipment, error: null };
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
