package com.it342.basinillo.repository;

import com.it342.basinillo.entity.ShipmentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for the ShipmentItem entity.
 */
@Repository
public interface ShipmentItemRepository extends JpaRepository<ShipmentItem, UUID> {

    /**
     * Find all line items belonging to a specific shipment.
     *
     * @param shipmentId the parent shipment UUID
     * @return list of items for that shipment
     */
    List<ShipmentItem> findByShipmentId(UUID shipmentId);
}
