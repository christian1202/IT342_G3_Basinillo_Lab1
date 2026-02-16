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
 * Represents a single document attached to a shipment — such as
 * an invoice, packing list, or bill of lading scan. The actual file
 * is stored in Supabase Storage; this entity holds the URL reference.
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
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /* ------------------------------------------------------------------ */
    /*  Relationship — Parent Shipment                                     */
    /* ------------------------------------------------------------------ */

    /**
     * The shipment this document belongs to.
     * @JsonIgnore prevents circular serialization (Shipment → Document → Shipment).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipment_id", nullable = false)
    @JsonIgnore
    private Shipment shipment;

    /**
     * Exposes the shipment ID for JSON serialization without loading the full entity.
     */
    @Column(name = "shipment_id", insertable = false, updatable = false)
    private UUID shipmentId;

    /* ------------------------------------------------------------------ */
    /*  Document Fields                                                    */
    /* ------------------------------------------------------------------ */

    /**
     * Type of customs document.
     * Examples: "INVOICE", "PACKING_LIST", "BILL_OF_LADING", "CUSTOMS_DECLARATION".
     */
    @Column(name = "document_type", nullable = false, length = 50)
    private String documentType;

    /**
     * URL pointing to the file in Supabase Storage.
     */
    @Column(name = "file_url", nullable = false, columnDefinition = "TEXT")
    private String fileUrl;

    /* ------------------------------------------------------------------ */
    /*  Audit                                                              */
    /* ------------------------------------------------------------------ */

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
