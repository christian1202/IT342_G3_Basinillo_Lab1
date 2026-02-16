package com.it342.basinillo.entity;

/**
 * Enumeration of possible shipment lifecycle statuses.
 *
 * Represents the journey of cargo through the customs brokerage
 * pipeline — from initial filing to final delivery.
 *
 * Typical flow:
 *   PENDING → IN_TRANSIT → ARRIVED → CUSTOMS_HOLD → RELEASED → DELIVERED
 */
public enum ShipmentStatus {

    /** Shipment has been filed but cargo has not departed yet. */
    PENDING,

    /** Cargo is currently in transit (on the water or in the air). */
    IN_TRANSIT,

    /** Vessel has arrived at the port of destination. */
    ARRIVED,

    /** Cargo is being held by customs for inspection or documentation issues. */
    CUSTOMS_HOLD,

    /** Customs has cleared the shipment; ready for pickup or delivery. */
    RELEASED,

    /** Cargo has been delivered to the consignee. */
    DELIVERED
}
