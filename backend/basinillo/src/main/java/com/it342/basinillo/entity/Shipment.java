package com.it342.basinillo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * JPA Entity mapped to the "shipments" table.
 *
 * Represents a single shipment (cargo consignment) tracked through
 * the customs brokerage pipeline. Each shipment is uniquely identified
 * by its Bill of Lading number (bl_number).
 *
 * Relationships:
 *   - ManyToOne  → User  (the client who owns this shipment)
 *   - OneToMany  → ShipmentDocument (attached customs documents)
 */
@Entity
@Table(name = "shipments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Shipment {

    /* ------------------------------------------------------------------ */
    /*  Primary Key                                                        */
    /* ------------------------------------------------------------------ */

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /* ------------------------------------------------------------------ */
    /*  Relationship — Owner                                               */
    /* ------------------------------------------------------------------ */

    /**
     * The client/broker who owns this shipment.
     * FetchType.LAZY avoids loading the full User object on every query.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    /**
     * Exposes the user ID for JSON serialization without loading the full User entity.
     */
    @Column(name = "user_id", insertable = false, updatable = false)
    private UUID userId;

    /* ------------------------------------------------------------------ */
    /*  Shipment Details                                                   */
    /* ------------------------------------------------------------------ */

    /**
     * Bill of Lading number — the primary tracking identifier in logistics.
     * Must be unique across all shipments.
     */
    @Column(name = "bl_number", nullable = false, unique = true, length = 50)
    private String blNumber;

    /** Name of the vessel carrying the cargo. */
    @Column(name = "vessel_name", length = 150)
    private String vesselName;

    /** Container identification number (e.g., "MSKU1234567"). */
    @Column(name = "container_number", length = 50)
    private String containerNumber;

    /** Estimated Time of Arrival at the port of destination. */
    @Column(name = "arrival_date")
    private LocalDateTime arrivalDate;

    /* ------------------------------------------------------------------ */
    /*  Status                                                             */
    /* ------------------------------------------------------------------ */

    /**
     * Current lifecycle status of the shipment.
     * Stored as a String in the database (not ordinal) for readability.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private ShipmentStatus status = ShipmentStatus.PENDING;

    /* ------------------------------------------------------------------ */
    /*  Audit                                                              */
    /* ------------------------------------------------------------------ */

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /* ------------------------------------------------------------------ */
    /*  Relationships — Documents                                          */
    /* ------------------------------------------------------------------ */

    /**
     * All customs documents attached to this shipment.
     * cascade = ALL propagates persist/remove to child documents.
     * orphanRemoval cleans up detached documents automatically.
     */
    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShipmentDocument> documents = new ArrayList<>();
}
