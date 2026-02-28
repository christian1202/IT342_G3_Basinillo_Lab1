package com.it342.basinillo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * JPA Entity mapped to the "shipment_documents" table.
 *
 * Represents a single document attached to a shipment — such as a
 * Bill of Lading, Commercial Invoice, or Packing List. The actual
 * file is stored in Cloudflare R2; this entity holds the URL reference.
 *
 * Supports Smart-Scan OCR: the {@code ocrStatus} tracks extraction
 * progress, and {@code ocrExtractedData} holds the structured JSON
 * result from Google Document AI.
 *
 * Relationships:
 *   - ManyToOne → Shipment (each document belongs to one shipment)
 */
@Entity
@Table(name = "shipment_documents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentDocument {

    /* ------------------------------------------------------------------ */
    /*  Primary Key                                                        */
    /* ------------------------------------------------------------------ */

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /* ------------------------------------------------------------------ */
    /*  Relationship — Parent Shipment                                     */
    /* ------------------------------------------------------------------ */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipment_id", nullable = false)
    @JsonIgnore
    private Shipment shipment;

    @Column(name = "shipment_id", insertable = false, updatable = false)
    private UUID shipmentId;

    /* ------------------------------------------------------------------ */
    /*  Document Metadata                                                  */
    /* ------------------------------------------------------------------ */

    /** Categorization of the document (BL, CI, Packing List, etc.). */
    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 30)
    private DocumentType documentType;

    /** Original filename as uploaded by the broker. */
    @Column(name = "file_name", length = 255)
    private String fileName;

    /** URL pointing to the file in Cloudflare R2 storage. */
    @Column(name = "file_url", nullable = false, columnDefinition = "TEXT")
    private String fileUrl;

    /** UUID of the user who uploaded this document. */
    @Column(name = "uploaded_by")
    private UUID uploadedBy;

    /* ------------------------------------------------------------------ */
    /*  Smart-Scan OCR                                                     */
    /* ------------------------------------------------------------------ */

    /** Current state of OCR processing for this document. */
    @Enumerated(EnumType.STRING)
    @Column(name = "ocr_status", length = 20)
    @Builder.Default
    private OcrStatus ocrStatus = OcrStatus.PENDING;

    /**
     * Structured JSON output from the OCR/NLP pipeline.
     * Contains extracted fields: consignee, vessel, container numbers, etc.
     * Stored as JSONB in PostgreSQL for efficient querying.
     */
    @Column(name = "ocr_extracted_data", columnDefinition = "jsonb")
    private String ocrExtractedData;

    /* ------------------------------------------------------------------ */
    /*  Audit Timestamps                                                   */
    /* ------------------------------------------------------------------ */

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
