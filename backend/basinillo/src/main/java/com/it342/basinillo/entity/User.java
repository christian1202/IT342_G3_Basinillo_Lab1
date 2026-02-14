package com.it342.basinillo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * JPA Entity mapped to the "profiles" table in the "public" schema.
 * This table is managed by Supabase and synced with Supabase Auth users.
 */
@Entity
@Table(name = "profiles", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /**
     * Primary key — matches the Supabase Auth user UUID.
     * Not auto-generated; it is supplied by Supabase Auth.
     */
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

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
}
