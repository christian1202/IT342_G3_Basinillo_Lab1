package com.it342.basinillo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * JPA Entity mapped to the "shipment_items" table.
 *
 * Represents a single line item within a shipment — one type of
 * imported good with its HS Code classification, quantity, value,
 * and estimated duties.
 *
 * The Compliance Copilot AI fills in {@code hsCode}, {@code dutyRate},
 * and {@code aiConfidenceScore}; the broker confirms via {@code isVerified}.
 *
 * Relationships:
 *   - ManyToOne → Shipment (parent shipment)
 */
@Entity
@Table(name = "shipment_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentItem {

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
    /*  Product Description                                                */
    /* ------------------------------------------------------------------ */

    /** Plain-English description of the goods (input to Compliance Copilot). */
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    /** Quantity of units imported. */
    @Column(name = "quantity")
    private Integer quantity;

    /** Unit of measurement (e.g., "PCS", "KG", "CBM"). */
    @Column(name = "unit", length = 20)
    private String unit;

    /** Declared value per unit in the specified currency. */
    @Column(name = "unit_value", precision = 12, scale = 2)
    private BigDecimal unitValue;

    /** Currency code (e.g., "USD", "PHP", "EUR"). */
    @Column(name = "currency", length = 5)
    @Builder.Default
    private String currency = "USD";

    /* ------------------------------------------------------------------ */
    /*  HS Code Classification                                             */
    /* ------------------------------------------------------------------ */

    /** Harmonized System tariff code (6–10 digits). */
    @Column(name = "hs_code", length = 15)
    private String hsCode;

    /** Applicable customs duty rate (percentage). */
    @Column(name = "duty_rate", precision = 5, scale = 2)
    private BigDecimal dutyRate;

    /** Value-Added Tax rate (percentage, typically 12% in PH). */
    @Column(name = "vat_rate", precision = 5, scale = 2)
    private BigDecimal vatRate;

    /** Estimated total duty payable for this line item. */
    @Column(name = "estimated_duty", precision = 12, scale = 2)
    private BigDecimal estimatedDuty;

    /* ------------------------------------------------------------------ */
    /*  AI Confidence                                                       */
    /* ------------------------------------------------------------------ */

    /** Compliance Copilot's confidence in the suggested HS Code (0.0–1.0). */
    @Column(name = "ai_confidence_score", precision = 4, scale = 3)
    private BigDecimal aiConfidenceScore;

    /** Whether the broker has manually verified/confirmed the HS Code. */
    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private Boolean isVerified = false;
}
