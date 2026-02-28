package com.it342.basinillo.repository;

import com.it342.basinillo.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for the AuditLog entity.
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    /**
     * Find all audit entries for a specific shipment, newest first.
     *
     * @param shipmentId the shipment UUID
     * @return list of audit records ordered by timestamp descending
     */
    List<AuditLog> findByShipmentIdOrderByTimestampDesc(UUID shipmentId);
}
