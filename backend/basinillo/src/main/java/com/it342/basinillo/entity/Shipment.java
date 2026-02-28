package com.it342.basinillo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * JPA Entity mapped to the "shipments" table.
 *
 * The central domain object in PortKey — represents a single cargo
 * consignment tracked through the 5-stage customs clearance lifecycle:
 * ARRIVED → LODGED → UNDER_ASSESSMENT → PAYMENT_PENDING → RELEASED.
 *
 * Multi-tenant: every shipment is scoped to an Organization.
 *
 * Relationships:
 *   - ManyToOne  → Organization     (tenant scope)
 *   - ManyToOne  → Client           (the importer)
 *   - ManyToOne  → User             (assigned broker)
 *   - OneToMany  → ShipmentItem     (line items with HS codes)
 *   - OneToMany  → ShipmentDocument (attached customs documents)
 *   - OneToMany  → DemurrageLog     (daily demurrage charges)
 *   - OneToMany  → AuditLog         (change history)
 */
@Entity
@Table(name = "shipments", indexes = {
    @Index(name = "idx_shipments_org_id", columnList = "org_id"),
    @Index(name = "idx_shipments_status", columnList = "status"),
    @Index(name = "idx_shipments_doomsday_date", columnList = "doomsday_date")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Shipment {

    /* ------------------------------------------------------------------ */
    /*  Primary Key                                                        */
    /* ------------------------------------------------------------------ */

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /* ------------------------------------------------------------------ */
    /*  Relationships — Tenant & Ownership                                 */
    /* ------------------------------------------------------------------ */

    /** Organization that owns this shipment (multi-tenant scope). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    @JsonIgnore
    private Organization organization;

    @Column(name = "org_id", insertable = false, updatable = false)
    private UUID orgId;

    /** The importer/consignee company. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    @JsonIgnore
    private Client client;

    @Column(name = "client_id", insertable = false, updatable = false)
    private UUID clientId;

    /** The broker responsible for this shipment. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_broker_id")
    @JsonIgnore
    private User assignedBroker;

    @Column(name = "assigned_broker_id", insertable = false, updatable = false)
    private UUID assignedBrokerId;

    /* ------------------------------------------------------------------ */
    /*  Vessel & Cargo Identification                                      */
    /* ------------------------------------------------------------------ */

    /** Bill of Lading number — primary logistics tracking identifier. */
    @Column(name = "bl_number", nullable = false, unique = true, length = 50)
    private String blNumber;

    /** Name of the vessel carrying the cargo. */
    @Column(name = "vessel_name", length = 150)
    private String vesselName;

    /** Voyage number for the specific sailing. */
    @Column(name = "voyage_no", length = 50)
    private String voyageNo;

    /** Container identification number (e.g., "MSKU1234567"). */
    @Column(name = "container_number", length = 50)
    private String containerNumber;

    /** Port where the cargo is discharged. */
    @Column(name = "port_of_discharge", length = 100)
    private String portOfDischarge;

    /* ------------------------------------------------------------------ */
    /*  Status & Lifecycle                                                 */
    /* ------------------------------------------------------------------ */

    /** Current stage in the 5-stage customs lifecycle. */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private ShipmentStatus status = ShipmentStatus.ARRIVED;

    /** BOC risk-assessment lane assignment. */
    @Enumerated(EnumType.STRING)
    @Column(name = "lane_status", nullable = false, length = 10)
    @Builder.Default
    private LaneStatus laneStatus = LaneStatus.NONE;

    /** BOC-assigned reference number upon lodgment acceptance. */
    @Column(name = "entry_number", length = 50)
    private String entryNumber;

    /* ------------------------------------------------------------------ */
    /*  Demurrage Doomsday Clock                                           */
    /* ------------------------------------------------------------------ */

    /** Date the vessel arrived at port — starts the demurrage clock. */
    @Column(name = "arrival_date")
    private LocalDateTime arrivalDate;

    /** Number of free storage days before demurrage charges begin. Default: 7. */
    @Column(name = "free_time_days", nullable = false)
    @Builder.Default
    private Integer freeTimeDays = 7;

    /**
     * Computed deadline: arrivalDate + freeTimeDays.
     * After this date, daily demurrage charges accrue.
     */
    @Column(name = "doomsday_date")
    private LocalDate doomsdayDate;

    /* ------------------------------------------------------------------ */
    /*  Financial                                                          */
    /* ------------------------------------------------------------------ */

    /** Service fee charged by the broker for handling this shipment. */
    @Column(name = "service_fee", precision = 12, scale = 2)
    private BigDecimal serviceFee;

    /** Client company name (denormalized for quick display). */
    @Column(name = "client_name", length = 200)
    private String clientName;

    /* ------------------------------------------------------------------ */
    /*  Audit Timestamps                                                   */
    /* ------------------------------------------------------------------ */

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /* ------------------------------------------------------------------ */
    /*  Relationships — Child Collections                                  */
    /* ------------------------------------------------------------------ */

    /** Line items with HS codes, quantities, and duty estimates. */
    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShipmentItem> items = new ArrayList<>();

    /** Attached customs documents (BL, CI, Packing List, etc.). */
    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShipmentDocument> documents = new ArrayList<>();

    /** Daily demurrage charge records. */
    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<DemurrageLog> demurrageLogs = new ArrayList<>();

    /** Audit trail of all changes made to this shipment. */
    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<AuditLog> auditLogs = new ArrayList<>();
}
