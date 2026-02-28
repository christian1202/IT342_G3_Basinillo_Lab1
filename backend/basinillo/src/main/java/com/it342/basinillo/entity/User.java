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
 * JPA Entity mapped to the "users" table.
 *
 * Represents a person within the PortKey system — admins, customs brokers,
 * viewers, or clients. Identity is managed by Clerk; the {@code clerkId}
 * field links this record to the Clerk user profile.
 *
 * Relationships:
 *   - ManyToOne  → Organization (the firm this user belongs to)
 *   - OneToMany  → Shipment     (shipments owned/assigned to this user)
 */
@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(name = "uk_users_clerk_id", columnNames = "clerk_id"),
    @UniqueConstraint(name = "uk_users_email", columnNames = "email")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /* ------------------------------------------------------------------ */
    /*  Primary Key                                                        */
    /* ------------------------------------------------------------------ */

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /* ------------------------------------------------------------------ */
    /*  Identity (Clerk)                                                   */
    /* ------------------------------------------------------------------ */

    /**
     * Clerk's external user ID (e.g., "user_2abc123...").
     * Used to correlate webhook events with this database record.
     */
    @Column(name = "clerk_id", unique = true, length = 100)
    private String clerkId;

    /* ------------------------------------------------------------------ */
    /*  Profile Fields                                                     */
    /* ------------------------------------------------------------------ */

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "full_name", length = 150)
    private String fullName;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    /**
     * Role within the organization.
     * Stored as a String in the DB for readability (not ordinal).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    @Builder.Default
    private UserRole role = UserRole.CLIENT;

    /* ------------------------------------------------------------------ */
    /*  Relationship — Organization                                        */
    /* ------------------------------------------------------------------ */

    /**
     * The brokerage firm this user belongs to.
     * Nullable for users not yet assigned to an organization.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id")
    @JsonIgnore
    private Organization organization;

    @Column(name = "org_id", insertable = false, updatable = false)
    private UUID orgId;

    /* ------------------------------------------------------------------ */
    /*  Audit Timestamps                                                   */
    /* ------------------------------------------------------------------ */

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /* ------------------------------------------------------------------ */
    /*  Relationships — Owned Shipments                                    */
    /* ------------------------------------------------------------------ */

    /**
     * Shipments where this user is the assigned broker.
     * CascadeType.ALL + orphanRemoval ensures clean deletion.
     */
    @OneToMany(mappedBy = "assignedBroker", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Shipment> shipments = new ArrayList<>();
}
