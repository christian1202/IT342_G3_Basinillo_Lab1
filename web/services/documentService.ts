import { supabase } from "@/lib/supabase";
import type {
  IShipmentDocument,
  ICreateDocumentPayload,
  IServiceResult,
} from "@/types/database";

/* ================================================================== */
/*  Document Service                                                   */
/*  Repository-pattern data access for `shipment_documents` table.     */
/* ================================================================== */

/** Table name — defined once to satisfy the DRY principle. */
const TABLE = "shipment_documents";

/* ------------------------------------------------------------------ */
/*  CREATE                                                             */
/* ------------------------------------------------------------------ */

/**
 * Attaches a new document record to a shipment.
 *
 * The caller provides the parent shipment_id, the document_type
 * (e.g. "INVOICE"), and the file_url pointing to Supabase Storage.
 *
 * @param payload - The document fields to insert
 * @returns A result containing the created document or an error message
 */
export async function createShipmentDocument(
  payload: ICreateDocumentPayload,
): Promise<IServiceResult<IShipmentDocument>> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as IShipmentDocument, error: null };
}

/* ------------------------------------------------------------------ */
/*  READ — List by shipment                                            */
/* ------------------------------------------------------------------ */

/**
 * Fetches all documents attached to a specific shipment.
 *
 * Results are ordered by `created_at` descending (newest first).
 *
 * @param shipmentId - The UUID of the parent shipment
 * @returns A result containing the list of documents or an error message
 */
export async function fetchDocumentsByShipment(
  shipmentId: string,
): Promise<IServiceResult<IShipmentDocument[]>> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("shipment_id", shipmentId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as IShipmentDocument[], error: null };
}

/* ------------------------------------------------------------------ */
/*  DELETE                                                             */
/* ------------------------------------------------------------------ */

/**
 * Permanently removes a single document record.
 *
 * This only deletes the database row. The actual file in Supabase
 * Storage must be cleaned up separately if desired.
 *
 * @param documentId - The UUID of the document to delete
 * @returns A result with `true` on success or an error message
 */
export async function deleteShipmentDocument(
  documentId: string,
): Promise<IServiceResult<boolean>> {
  const { error } = await supabase.from(TABLE).delete().eq("id", documentId);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: true, error: null };
}
