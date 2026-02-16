"use client";

import { useState, useCallback } from "react";
import type {
  IShipmentDocument,
  ICreateDocumentPayload,
} from "@/types/database";
import {
  createShipmentDocument,
  fetchDocumentsByShipment,
  deleteShipmentDocument,
} from "@/services/documentService";

/* ================================================================== */
/*  useShipmentDocuments                                                */
/*  Custom hook for managing documents attached to a shipment.         */
/*                                                                     */
/*  Exposes:                                                           */
/*    • documents   — list of documents for the current shipment       */
/*    • isLoading   — for skeletons / spinners                         */
/*    • error       — nullable error string                            */
/*    • loadDocuments()   — fetch all docs for a shipment              */
/*    • addDocument()     — attach a new document                      */
/*    • removeDocument()  — delete a document                          */
/* ================================================================== */

export function useShipmentDocuments() {
  /* ----------------------- state ---------------------------------- */
  const [documents, setDocuments] = useState<IShipmentDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ----------------------- LIST ----------------------------------- */

  /**
   * Fetches all documents attached to the given shipment (newest first).
   *
   * @param shipmentId - UUID of the parent shipment
   */
  const loadDocuments = useCallback(async (shipmentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchDocumentsByShipment(shipmentId);

      if (result.error) {
        setError(result.error);
        return;
      }

      setDocuments(result.data ?? []);
    } catch (unexpected) {
      setError("An unexpected error occurred while loading documents.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ----------------------- CREATE --------------------------------- */

  /**
   * Attaches a new document to a shipment and prepends it to the list.
   * Returns the created document on success, or null on failure.
   *
   * @param payload - shipment_id, document_type, and file_url
   */
  const addDocument = useCallback(
    async (
      payload: ICreateDocumentPayload,
    ): Promise<IShipmentDocument | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createShipmentDocument(payload);

        if (result.error) {
          setError(result.error);
          return null;
        }

        const created = result.data!;
        setDocuments((prev) => [created, ...prev]);
        return created;
      } catch (unexpected) {
        setError("An unexpected error occurred while uploading the document.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /* ----------------------- DELETE --------------------------------- */

  /**
   * Removes a document record and filters it from the local list.
   * Returns true on success, false on failure.
   *
   * Note: This deletes the database row only. The actual file in
   * Supabase Storage must be cleaned up separately if needed.
   *
   * @param documentId - UUID of the document to delete
   */
  const removeDocument = useCallback(
    async (documentId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteShipmentDocument(documentId);

        if (result.error) {
          setError(result.error);
          return false;
        }

        setDocuments((prev) => prev.filter((d) => d.id !== documentId));
        return true;
      } catch (unexpected) {
        setError("An unexpected error occurred while deleting the document.");
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
    documents,
    isLoading,
    error,

    /* Actions */
    loadDocuments,
    addDocument,
    removeDocument,
  } as const;
}
