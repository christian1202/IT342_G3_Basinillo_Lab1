package com.it342.basinillo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * JPA Entity for employee attendance tracking.
 *
 * Each record represents a single clock-in / clock-out cycle.
 * When a user clocks in, a new record is created with clockOutTime = null
 * and status = "CLOCKED_IN". When they clock out, the record is updated.
 *
 * Mapped to the "attendance" table — Hibernate creates it automatically
 * via ddl-auto=update.
 *
 * Relationships:
 *   - ManyToOne → User (each attendance record belongs to one user)
 */
@Entity
@Table(name = "attendance")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {

    /* ------------------------------------------------------------------ */
    /*  Primary Key                                                        */
    /* ------------------------------------------------------------------ */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ------------------------------------------------------------------ */
    /*  Relationship                                                       */
    /* ------------------------------------------------------------------ */

    /**
     * The user who owns this attendance record.
     * FetchType.LAZY avoids loading the full User object on every query.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /* ------------------------------------------------------------------ */
    /*  Timestamps                                                         */
    /* ------------------------------------------------------------------ */

    /**
     * When the user clocked in.
     * Always set on creation — never null.
     */
    @Column(name = "clock_in_time", nullable = false)
    private Instant clockInTime;

    /**
     * When the user clocked out.
     * Null while the user is still clocked in.
     */
    @Column(name = "clock_out_time")
    private Instant clockOutTime;

    /* ------------------------------------------------------------------ */
    /*  Status & Notes                                                     */
    /* ------------------------------------------------------------------ */

    /**
     * Current status of this attendance record.
     * Values: "CLOCKED_IN" or "CLOCKED_OUT".
     */
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    /**
     * Optional notes or remarks for this attendance entry
     * (e.g., "Late arrival — traffic", "Left early — doctor appointment").
     */
    @Column(name = "notes")
    private String notes;
}
