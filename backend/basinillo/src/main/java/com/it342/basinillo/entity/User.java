package com.it342.basinillo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * JPA Entity mapped to the "profiles" table in the "public" schema.
 *
 * Represents users within the PortKey system — clients, customs brokers,
 * and administrators. The primary key is the Supabase Auth user UUID;
 * it is NOT auto-generated.
 *
 * Relationships:
 *   - OneToMany → Shipment (one user can own many shipments)
 */
@Entity
@Table(name = "profiles", schema = "public")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /* ------------------------------------------------------------------ */
    /*  Primary Key                                                        */
    /* ------------------------------------------------------------------ */

    /**
     * Matches the Supabase Auth user UUID.
     * Not auto-generated; supplied by Supabase Auth on login/signup.
     */
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    /* ------------------------------------------------------------------ */
    /*  Profile Fields                                                     */
    /* ------------------------------------------------------------------ */

    @Column(name = "email")
    private String email;

    @Column(name = "full_name")
    private String fullName;

    /**
     * User role in the system: "admin", "broker", or "client".
     * Defaults to "client" for new users.
     */
    @Column(name = "role")
    private String role;

    @Column(name = "avatar_url")
    private String avatarUrl;

    /* ------------------------------------------------------------------ */
    /*  Relationships                                                      */
    /* ------------------------------------------------------------------ */

    /**
     * All shipments belonging to this user.
     *
     * @JsonIgnore prevents infinite recursion when serializing User → Shipment → User.
     * cascade = ALL so that deleting a user also removes their shipments.
     * orphanRemoval = true cleans up detached shipment records automatically.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Shipment> shipments = new ArrayList<>();
}
