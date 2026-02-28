package com.it342.basinillo.dto;

import com.it342.basinillo.entity.ShipmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for PATCH /api/shipments/{id}/status.
 *
 * Accepts a single {@link ShipmentStatus} value to update
 * a shipment's current lifecycle stage.
 *
 * Validation:
 *   - status must not be null
 *   - status must be a valid ShipmentStatus enum value
 *     (Spring will reject unknown values with 400 Bad Request)
 *
 * Example JSON body:
 * <pre>
 *   { "status": "LODGED" }
 * </pre>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {

    /**
     * The new status to assign to the shipment.
     * Must be one of: ARRIVED, LODGED, UNDER_ASSESSMENT,
     * PAYMENT_PENDING, RELEASED.
     */
    @NotNull(message = "Status is required")
    private ShipmentStatus status;
}
