package com.it342.basinillo.controller;

import com.it342.basinillo.dto.*;
import com.it342.basinillo.entity.LaneStatus;
import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.entity.ShipmentStatus;
import com.it342.basinillo.service.ShipmentService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
    public ResponseEntity<ShipmentResponse> createShipment(
            @Valid @RequestBody ShipmentRequest request) {
        Shipment created = shipmentService.createShipment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ShipmentResponse.fromEntity(created));
    }

    /* ================================================================== */
    /*  GET /api/shipments — List shipments with optional filters          */
    /* ================================================================== */

    @GetMapping
    public ResponseEntity<List<ShipmentResponse>> getShipments(
            org.springframework.security.core.Authentication authentication,
            @RequestParam(required = false) ShipmentStatus status,
            @RequestParam(required = false) LaneStatus laneStatus,
            @RequestParam(required = false) UUID assignedBrokerId,
            @RequestParam(required = false) UUID clientId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                    LocalDateTime arrivalDateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                    LocalDateTime arrivalDateTo) {

        List<Shipment> shipments;

        // If filters are provided, use the filtered query
        if (status != null || laneStatus != null || assignedBrokerId != null
                || clientId != null || arrivalDateFrom != null || arrivalDateTo != null) {
            shipments = shipmentService.findShipmentsFiltered(
                    null, status, laneStatus, assignedBrokerId,
                    clientId, arrivalDateFrom, arrivalDateTo);
        } else {
            shipments = shipmentService.getShipmentsForUser(
                    authentication.getName(), authentication.getAuthorities());
        }

        List<ShipmentResponse> response = shipments.stream()
                .map(ShipmentResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /* ================================================================== */
    /*  GET /api/shipments/{id} — Full detail with items, docs, audit logs */
    /* ================================================================== */

    @GetMapping("/{id}")
    public ResponseEntity<ShipmentDetailResponse> getShipmentById(
            @PathVariable("id") UUID shipmentId) {
        Shipment shipment = shipmentService.findShipmentById(shipmentId);
        return ResponseEntity.ok(ShipmentDetailResponse.fromEntity(shipment));
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
    /*  PATCH /api/shipments/{id}/status — Advance lifecycle stage         */
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
    /*  PATCH /api/shipments/{id}/lane — Set BOC lane status               */
    /* ================================================================== */

    @PatchMapping("/{id}/lane")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_BROKER')")
    public ResponseEntity<ShipmentResponse> updateLaneStatus(
            @PathVariable("id") UUID shipmentId,
            @Valid @RequestBody UpdateLaneRequest request) {
        Shipment updated = shipmentService.updateLane(shipmentId, request);
        return ResponseEntity.ok(ShipmentResponse.fromEntity(updated));
    }

    /* ================================================================== */
    /*  DELETE /api/shipments/{id} — Soft delete (sets deletedAt)          */
    /* ================================================================== */

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteShipment(@PathVariable("id") UUID shipmentId) {
        shipmentService.deleteShipment(shipmentId);
        return ResponseEntity.noContent().build();
    }

    /* ================================================================== */
    /*  GET /api/shipments/{id}/demurrage-status                           */
    /* ================================================================== */

    @GetMapping("/{id}/demurrage-status")
    public ResponseEntity<DemurrageStatusResponse> getDemurrageStatus(
            @PathVariable("id") UUID shipmentId) {
        DemurrageStatusResponse status = shipmentService.getDemurrageStatus(shipmentId);
        return ResponseEntity.ok(status);
    }
}
