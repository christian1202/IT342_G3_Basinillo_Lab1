package com.it342.basinillo.controller;

import com.it342.basinillo.dto.ShipmentItemRequest;
import com.it342.basinillo.dto.ShipmentItemResponse;
import com.it342.basinillo.entity.ShipmentItem;
import com.it342.basinillo.service.ShipmentItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * REST Controller for ShipmentItem CRUD.
 * Base path: /api/shipments/{shipmentId}/items
 */
@RestController
@RequestMapping("/api/shipments/{shipmentId}/items")
@SuppressWarnings("null")
public class ShipmentItemController {

    private final ShipmentItemService itemService;

    public ShipmentItemController(ShipmentItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_BROKER')")
    public ResponseEntity<ShipmentItemResponse> addItem(
            @PathVariable UUID shipmentId,
            @Valid @RequestBody ShipmentItemRequest request,
            @RequestParam UUID userId) {
        ShipmentItem item = itemService.addItem(shipmentId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ShipmentItemResponse.fromEntity(item));
    }

    @GetMapping
    public ResponseEntity<List<ShipmentItemResponse>> listItems(
            @PathVariable UUID shipmentId) {
        List<ShipmentItemResponse> items = itemService.findByShipmentId(shipmentId)
                .stream()
                .map(ShipmentItemResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @PutMapping("/{itemId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_BROKER')")
    public ResponseEntity<ShipmentItemResponse> updateItem(
            @PathVariable UUID shipmentId,
            @PathVariable UUID itemId,
            @Valid @RequestBody ShipmentItemRequest request,
            @RequestParam UUID userId) {
        ShipmentItem updated = itemService.updateItem(shipmentId, itemId, request, userId);
        return ResponseEntity.ok(ShipmentItemResponse.fromEntity(updated));
    }

    @DeleteMapping("/{itemId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_BROKER')")
    public ResponseEntity<Void> deleteItem(
            @PathVariable UUID shipmentId,
            @PathVariable UUID itemId,
            @RequestParam UUID userId) {
        itemService.deleteItem(shipmentId, itemId, userId);
        return ResponseEntity.noContent().build();
    }
}
