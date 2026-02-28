package com.it342.basinillo.entity;

/**
 * Urgency level for the Demurrage Doomsday Clock.
 *
 * Calculated from: days_remaining = (arrivalDate + freeTimeDays) - today
 *
 *   SAFE     — More than 3 days remaining (green badge).
 *   WARNING  — 2–3 days remaining (orange pulsing badge + push notification).
 *   CRITICAL — Today or overdue (red flashing badge + SMS + email alert).
 *   OVERDUE  — Past the free time window; running cost accumulator active.
 */
public enum DemurrageUrgency {
    SAFE,
    WARNING,
    CRITICAL,
    OVERDUE
}
