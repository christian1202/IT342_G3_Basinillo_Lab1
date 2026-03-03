package com.it342.basinillo.dto;

import com.it342.basinillo.entity.AuditAction;
import com.it342.basinillo.entity.AuditLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO returned when listing audit log entries in the shipment detail view.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {

    private UUID id;
    private UUID shipmentId;
    private UUID userId;
    private AuditAction action;
    private String entityType;
    private String oldValue;
    private String newValue;
    private LocalDateTime timestamp;

    public static AuditLogResponse fromEntity(AuditLog log) {
        if (log == null) return null;
        return AuditLogResponse.builder()
                .id(log.getId())
                .shipmentId(log.getShipmentId())
                .userId(log.getUserId())
                .action(log.getAction())
                .entityType(log.getEntityType())
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .timestamp(log.getTimestamp())
                .build();
    }
}
