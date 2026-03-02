package com.it342.basinillo.service;

import com.it342.basinillo.dto.ShipmentRequest;
import com.it342.basinillo.dto.UpdateStatusRequest;
import com.it342.basinillo.entity.Client;
import com.it342.basinillo.entity.Organization;
import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.entity.ShipmentStatus;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.repository.ClientRepository;
import com.it342.basinillo.repository.ShipmentRepository;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
@SuppressWarnings("null")
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;

    public ShipmentService(ShipmentRepository shipmentRepository,
                           UserRepository userRepository,
                           ClientRepository clientRepository) {
        this.shipmentRepository = shipmentRepository;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
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
    public Shipment createShipment(@NonNull ShipmentRequest request) {

        User broker = userRepository.findById(request.getBrokerId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + request.getBrokerId()));

        Organization org = broker.getOrganization();
        if (org == null) {
            throw new IllegalStateException("User is not assigned to any organization.");
        }

        if (shipmentRepository.findByBlNumber(request.getBlNumber()).isPresent()) {
            throw new IllegalArgumentException(
                    "A shipment with BL number '" + request.getBlNumber() + "' already exists.");
        }

        // Compute doomsday date if arrival date is provided
        LocalDate doomsdayDate = null;
        if (request.getArrivalDate() != null && request.getFreeTimeDays() != null) {
            doomsdayDate = request.getArrivalDate().toLocalDate().plusDays(request.getFreeTimeDays());
        }

        Shipment shipment = Shipment.builder()
                .organization(org)
                .assignedBroker(broker)
                .blNumber(request.getBlNumber())
                .vesselName(request.getVesselName())
                .voyageNo(request.getVoyageNo())
                .containerNumber(request.getContainerNumber())
                .portOfDischarge(request.getPortOfDischarge())
                .arrivalDate(request.getArrivalDate())
                .freeTimeDays(request.getFreeTimeDays() != null ? request.getFreeTimeDays() : 7)
                .doomsdayDate(doomsdayDate)
                .status(ShipmentStatus.ARRIVED)
                .serviceFee(request.getServiceFee())
                .clientName(request.getClientName())
                .build();

        if (request.getClientId() != null) {
            Client client = clientRepository.findById(request.getClientId())
                    .orElseThrow(() -> new IllegalArgumentException("Client not found: " + request.getClientId()));
            shipment.setClient(client);
        }

        return shipmentRepository.save(shipment);
    }

    /* ================================================================== */
    /*  UPDATE                                                             */
    /* ================================================================== */

    @Transactional
    public Shipment updateShipment(@NonNull UUID shipmentId, @NonNull ShipmentRequest request) {
        Shipment shipment = findShipmentById(shipmentId);

        shipment.setBlNumber(request.getBlNumber());
        shipment.setVesselName(request.getVesselName());
        shipment.setVoyageNo(request.getVoyageNo());
        shipment.setContainerNumber(request.getContainerNumber());
        shipment.setPortOfDischarge(request.getPortOfDischarge());
        shipment.setArrivalDate(request.getArrivalDate());
        shipment.setFreeTimeDays(request.getFreeTimeDays() != null ? request.getFreeTimeDays() : 7);
        shipment.setServiceFee(request.getServiceFee());
        shipment.setClientName(request.getClientName());

        if (request.getArrivalDate() != null && request.getFreeTimeDays() != null) {
            shipment.setDoomsdayDate(request.getArrivalDate().toLocalDate().plusDays(request.getFreeTimeDays()));
        }

        if (request.getBrokerId() != null && !request.getBrokerId().equals(shipment.getAssignedBroker().getId())) {
             User broker = userRepository.findById(request.getBrokerId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + request.getBrokerId()));
             shipment.setAssignedBroker(broker);
        }

        if (request.getClientId() != null) {
            if (shipment.getClient() == null || !request.getClientId().equals(shipment.getClient().getId())) {
                Client client = clientRepository.findById(request.getClientId())
                        .orElseThrow(() -> new IllegalArgumentException("Client not found: " + request.getClientId()));
                shipment.setClient(client);
            }
        } else {
            shipment.setClient(null);
        }

        return shipmentRepository.save(shipment);
    }

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

    /* ================================================================== */
    /*  DELETE                                                             */
    /* ================================================================== */

    @Transactional
    public void deleteShipment(@NonNull UUID shipmentId) {
        Shipment shipment = findShipmentById(shipmentId);
        shipmentRepository.delete(shipment);
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
