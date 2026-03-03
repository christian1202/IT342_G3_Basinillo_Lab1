package com.it342.basinillo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.it342.basinillo.entity.AuditAction;
import com.it342.basinillo.entity.AuditLog;
import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.repository.AuditLogRepository;
import com.it342.basinillo.repository.ShipmentRepository;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Centralised audit logging service.
 *
 * Every mutation (status change, lane change, document upload, item CRUD)
 * is recorded through this service to build a complete change history
 * for each shipment.
 */
@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public AuditLogService(AuditLogRepository auditLogRepository,
                           ShipmentRepository shipmentRepository,
                           UserRepository userRepository,
                           ObjectMapper objectMapper) {
        this.auditLogRepository = auditLogRepository;
        this.shipmentRepository = shipmentRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    /* ================================================================== */
    /*  Core logging method                                                */
    /* ================================================================== */

    /**
     * Creates an immutable audit log entry.
     *
     * @param userId     UUID of the user who performed the action
     * @param action     the action enum (e.g., STATUS_CHANGED)
     * @param entityType entity category (e.g., "SHIPMENT", "DOCUMENT")
     * @param shipmentId the parent shipment UUID
     * @param oldValue   map of old values (null for CREATE actions)
     * @param newValue   map of new values (null for DELETE actions)
     */
    @Transactional
    @SuppressWarnings("null")
    public void log(@NonNull UUID userId,
                    @NonNull AuditAction action,
                    @NonNull String entityType,
                    @NonNull UUID shipmentId,
                    @Nullable Map<String, Object> oldValue,
                    @Nullable Map<String, Object> newValue) {

        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new IllegalArgumentException("Shipment not found: " + shipmentId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        AuditLog entry = AuditLog.builder()
                .shipment(shipment)
                .user(user)
                .action(action)
                .entityType(entityType)
                .oldValue(toJson(oldValue))
                .newValue(toJson(newValue))
                .build();

        auditLogRepository.save(entry);
    }

    /* ================================================================== */
    /*  Read                                                               */
    /* ================================================================== */

    @Transactional(readOnly = true)
    public List<AuditLog> findByShipmentId(@NonNull UUID shipmentId) {
        return auditLogRepository.findByShipmentIdOrderByTimestampDesc(shipmentId);
    }

    /* ================================================================== */
    /*  Helpers                                                            */
    /* ================================================================== */

    private String toJson(@Nullable Map<String, Object> map) {
        if (map == null) return null;
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            return map.toString();
        }
    }
}
