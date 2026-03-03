package com.it342.basinillo.dto;

import com.it342.basinillo.entity.DemurrageUrgency;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO returned by GET /api/shipments/{id}/demurrage-status.
 *
 * Provides a real-time snapshot of the demurrage risk for a shipment.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemurrageStatusResponse {

    /** Days until (or past) the doomsday date. Negative means overdue. */
    private long daysRemaining;

    /** SAFE (>3 days), WARNING (1-3 days), CRITICAL (≤0 days). */
    private DemurrageUrgency urgency;

    /** Running estimated demurrage cost (₱0 if not yet overdue). */
    private BigDecimal estimatedCost;
}
