package com.it342.basinillo.controller;

import com.it342.basinillo.dto.ShipmentRequest;
import com.it342.basinillo.dto.ShipmentResponse;
import com.it342.basinillo.dto.UpdateStatusRequest;
import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.service.ShipmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * REST Controller for Shipment management endpoints.
 * Base path: /api/shipments
 *
 * Thin controller — delegates all business logic to ShipmentService.
 * Only responsible for HTTP concerns: parsing requests, returning responses.
 */
@RestController
@RequestMapping("/api/shipments")
@SuppressWarnings("null")
public class ShipmentController {

    private final ShipmentService shipmentService;

    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    /* ================================================================== */
    /*  POST /api/shipments — Create a new shipment                        */
    /* ================================================================== */

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_BROKER')")
    public ResponseEntity<ShipmentResponse> createShipment(@Valid @RequestBody ShipmentRequest request) {
        Shipment created = shipmentService.createShipment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ShipmentResponse.fromEntity(created));
    }

    /* ================================================================== */
    /*  GET /api/shipments — List shipments (RBAC Protected)               */
    /* ================================================================== */

    @GetMapping
    public ResponseEntity<List<ShipmentResponse>> getShipments(org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        var authorities = authentication.getAuthorities();

        List<ShipmentResponse> shipments = shipmentService.getShipmentsForUser(email, authorities)
                .stream()
                .map(ShipmentResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(shipments);
    }

    /* ================================================================== */
    /*  GET /api/shipments/{id} — Get a single shipment                    */
    /* ================================================================== */

    @GetMapping("/{id}")
    public ResponseEntity<ShipmentResponse> getShipmentById(@PathVariable("id") UUID shipmentId) {
        Shipment shipment = shipmentService.findShipmentById(shipmentId);
        return ResponseEntity.ok(ShipmentResponse.fromEntity(shipment));
    }

    /* ================================================================== */
    /*  PUT /api/shipments/{id} — Full update                              */
    /* ================================================================== */

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_BROKER')")
    public ResponseEntity<ShipmentResponse> updateShipment(
            @PathVariable("id") UUID shipmentId,
            @Valid @RequestBody ShipmentRequest request) {

        Shipment updated = shipmentService.updateShipment(shipmentId, request);
        return ResponseEntity.ok(ShipmentResponse.fromEntity(updated));
    }

    /* ================================================================== */
    /*  PATCH /api/shipments/{id}/status — Update shipment status          */
    /* ================================================================== */

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_BROKER')")
    public ResponseEntity<ShipmentResponse> updateShipmentStatus(
            @PathVariable("id") UUID shipmentId,
            @Valid @RequestBody UpdateStatusRequest request) {

        Shipment updated = shipmentService.updateStatus(shipmentId, request);
        return ResponseEntity.ok(ShipmentResponse.fromEntity(updated));
    }

    /* ================================================================== */
    /*  DELETE /api/shipments/{id} — Delete a shipment                     */
    /* ================================================================== */

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')") // Only admins can completely delete shipments
    public ResponseEntity<Void> deleteShipment(@PathVariable("id") UUID shipmentId) {
        shipmentService.deleteShipment(shipmentId);
        return ResponseEntity.noContent().build();
    }
}
