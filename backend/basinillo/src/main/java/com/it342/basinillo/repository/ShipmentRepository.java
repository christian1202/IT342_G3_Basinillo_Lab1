package com.it342.basinillo.repository;

import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.entity.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for the Shipment entity.
 *
 * Extends {@link JpaSpecificationExecutor} to support dynamic
 * filtering by status, lane, broker, client, and date range.
 *
 * All list queries exclude soft-deleted records (deletedAt IS NULL).
 */
@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, UUID>,
        JpaSpecificationExecutor<Shipment> {

    /** Find all shipments for an organization, newest first, excluding soft-deleted. */
    List<Shipment> findByOrgIdAndDeletedAtIsNullOrderByCreatedAtDesc(UUID orgId);

    /** Find all shipments assigned to a specific broker, newest first, excluding soft-deleted. */
    List<Shipment> findByAssignedBrokerIdAndDeletedAtIsNullOrderByCreatedAtDesc(UUID brokerId);

    /** Find a shipment by its Bill of Lading number (including soft-deleted for uniqueness checks). */
    Optional<Shipment> findByBlNumber(String blNumber);

    /** Find all active shipments that are not yet released (for demurrage cron). */
    List<Shipment> findByStatusNotAndDeletedAtIsNull(ShipmentStatus status);

    /** Find all active shipments for an org filtered by status. */
    List<Shipment> findByOrgIdAndStatusAndDeletedAtIsNull(UUID orgId, ShipmentStatus status);

    /** Legacy fallback methods. */
    List<Shipment> findByOrgIdOrderByCreatedAtDesc(UUID orgId);
    List<Shipment> findByAssignedBrokerIdOrderByCreatedAtDesc(UUID brokerId);
    List<Shipment> findByStatusNot(ShipmentStatus status);
    List<Shipment> findByOrgIdAndStatus(UUID orgId, ShipmentStatus status);
}
