package com.it342.basinillo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * JPA Entity mapped to the "hs_code_embeddings" table.
 *
 * Stores HS Code entries from the Philippine Tariff Schedule
 * along with their vector embeddings for semantic similarity search.
 * This is the knowledge base for the Compliance Copilot RAG pipeline.
 *
 * The {@code embedding} field will be converted to a pgvector column
 * in Task 1.13 once the pgvector extension is enabled. For now it is
 * stored as TEXT to allow Hibernate schema generation to proceed.
 *
 * No foreign key relationships — this is a standalone lookup table.
 */
@Entity
@Table(name = "hs_code_embeddings", indexes = {
    @Index(name = "idx_hs_code_embeddings_hs_code", columnList = "hs_code")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HsCodeEmbedding {

    /* ------------------------------------------------------------------ */
    /*  Primary Key                                                        */
    /* ------------------------------------------------------------------ */

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /* ------------------------------------------------------------------ */
    /*  Tariff Classification                                              */
    /* ------------------------------------------------------------------ */

    /** The HS Code (e.g., "6109.10" for 100% cotton t-shirts). */
    @Column(name = "hs_code", nullable = false, length = 15)
    private String hsCode;

    /** Human-readable description from the tariff schedule. */
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    /** Applicable customs duty rate (percentage). */
    @Column(name = "duty_rate", precision = 5, scale = 2)
    private BigDecimal dutyRate;

    /** Value-Added Tax rate (typically 12% in PH). */
    @Column(name = "vat_rate", precision = 5, scale = 2)
    private BigDecimal vatRate;

    /** Whether this HS Code requires a special import permit. */
    @Column(name = "permit_required", nullable = false)
    @Builder.Default
    private Boolean permitRequired = false;

    /* ------------------------------------------------------------------ */
    /*  Vector Embedding                                                   */
    /* ------------------------------------------------------------------ */

    /**
     * Vector embedding of the description for semantic similarity search.
     *
     * TODO (Task 1.13): After enabling pgvector extension, alter this
     * column to type vector(1536) and update the column definition.
     * For now, stored as TEXT placeholder to allow Hibernate DDL to proceed.
     */
    @Column(name = "embedding", columnDefinition = "TEXT")
    private String embedding;
}
