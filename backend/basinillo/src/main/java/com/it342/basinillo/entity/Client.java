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
 * JPA Entity mapped to the "clients" table.
 *
 * Represents an importer or consignee company — the end customer
 * whose goods are being cleared through customs. Each client belongs
 * to exactly one brokerage organization.
 *
 * Relationships:
 *   - ManyToOne → Organization (the brokerage firm managing this client)
 */
@Entity
@Table(name = "clients")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Client {

    /* ------------------------------------------------------------------ */
    /*  Primary Key                                                        */
    /* ------------------------------------------------------------------ */

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /* ------------------------------------------------------------------ */
    /*  Relationship — Organization                                        */
    /* ------------------------------------------------------------------ */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    @JsonIgnore
    private Organization organization;

    @Column(name = "org_id", insertable = false, updatable = false)
    private UUID orgId;

    /* ------------------------------------------------------------------ */
    /*  Client Details                                                     */
    /* ------------------------------------------------------------------ */

    /** Registered company name (e.g., "Toyota Motor Philippines"). */
    @Column(name = "company_name", nullable = false, length = 200)
    private String companyName;

    /** Philippine Tax Identification Number. */
    @Column(name = "tin_number", length = 30)
    private String tinNumber;

    /** Primary contact email for shipment notifications. */
    @Column(name = "contact_email")
    private String contactEmail;

    /** Primary contact phone number. */
    @Column(name = "contact_phone", length = 30)
    private String contactPhone;

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
}
