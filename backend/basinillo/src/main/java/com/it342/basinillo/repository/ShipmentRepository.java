package com.it342.basinillo.repository;

import com.it342.basinillo.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for the Shipment entity.
 *
 * Provides standard CRUD operations plus custom queries
 * for user-scoped and Bill of Lading lookups.
 */
@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, UUID> {

    /**
     * Find all shipments belonging to a specific user, newest first.
     * Ensures clients only see their own cargo.
     *
     * @param userId the UUID of the shipment owner
     * @return list of shipments ordered by creation date descending
     */
    List<Shipment> findByUserIdOrderByCreatedAtDesc(UUID userId);

    /**
     * Find a shipment by its Bill of Lading number.
     *
     * @param blNumber the Bill of Lading identifier
     * @return an Optional containing the shipment if found
     */
    Optional<Shipment> findByBlNumber(String blNumber);
}
