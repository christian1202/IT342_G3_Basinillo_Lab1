package com.it342.basinillo.dto;

import com.it342.basinillo.entity.LaneStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for PATCH /api/shipments/{id}/lane.
 *
 * Sets the BOC lane assignment on a shipment.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLaneRequest {

    @NotNull(message = "Lane status is required")
    private LaneStatus laneStatus;
}
