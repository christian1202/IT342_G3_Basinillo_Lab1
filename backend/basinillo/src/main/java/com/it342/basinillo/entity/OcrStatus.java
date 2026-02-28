package com.it342.basinillo.entity;

/**
 * Processing status for Smart-Scan OCR document ingestion.
 *
 *   PENDING    — Document uploaded, OCR not yet started.
 *   PROCESSING — OCR engine is actively extracting data.
 *   COMPLETED  — Extraction finished successfully; data available.
 *   FAILED     — Extraction failed (e.g., unreadable scan, unsupported format).
 */
public enum OcrStatus {
    PENDING,
    PROCESSING,
    COMPLETED,
    FAILED
}
