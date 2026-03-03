package com.it342.basinillo.dto;

import com.it342.basinillo.entity.ShipmentItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO returned when reading a ShipmentItem.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentItemResponse {

    private UUID id;
    private UUID shipmentId;
    private String description;
    private Integer quantity;
    private String unit;
    private BigDecimal unitValue;
    private String currency;
    private String hsCode;
    private BigDecimal dutyRate;
    private BigDecimal vatRate;
    private BigDecimal estimatedDuty;
    private BigDecimal aiConfidenceScore;
    private Boolean isVerified;

    public static ShipmentItemResponse fromEntity(ShipmentItem item) {
        if (item == null) return null;
        return ShipmentItemResponse.builder()
                .id(item.getId())
                .shipmentId(item.getShipmentId())
                .description(item.getDescription())
                .quantity(item.getQuantity())
                .unit(item.getUnit())
                .unitValue(item.getUnitValue())
                .currency(item.getCurrency())
                .hsCode(item.getHsCode())
                .dutyRate(item.getDutyRate())
                .vatRate(item.getVatRate())
                .estimatedDuty(item.getEstimatedDuty())
                .aiConfidenceScore(item.getAiConfidenceScore())
                .isVerified(item.getIsVerified())
                .build();
    }
}
