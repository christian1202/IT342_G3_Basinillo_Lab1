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
 * JPA Entity mapped to the "audit_logs" table.
 *
 * Immutable record of every create, update, and delete action
 * performed on a shipment. Required for BOC compliance reviews,
 * dispute resolution, and organizational oversight.
 *
 * The {@code oldValue} and {@code newValue} fields store JSONB
 * snapshots of the changed data for full traceability.
 *
 * Relationships:
 *   - ManyToOne → Shipment (the shipment that was modified)
 *   - ManyToOne → User     (the person who made the change)
 */
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_logs_shipment_id", columnList = "shipment_id"),
    @Index(name = "idx_audit_logs_timestamp", columnList = "timestamp")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    /* ------------------------------------------------------------------ */
    /*  Primary Key                                                        */
    /* ------------------------------------------------------------------ */

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /* ------------------------------------------------------------------ */
    /*  Relationships                                                      */
    /* ------------------------------------------------------------------ */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipment_id", nullable = false)
    @JsonIgnore
    private Shipment shipment;

    @Column(name = "shipment_id", insertable = false, updatable = false)
    private UUID shipmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "user_id", insertable = false, updatable = false)
    private UUID userId;

    /* ------------------------------------------------------------------ */
    /*  Change Details                                                     */
    /* ------------------------------------------------------------------ */

    /** Action performed: "CREATE", "UPDATE", "DELETE", "STATUS_CHANGE". */
    @Column(name = "action", nullable = false, length = 30)
    private String action;

    /** Type of entity that was changed (e.g., "SHIPMENT", "DOCUMENT"). */
    @Column(name = "entity_type", nullable = false, length = 30)
    private String entityType;

    /** JSON snapshot of the data before the change (null for CREATE). */
    @Column(name = "old_value", columnDefinition = "jsonb")
    private String oldValue;

    /** JSON snapshot of the data after the change (null for DELETE). */
    @Column(name = "new_value", columnDefinition = "jsonb")
    private String newValue;

    /* ------------------------------------------------------------------ */
    /*  Timestamp                                                          */
    /* ------------------------------------------------------------------ */

    @Column(name = "timestamp", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
