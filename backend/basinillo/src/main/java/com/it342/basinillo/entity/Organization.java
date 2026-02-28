package com.it342.basinillo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * JPA Entity mapped to the "organizations" table.
 *
 * Represents a customs brokerage firm. PortKey is multi-tenant:
 * every user, client, and shipment belongs to exactly one organization.
 *
 * Relationships:
 *   - OneToMany → User    (brokers and admins within the firm)
 *   - OneToMany → Client  (importer companies served by the firm)
 *   - OneToMany → Shipment (all shipments managed by the firm)
 */
@Entity
@Table(name = "organizations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Organization {

    /* ------------------------------------------------------------------ */
    /*  Primary Key                                                        */
    /* ------------------------------------------------------------------ */

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /* ------------------------------------------------------------------ */
    /*  Organization Details                                               */
    /* ------------------------------------------------------------------ */

    /** Official registered name of the brokerage firm. */
    @Column(name = "name", nullable = false, length = 200)
    private String name;

    /** PRC/BOC customs broker license number. */
    @Column(name = "license_number", length = 50)
    private String licenseNumber;

    /** Current subscription plan tier. */
    @Enumerated(EnumType.STRING)
    @Column(name = "plan", nullable = false, length = 20)
    @Builder.Default
    private OrgPlan plan = OrgPlan.STARTER;

    /* ------------------------------------------------------------------ */
    /*  Audit Timestamps                                                   */
    /* ------------------------------------------------------------------ */

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    /* ------------------------------------------------------------------ */
    /*  Lifecycle Callback                                                 */
    /* ------------------------------------------------------------------ */

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
