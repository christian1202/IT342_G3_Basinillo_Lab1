"use client";

import { useState, useCallback } from "react";
import type { IShipmentDocument } from "@/types/database";
import {
  uploadDocument,
  fetchDocumentsByShipment,
  deleteDocument,
} from "@/services/documentService";

/* ================================================================== */
/*  useShipmentDocuments                                                */
/*  Custom hook for managing documents attached to a shipment.         */
/* ================================================================== */

export function useShipmentDocuments() {
  const [documents, setDocuments] = useState<IShipmentDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ----------------------- LIST ----------------------------------- */

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
    } catch {
      setError("An unexpected error occurred while loading documents.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ----------------------- UPLOAD --------------------------------- */

  const addDocument = useCallback(
    async (
      file: File,
      shipmentId: string,
      documentType: string = "OTHER",
    ): Promise<IShipmentDocument | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await uploadDocument(file, shipmentId, documentType);
        if (result.error) {
          setError(result.error);
          return null;
        }

        const created = result.data!;
        setDocuments((prev) => [created, ...prev]);
        return created;
      } catch {
        setError("An unexpected error occurred while uploading the document.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /* ----------------------- DELETE --------------------------------- */

  const removeDocument = useCallback(
    async (documentId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteDocument(documentId);
        if (result.error) {
          setError(result.error);
          return false;
        }

        setDocuments((prev) => prev.filter((d) => d.id !== documentId));
        return true;
      } catch {
        setError("An unexpected error occurred while deleting the document.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    documents,
    isLoading,
    error,
    loadDocuments,
    addDocument,
    removeDocument,
  } as const;
}
