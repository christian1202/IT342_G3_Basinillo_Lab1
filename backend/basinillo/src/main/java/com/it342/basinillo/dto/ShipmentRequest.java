package com.it342.basinillo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentRequest {

    /** If provided, overrides default assignment or represents explicit assignment. */
    private UUID brokerId;

    /** If provided, sets the client. */
    private UUID clientId;

    @NotBlank(message = "BL Number is required")
    private String blNumber;

    @NotBlank(message = "Vessel Name is required")
    private String vesselName;

    private String voyageNo;

    private String containerNumber;

    private String portOfDischarge;

    private LocalDateTime arrivalDate;

    @Min(value = 0, message = "Free time days cannot be negative")
    private Integer freeTimeDays;

    @Min(value = 0, message = "Service fee cannot be negative")
    private BigDecimal serviceFee;

    /** Standalone client name, used if clientId is not provided. */
    private String clientName;
}
