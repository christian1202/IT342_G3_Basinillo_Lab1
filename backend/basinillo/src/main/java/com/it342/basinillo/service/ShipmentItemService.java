package com.it342.basinillo.service;

import com.it342.basinillo.dto.ShipmentItemRequest;
import com.it342.basinillo.entity.AuditAction;
import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.entity.ShipmentItem;
import com.it342.basinillo.repository.ShipmentItemRepository;
import com.it342.basinillo.repository.ShipmentRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service layer for ShipmentItem CRUD.
 *
 * Manages line items within a shipment — each representing an
 * imported good with description, quantity, HS code, and duty estimate.
 */
@Service
@SuppressWarnings("null")
public class ShipmentItemService {

    private final ShipmentItemRepository itemRepository;
    private final ShipmentRepository shipmentRepository;
    private final AuditLogService auditLogService;

    public ShipmentItemService(ShipmentItemRepository itemRepository,
                               ShipmentRepository shipmentRepository,
                               AuditLogService auditLogService) {
        this.itemRepository = itemRepository;
        this.shipmentRepository = shipmentRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public ShipmentItem addItem(@NonNull UUID shipmentId,
                                @NonNull ShipmentItemRequest request,
                                @NonNull UUID userId) {
        Shipment shipment = findShipment(shipmentId);

        ShipmentItem item = ShipmentItem.builder()
                .shipment(shipment)
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .unitValue(request.getUnitValue())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .hsCode(request.getHsCode())
                .dutyRate(request.getDutyRate())
                .vatRate(request.getVatRate())
                .build();

        ShipmentItem saved = itemRepository.save(item);

        auditLogService.log(userId, AuditAction.ITEM_ADDED, "SHIPMENT_ITEM",
                shipmentId, null,
                Map.of("description", saved.getDescription(), "itemId", saved.getId().toString()));

        return saved;
    }

    @Transactional(readOnly = true)
    public List<ShipmentItem> findByShipmentId(@NonNull UUID shipmentId) {
        return itemRepository.findByShipmentId(shipmentId);
    }

    @Transactional
    public ShipmentItem updateItem(@NonNull UUID shipmentId,
                                   @NonNull UUID itemId,
                                   @NonNull ShipmentItemRequest request,
                                   @NonNull UUID userId) {
        ShipmentItem item = findItem(itemId);
        validateOwnership(item, shipmentId);

        String oldDescription = item.getDescription();

        item.setDescription(request.getDescription());
        item.setQuantity(request.getQuantity());
        item.setUnit(request.getUnit());
        item.setUnitValue(request.getUnitValue());
        if (request.getCurrency() != null) item.setCurrency(request.getCurrency());
        item.setHsCode(request.getHsCode());
        item.setDutyRate(request.getDutyRate());
        item.setVatRate(request.getVatRate());

        ShipmentItem saved = itemRepository.save(item);

        auditLogService.log(userId, AuditAction.ITEM_EDITED, "SHIPMENT_ITEM",
                shipmentId,
                Map.of("description", oldDescription),
                Map.of("description", saved.getDescription()));

        return saved;
    }

    @Transactional
    public void deleteItem(@NonNull UUID shipmentId,
                           @NonNull UUID itemId,
                           @NonNull UUID userId) {
        ShipmentItem item = findItem(itemId);
        validateOwnership(item, shipmentId);

        itemRepository.delete(item);

        auditLogService.log(userId, AuditAction.ITEM_DELETED, "SHIPMENT_ITEM",
                shipmentId,
                Map.of("description", item.getDescription(), "itemId", itemId.toString()),
                null);
    }

    /* ================================================================== */
    /*  Private helpers                                                    */
    /* ================================================================== */

    private Shipment findShipment(UUID shipmentId) {
        return shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Shipment not found: " + shipmentId));
    }

    private ShipmentItem findItem(UUID itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "ShipmentItem not found: " + itemId));
    }

    private void validateOwnership(ShipmentItem item, UUID shipmentId) {
        if (!item.getShipmentId().equals(shipmentId)) {
            throw new IllegalArgumentException(
                    "Item " + item.getId() + " does not belong to shipment " + shipmentId);
        }
    }
}
