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
 * JPA Entity mapped to the "notifications" table.
 *
 * Stores in-app notifications delivered to users — demurrage alerts,
 * stage change updates, document uploads, and system messages.
 *
 * External delivery (email via Resend, push via Expo/FCM) is handled
 * by the notification service; this entity tracks the in-app record
 * and read status.
 *
 * Relationships:
 *   - ManyToOne → User     (the recipient)
 *   - ManyToOne → Shipment (optional — the related shipment)
 */
@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notifications_user_id", columnList = "user_id"),
    @Index(name = "idx_notifications_is_read", columnList = "is_read")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

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

    /** The user who receives this notification. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "user_id", insertable = false, updatable = false)
    private UUID userId;

    /** The related shipment (nullable — some notifications are system-wide). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipment_id")
    @JsonIgnore
    private Shipment shipment;

    @Column(name = "shipment_id", insertable = false, updatable = false)
    private UUID shipmentId;

    /* ------------------------------------------------------------------ */
    /*  Notification Content                                               */
    /* ------------------------------------------------------------------ */

    /** Notification category (e.g., "DEMURRAGE_WARNING", "STAGE_CHANGE"). */
    @Column(name = "type", nullable = false, length = 50)
    private String type;

    /** Short headline displayed in the notification list. */
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    /** Full notification message body. */
    @Column(name = "body", columnDefinition = "TEXT")
    private String body;

    /** Whether the user has seen/dismissed this notification. */
    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    /* ------------------------------------------------------------------ */
    /*  Timestamp                                                          */
    /* ------------------------------------------------------------------ */

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
