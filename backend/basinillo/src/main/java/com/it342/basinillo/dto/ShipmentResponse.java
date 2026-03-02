package com.it342.basinillo.dto;

import com.it342.basinillo.entity.LaneStatus;
import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.entity.ShipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentResponse {

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

    // Derived relationship data
    private ClientResponse client;
    private String clientName;

    // We do not eagerly load all items/documents in list views
    private int itemCount;
    private int documentCount;

    /**
     * Maps a Shipment entity to a ShipmentResponse DTO.
     */
    public static ShipmentResponse fromEntity(Shipment shipment) {
        if (shipment == null) return null;

        ClientResponse clientResponse = null;
        if (shipment.getClient() != null) {
            clientResponse = ClientResponse.fromEntity(shipment.getClient());
        }

        return ShipmentResponse.builder()
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
                .itemCount(shipment.getItems() != null ? shipment.getItems().size() : 0)
                .documentCount(shipment.getDocuments() != null ? shipment.getDocuments().size() : 0)
                .build();
    }
}
