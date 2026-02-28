package com.it342.basinillo.repository;

import com.it342.basinillo.entity.DemurrageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for the DemurrageLog entity.
 */
@Repository
public interface DemurrageLogRepository extends JpaRepository<DemurrageLog, UUID> {

    /**
     * Find all demurrage charges for a specific shipment, ordered by date.
     *
     * @param shipmentId the parent shipment UUID
     * @return list of demurrage records, newest first
     */
    List<DemurrageLog> findByShipmentIdOrderByDateDesc(UUID shipmentId);
}
