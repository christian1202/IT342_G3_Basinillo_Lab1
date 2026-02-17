package com.it342.basinillo.controller;

import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.service.ShipmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for Shipment management endpoints.
 * Base path: /api/shipments
 *
 * Thin controller — delegates all business logic to ShipmentService.
 * Only responsible for HTTP concerns: parsing requests, returning responses.
 */
@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    private final ShipmentService shipmentService;

    /**
     * Constructor Injection — Spring auto-injects the ShipmentService bean.
     */
    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    /* ================================================================== */
    /*  POST /api/shipments — Create a new shipment                        */
    /* ================================================================== */

    /**
     * Creates a new shipment.
     *
     * Expects a JSON body with the following fields:
     * {
     *   "userId":          "uuid-string",
     *   "blNumber":        "BL-2026-001",
     *   "vesselName":      "MV Ever Given",
     *   "containerNumber": "MSKU1234567",
     *   "arrivalDate":     "2026-03-15T08:00:00"
     * }
     *
     * @param payload the request body as a map
     * @return 201 Created with the persisted Shipment, or 400 Bad Request on validation failure
     */
    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<?> createShipment(@RequestBody Map<String, String> payload) {

        try {
            String userIdStr = payload.get("userId");
            if (userIdStr == null) throw new IllegalArgumentException("userId is required");
            UUID userId = UUID.fromString(userIdStr);
            String blNumber         = payload.get("blNumber");
            String vesselName       = payload.get("vesselName");
            String containerNumber  = payload.get("containerNumber");
            LocalDateTime arrivalDate = payload.containsKey("arrivalDate")
                    ? LocalDateTime.parse(payload.get("arrivalDate"))
                    : null;

            Shipment created = shipmentService.createShipment(
                    userId, blNumber, vesselName, containerNumber, arrivalDate);

            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /* ================================================================== */
    /*  GET /api/shipments?userId={uuid} — List shipments for a user       */
    /* ================================================================== */

    /**
     * Returns all shipments for the specified user, newest first.
     *
     * @param userId the UUID of the shipment owner (query parameter)
     * @return 200 OK with a list of Shipment entities
     */
    @GetMapping
    @SuppressWarnings("null")
    public ResponseEntity<List<Shipment>> getShipmentsByUser(
            @RequestParam("userId") UUID userId) {

        List<Shipment> shipmentList = shipmentService.findShipmentsByUser(userId);
        return ResponseEntity.ok(shipmentList);
    }

    /* ================================================================== */
    /*  GET /api/shipments/{id} — Get a single shipment                    */
    /* ================================================================== */

    /**
     * Returns a single shipment by its database ID.
     *
     * @param shipmentId the UUID of the shipment
     * @return 200 OK with the Shipment, or 404 Not Found
     */
    @GetMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<?> getShipmentById(@PathVariable("id") UUID shipmentId) {

        try {
            Shipment shipment = shipmentService.findShipmentById(shipmentId);
            return ResponseEntity.ok(shipment);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
