package com.it342.basinillo.repository;

import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.entity.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for the Shipment entity.
 *
 * All list queries are org-scoped for multi-tenant security.
 */
@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, UUID> {

    /**
     * Find all shipments for an organization, newest first.
     */
    List<Shipment> findByOrgIdOrderByCreatedAtDesc(UUID orgId);

    /**
     * Find all shipments assigned to a specific broker, newest first.
     */
    List<Shipment> findByAssignedBrokerIdOrderByCreatedAtDesc(UUID brokerId);

    /**
     * Find a shipment by its Bill of Lading number.
     */
    Optional<Shipment> findByBlNumber(String blNumber);

    /**
     * Find all shipments that are not yet released (for demurrage cron job).
     */
    List<Shipment> findByStatusNot(ShipmentStatus status);

    /**
     * Find all shipments for an org filtered by status.
     */
    List<Shipment> findByOrgIdAndStatus(UUID orgId, ShipmentStatus status);
}
