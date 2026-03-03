package com.it342.basinillo.dto;

import com.it342.basinillo.entity.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Full detail DTO for GET /api/shipments/{id}.
 *
 * Includes nested items, documents, and audit logs — heavier than
 * the list-view {@link ShipmentResponse} to avoid N+1 on list pages.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentDetailResponse {

    private UUID id;
    private String blNumber;
    private String vesselName;
    private String voyageNo;
    private String containerNumber;
    private String portOfDischarge;

    private ShipmentStatus status;
    private LaneStatus laneStatus;
    private String entryNumber;

    private LocalDateTime arrivalDate;
    private Integer freeTimeDays;
    private LocalDate doomsdayDate;

    private BigDecimal serviceFee;
    private ClientResponse client;
    private String clientName;

    private UUID orgId;
    private UUID assignedBrokerId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ── Nested collections ──────────────────────────────────────────
    private List<ShipmentItemResponse> items;
    private List<DocumentResponse> documents;
    private List<AuditLogResponse> auditLogs;

    public static ShipmentDetailResponse fromEntity(Shipment shipment) {
        if (shipment == null) return null;

        ClientResponse clientResponse = shipment.getClient() != null
                ? ClientResponse.fromEntity(shipment.getClient()) : null;

        List<ShipmentItemResponse> items = shipment.getItems() != null
                ? shipment.getItems().stream()
                    .map(ShipmentItemResponse::fromEntity)
                    .collect(Collectors.toList())
                : Collections.emptyList();

        List<DocumentResponse> documents = shipment.getDocuments() != null
                ? shipment.getDocuments().stream()
                    .map(DocumentResponse::fromEntity)
                    .collect(Collectors.toList())
                : Collections.emptyList();

        List<AuditLogResponse> auditLogs = shipment.getAuditLogs() != null
                ? shipment.getAuditLogs().stream()
                    .map(AuditLogResponse::fromEntity)
                    .collect(Collectors.toList())
                : Collections.emptyList();

        return ShipmentDetailResponse.builder()
                .id(shipment.getId())
                .blNumber(shipment.getBlNumber())
                .vesselName(shipment.getVesselName())
                .voyageNo(shipment.getVoyageNo())
                .containerNumber(shipment.getContainerNumber())
                .portOfDischarge(shipment.getPortOfDischarge())
                .status(shipment.getStatus())
                .laneStatus(shipment.getLaneStatus())
                .entryNumber(shipment.getEntryNumber())
                .arrivalDate(shipment.getArrivalDate())
                .freeTimeDays(shipment.getFreeTimeDays())
                .doomsdayDate(shipment.getDoomsdayDate())
                .serviceFee(shipment.getServiceFee())
                .client(clientResponse)
                .clientName(shipment.getClientName())
                .orgId(shipment.getOrgId())
                .assignedBrokerId(shipment.getAssignedBrokerId())
                .createdAt(shipment.getCreatedAt())
                .updatedAt(shipment.getUpdatedAt())
                .items(items)
                .documents(documents)
                .auditLogs(auditLogs)
                .build();
    }
}
