package com.it342.basinillo.service;

import com.it342.basinillo.dto.UpdateStatusRequest;
import com.it342.basinillo.entity.Organization;
import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.entity.ShipmentStatus;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.repository.ShipmentRepository;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Service layer for Shipment management.
 *
 * Contains the business logic for creating, reading, and updating shipments.
 * All write operations are wrapped in @Transactional for data integrity.
 *
 * Multi-tenant: all queries are org-scoped via the assigned broker's organization.
 */
@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;

    public ShipmentService(ShipmentRepository shipmentRepository,
                           UserRepository userRepository) {
        this.shipmentRepository = shipmentRepository;
        this.userRepository = userRepository;
    }

    /* ================================================================== */
    /*  CREATE                                                             */
    /* ================================================================== */

    /**
     * Creates a new shipment within the broker's organization.
     *
     * @param brokerId        UUID of the broker creating the shipment
     * @param blNumber        unique Bill of Lading number
     * @param vesselName      name of the carrying vessel
     * @param containerNumber container ID (e.g., "MSKU1234567")
     * @param arrivalDate     estimated time of arrival
     * @return the persisted Shipment entity
     */
    @Transactional
    public Shipment createShipment(@NonNull UUID brokerId,
                                   String blNumber,
                                   String vesselName,
                                   String containerNumber,
                                   LocalDateTime arrivalDate) {

        User broker = userRepository.findById(brokerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + brokerId));

        Organization org = broker.getOrganization();
        if (org == null) {
            throw new IllegalStateException("User is not assigned to any organization.");
        }

        if (shipmentRepository.findByBlNumber(blNumber).isPresent()) {
            throw new IllegalArgumentException(
                    "A shipment with BL number '" + blNumber + "' already exists.");
        }

        // Compute doomsday date if arrival date is provided
        LocalDate doomsdayDate = null;
        if (arrivalDate != null) {
            doomsdayDate = arrivalDate.toLocalDate().plusDays(7);
        }

        Shipment shipment = Shipment.builder()
                .organization(org)
                .assignedBroker(broker)
                .blNumber(blNumber)
                .vesselName(vesselName)
                .containerNumber(containerNumber)
                .arrivalDate(arrivalDate)
                .doomsdayDate(doomsdayDate)
                .status(ShipmentStatus.ARRIVED)
                .build();

        return shipmentRepository.save(shipment);
    }

    /* ================================================================== */
    /*  READ                                                               */
    /* ================================================================== */

    /**
     * Finds all shipments scoped to a specific organization, newest first.
     */
    @Transactional(readOnly = true)
    public List<Shipment> findShipmentsByOrg(@NonNull UUID orgId) {
        return shipmentRepository.findByOrgIdOrderByCreatedAtDesc(orgId);
    }

    /**
     * Finds a single shipment by its database ID.
     */
    @Transactional(readOnly = true)
    public Shipment findShipmentById(@NonNull UUID shipmentId) {
        return shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Shipment not found: " + shipmentId));
    }

    /* ================================================================== */
    /*  UPDATE                                                             */
    /* ================================================================== */

    /**
     * Updates the lifecycle status of a shipment.
     */
    @Transactional
    public Shipment updateStatus(@NonNull UUID shipmentId,
                                 @NonNull UpdateStatusRequest request) {

        Shipment shipment = findShipmentById(shipmentId);
        shipment.setStatus(request.getStatus());

        return shipmentRepository.save(shipment);
    }

    /**
     * Retrieves shipments based on the user's role.
     * ADMIN: all org shipments. BROKER: their assigned shipments.
     */
    @Transactional(readOnly = true)
    public List<Shipment> getShipmentsForUser(String email,
                                              java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities) {

        boolean isAdmin = authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return shipmentRepository.findAll();
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        return shipmentRepository.findByAssignedBrokerIdOrderByCreatedAtDesc(user.getId());
    }
}
