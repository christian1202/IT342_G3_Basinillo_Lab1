package com.it342.basinillo.entity;

/**
 * Types of customs documents that can be attached to a shipment.
 *
 * The three "Golden Documents" required for every shipment are:
 *   BILL_OF_LADING      — Proof of shipping contract between shipper and carrier.
 *   COMMERCIAL_INVOICE  — Seller's bill declaring value and description of goods.
 *   PACKING_LIST        — Itemized manifest of all cargo with weights and dimensions.
 *
 * Additional document types:
 *   PERMIT                  — Special permits (e.g., Bureau of Standards).
 *   CERTIFICATE_OF_ORIGIN   — Proof of country of manufacture.
 *   OTHER                   — Catch-all for unlisted document types.
 */
public enum DocumentType {
    BILL_OF_LADING,
    COMMERCIAL_INVOICE,
    PACKING_LIST,
    PERMIT,
    CERTIFICATE_OF_ORIGIN,
    OTHER
}
