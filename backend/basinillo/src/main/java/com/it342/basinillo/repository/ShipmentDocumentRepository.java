package com.it342.basinillo.repository;

import com.it342.basinillo.entity.ShipmentDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for the ShipmentDocument entity.
 *
 * Provides standard CRUD operations plus a custom query
 * to retrieve all documents for a given shipment.
 */
@Repository
public interface ShipmentDocumentRepository extends JpaRepository<ShipmentDocument, UUID> {

    /**
     * Find all documents attached to a specific shipment.
     *
     * @param shipmentId the UUID of the parent shipment
     * @return list of documents belonging to that shipment
     */
    List<ShipmentDocument> findByShipmentId(UUID shipmentId);
}
