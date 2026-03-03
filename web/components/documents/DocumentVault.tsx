"use client";

import { useState, useCallback, useRef } from "react";
import {
  Upload,
  FileText,
  Trash2,
  Download,
  Loader2,
  File as FileIcon,
} from "lucide-react";
import type { IShipmentDocument } from "@/types/database";
import {
  uploadDocument,
  deleteDocument,
  getDocumentDownloadUrl,
} from "@/services/documentService";

/* ================================================================== */
/*  Document Type Options                                              */
/* ================================================================== */

const DOCUMENT_TYPES = [
  { value: "BILL_OF_LADING", label: "Bill of Lading" },
  { value: "COMMERCIAL_INVOICE", label: "Commercial Invoice" },
  { value: "PACKING_LIST", label: "Packing List" },
  { value: "CUSTOMS_ENTRY", label: "Customs Entry" },
  { value: "IMPORT_PERMIT", label: "Import Permit" },
  { value: "CERTIFICATE_OF_ORIGIN", label: "Certificate of Origin" },
  { value: "OTHER", label: "Other" },
] as const;

/* ================================================================== */
/*  DocumentVault                                                      */
/*  Drag-and-drop upload, document list, download, delete.             */
/* ================================================================== */

interface DocumentVaultProps {
  shipmentId: string;
  documents: IShipmentDocument[];
  onDocumentsChange: () => void;
}

export default function DocumentVault({
  shipmentId,
  documents,
  onDocumentsChange,
}: DocumentVaultProps): React.JSX.Element {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState("OTHER");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ---- Upload Handler ---- */
  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      setIsUploading(true);
      setError(null);

      for (const file of Array.from(files)) {
        const result = await uploadDocument(file, shipmentId, selectedType);
        if (result.error) {
          setError(result.error);
          break;
        }
      }

      setIsUploading(false);
      onDocumentsChange();
    },
    [shipmentId, selectedType, onDocumentsChange],
  );

  /* ---- Drag-and-Drop ---- */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload],
  );

  /* ---- Download Handler ---- */
  const handleDownload = useCallback(async (docId: string) => {
    const result = await getDocumentDownloadUrl(docId);
    if (result.data?.url) {
      window.open(result.data.url, "_blank");
    }
  }, []);

  /* ---- Delete Handler ---- */
  const handleDelete = useCallback(
    async (docId: string) => {
      if (!confirm("Delete this document permanently?")) return;
      const result = await deleteDocument(docId);
      if (!result.error) onDocumentsChange();
    },
    [onDocumentsChange],
  );

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            Document Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? "border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20"
            : "border-slate-300 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:border-indigo-600 dark:hover:bg-slate-800/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleUpload(e.target.files);
          }}
        />
        {isUploading ? (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-500" />
        ) : (
          <>
            <Upload className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500" />
            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              Drop files here or click to browse
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              PDF, PNG, JPG up to 10MB
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Document List */}
      {documents.length > 0 && (
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <FileIcon className="h-5 w-5 shrink-0 text-indigo-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                  {doc.fileName}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {doc.documentType.replace(/_/g, " ")} ·{" "}
                  {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDownload(doc.id)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {documents.length === 0 && (
        <div className="py-6 text-center">
          <FileText className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
            No documents yet
          </p>
        </div>
      )}
    </div>
  );
}
