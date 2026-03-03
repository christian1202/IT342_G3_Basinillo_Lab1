package com.it342.basinillo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for creating or updating a ShipmentItem.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentItemRequest {

    @NotBlank(message = "Item description is required")
    private String description;

    private Integer quantity;
    private String unit;
    private BigDecimal unitValue;
    private String currency;
    private String hsCode;
    private BigDecimal dutyRate;
    private BigDecimal vatRate;
}
