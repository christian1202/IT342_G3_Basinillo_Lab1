package com.it342.basinillo.controller;

import com.it342.basinillo.dto.AuditLogResponse;
import com.it342.basinillo.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * REST Controller for Audit Log access.
 * Base path: /api/audit-log
 *
 * Read-only in Phase 1 — no external creation needed
 * (AuditLogService is called internally by other services).
 */
@RestController
@RequestMapping("/api/audit-log")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping("/shipment/{shipmentId}")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogs(
            @PathVariable UUID shipmentId) {
        List<AuditLogResponse> logs = auditLogService.findByShipmentId(shipmentId)
                .stream()
                .map(AuditLogResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(logs);
    }
}
