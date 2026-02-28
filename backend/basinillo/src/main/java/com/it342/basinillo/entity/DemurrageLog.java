package com.it342.basinillo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * JPA Entity mapped to the "demurrage_logs" table.
 *
 * Records a single day's demurrage charge against a shipment.
 * Created by the daily cron job (Spring Scheduler, 8:00 AM PHT)
 * for shipments that have exceeded their free storage window.
 *
 * Relationships:
 *   - ManyToOne → Shipment (the overdue shipment)
 */
@Entity
@Table(name = "demurrage_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemurrageLog {

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
    /*  Charge Details                                                     */
    /* ------------------------------------------------------------------ */

    /** The date this charge was incurred. */
    @Column(name = "date", nullable = false)
    private LocalDate date;

    /** Daily demurrage charge amount (₱2,000–₱5,000 typical). */
    @Column(name = "charge_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal chargeAmount;

    /** Running total of all demurrage charges for this shipment to date. */
    @Column(name = "cumulative_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal cumulativeTotal;

    /** Optional notes (e.g., "Holiday — port closed, no charge"). */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
