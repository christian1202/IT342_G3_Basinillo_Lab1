import type { IShipmentDocument, IServiceResult } from "@/types/database";

/* ================================================================== */
/*  Document Service                                                   */
/*  Communicates with the Spring Boot backend for document operations.  */
/* ================================================================== */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/* ------------------------------------------------------------------ */
/*  UPLOAD                                                             */
/* ------------------------------------------------------------------ */

/**
 * Uploads a file to the backend, which stores it in Cloudflare R2
 * and creates a ShipmentDocument record in the database.
 *
 * @param file       - The file to upload
 * @param shipmentId - The UUID of the parent shipment
 * @param documentType - The document category (e.g. "BILL_OF_LADING")
 * @returns The created ShipmentDocument record or an error
 */
export async function uploadDocument(
  file: File,
  shipmentId: string,
  documentType: string = "OTHER",
): Promise<IServiceResult<IShipmentDocument>> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("shipmentId", shipmentId);
    formData.append("documentType", documentType);

    const response = await fetch(`${API_BASE}/api/documents/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = errorBody?.error || `Upload failed (${response.status})`;
      return { data: null, error: message };
    }

    const data = await response.json();
    return { data: data as IShipmentDocument, error: null };
  } catch (e) {
    return { data: null, error: "Network error during upload." };
  }
}

/* ------------------------------------------------------------------ */
/*  READ — List by shipment                                            */
/* ------------------------------------------------------------------ */

/**
 * Fetches all documents attached to a specific shipment.
 *
 * @param shipmentId - The UUID of the parent shipment
 * @returns List of documents or an error
 */
export async function fetchDocumentsByShipment(
  shipmentId: string,
): Promise<IServiceResult<IShipmentDocument[]>> {
  try {
    const response = await fetch(
      `${API_BASE}/api/documents/shipment/${shipmentId}`,
    );

    if (!response.ok) {
      return {
        data: null,
        error: `Failed to fetch documents (${response.status})`,
      };
    }

    const data = await response.json();
    return { data: data as IShipmentDocument[], error: null };
  } catch (e) {
    return { data: null, error: "Network error fetching documents." };
  }
}

/* ------------------------------------------------------------------ */
/*  DOWNLOAD — Get presigned URL                                       */
/* ------------------------------------------------------------------ */

/**
 * Gets a temporary presigned URL to download a document directly from R2.
 *
 * @param documentId - The UUID of the document
 * @returns Object with `url` and `fileName`, or an error
 */
export async function getDocumentDownloadUrl(
  documentId: string,
): Promise<IServiceResult<{ url: string; fileName: string }>> {
  try {
    const response = await fetch(
      `${API_BASE}/api/documents/${documentId}/download`,
    );

    if (!response.ok) {
      return {
        data: null,
        error: `Failed to get download URL (${response.status})`,
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (e) {
    return { data: null, error: "Network error getting download URL." };
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE                                                             */
/* ------------------------------------------------------------------ */

/**
 * Permanently removes a document from R2 storage and the database.
 *
 * @param documentId - The UUID of the document to delete
 * @returns Success flag or an error
 */
export async function deleteDocument(
  documentId: string,
): Promise<IServiceResult<boolean>> {
  try {
    const response = await fetch(`${API_BASE}/api/documents/${documentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      return {
        data: null,
        error: errorBody?.error || `Delete failed (${response.status})`,
      };
    }

    return { data: true, error: null };
  } catch (e) {
    return { data: null, error: "Network error deleting document." };
  }
}
