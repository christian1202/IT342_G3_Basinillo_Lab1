package com.it342.basinillo.entity;

/**
 * BOC (Bureau of Customs) risk assessment lane assignment.
 *
 * Determines the level of inspection a shipment undergoes:
 *   PENDING — Not yet assigned a lane by BOC.
 *   GREEN   — Auto-release, no inspection required.
 *   YELLOW  — Document check only.
 *   RED     — Full physical examination of cargo.
 */
public enum LaneStatus {
    PENDING,
    GREEN,
    YELLOW,
    RED
}
