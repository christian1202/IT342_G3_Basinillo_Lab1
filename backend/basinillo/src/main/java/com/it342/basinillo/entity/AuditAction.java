package com.it342.basinillo.entity;

/**
 * Categorises each audit log entry by the action performed.
 *
 * Used by {@link AuditLog#action} to ensure consistent,
 * type-safe action labels across the system.
 */
public enum AuditAction {
    SHIPMENT_CREATED,
    STATUS_CHANGED,
    LANE_CHANGED,
    DOCUMENT_UPLOADED,
    DOCUMENT_DELETED,
    ITEM_ADDED,
    ITEM_EDITED,
    ITEM_DELETED
}
