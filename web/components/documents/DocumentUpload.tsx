"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X, Check, AlertCircle } from "lucide-react";
import { uploadDocument } from "@/services/documentService";
import Button from "@/components/ui/Button";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface DocumentUploadProps {
  /** UUID of the shipment to attach documents to. */
  shipmentId: string;
  /** Callback after a successful upload. */
  onUploadComplete?: () => void;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

/** Document type options matching the backend DocumentType enum. */
const DOCUMENT_TYPES = [
  { value: "BILL_OF_LADING", label: "Bill of Lading" },
  { value: "COMMERCIAL_INVOICE", label: "Commercial Invoice" },
  { value: "PACKING_LIST", label: "Packing List" },
  { value: "PERMIT", label: "Permit" },
  { value: "CERTIFICATE_OF_ORIGIN", label: "Certificate of Origin" },
  { value: "OTHER", label: "Other" },
] as const;

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

export default function DocumentUpload({
  shipmentId,
  onUploadComplete,
}: DocumentUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("OTHER");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  /* ---- Drag & Drop Handlers ---- */

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setStatus("idle");
      setErrorMessage("");
    }
  }, []);

  /* ---- File Input Handler ---- */

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setStatus("idle");
        setErrorMessage("");
      }
    },
    [],
  );

  /* ---- Upload Handler ---- */

  const handleUpload = async () => {
    if (!selectedFile) return;

    setStatus("uploading");
    setErrorMessage("");

    const result = await uploadDocument(selectedFile, shipmentId, documentType);

    if (result.error) {
      setStatus("error");
      setErrorMessage(result.error);
    } else {
      setStatus("success");
      setSelectedFile(null);
      onUploadComplete?.();

      // Reset to idle after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  /* ---- Clear Selection ---- */

  const clearFile = () => {
    setSelectedFile(null);
    setStatus("idle");
    setErrorMessage("");
  };

  /* ---- Render ---- */

  return (
    <div className="flex flex-col gap-4">
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragOver
            ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950/30"
            : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
        }`}
      >
        {status === "success" ? (
          <>
            <Check className="h-10 w-10 text-emerald-500" />
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Document uploaded successfully!
            </p>
          </>
        ) : selectedFile ? (
          <>
            <FileText className="h-10 w-10 text-indigo-500" />
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {selectedFile.name}
              </p>
              <button
                onClick={clearFile}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-slate-400" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Drag & drop a file here, or{" "}
              <label className="cursor-pointer text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-400">
                browse
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                />
              </label>
            </p>
            <p className="text-xs text-slate-400">
              PDF, Images, Word, or Excel — max 10 MB
            </p>
          </>
        )}
      </div>

      {/* Error Message */}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Document Type + Upload Button */}
      {selectedFile && status !== "success" && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {DOCUMENT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            onClick={handleUpload}
            isLoading={status === "uploading"}
          >
            <Upload className="h-4 w-4" />
            {status === "uploading" ? "Uploading…" : "Upload Document"}
          </Button>
        </div>
      )}
    </div>
  );
}
