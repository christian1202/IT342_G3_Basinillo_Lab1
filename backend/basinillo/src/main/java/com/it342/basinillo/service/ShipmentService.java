package com.it342.basinillo.service;

import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.entity.ShipmentStatus;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.repository.ShipmentRepository;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Objects;

/**
 * Service layer for Shipment management.
 *
 * Contains the business logic for creating and querying shipments.
 * All write operations are wrapped in @Transactional for data integrity.
 */
@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;

    /**
     * Constructor Injection — Spring auto-injects both repositories.
     */
    public ShipmentService(ShipmentRepository shipmentRepository,
                           UserRepository userRepository) {
        this.shipmentRepository = shipmentRepository;
        this.userRepository = userRepository;
    }

    /* ================================================================== */
    /*  CREATE                                                             */
    /* ================================================================== */

    /**
     * Creates a new shipment for the given user.
     *
     * Guard clauses:
     *   1. User must exist in the database.
     *   2. Bill of Lading number must not already be in use.
     *
     * @param userId          the UUID of the shipment owner
     * @param blNumber        the unique Bill of Lading number
     * @param vesselName      the name of the carrying vessel
     * @param containerNumber the container ID (e.g., "MSKU1234567")
     * @param arrivalDate     the estimated time of arrival
     * @return the persisted Shipment entity
     * @throws IllegalArgumentException if user not found or BL number is duplicate
     */
    @Transactional
    @SuppressWarnings("null")
    public Shipment createShipment(@NonNull UUID userId,
                                   String blNumber,
                                   String vesselName,
                                   String containerNumber,
                                   LocalDateTime arrivalDate) {

        // Guard: user must exist
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found: " + userId));

        // Guard: BL number must be unique
        if (shipmentRepository.findByBlNumber(blNumber).isPresent()) {
            throw new IllegalArgumentException(
                    "A shipment with BL number '" + blNumber + "' already exists.");
        }

        // --- Build and persist the shipment ---
        Shipment shipment = Shipment.builder()
                .user(owner)
                .blNumber(blNumber)
                .vesselName(vesselName)
                .containerNumber(containerNumber)
                .arrivalDate(arrivalDate)
                .status(ShipmentStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        return Objects.requireNonNull(shipmentRepository.save(shipment));
    }

    /* ================================================================== */
    /*  READ                                                               */
    /* ================================================================== */

    /**
     * Retrieves all shipments owned by a specific user, newest first.
     *
     * @param userId the UUID of the shipment owner
     * @return list of shipments ordered by creation date descending
     */
    @Transactional(readOnly = true)
    public List<Shipment> findShipmentsByUser(@NonNull UUID userId) {
        return shipmentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Retrieves a single shipment by its database ID.
     *
     * @param shipmentId the UUID of the shipment
     * @return the Shipment entity
     * @throws IllegalArgumentException if not found
     */
    @Transactional(readOnly = true)
    public Shipment findShipmentById(@NonNull UUID shipmentId) {
        return shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Shipment not found: " + shipmentId));
    }
    /**
     * Retrieves shipments based on the user's role.
     * <p>
     * - ADMIN: Returns ALL shipments (for analysis).
     * - USER: Returns ONLY shipments owned by the user.
     *
     * @param email       the email of the authenticated user
     * @param authorities the roles/authorities of the authenticated user
     * @return list of shipments accessible to the user
     */
    @Transactional(readOnly = true)
    public List<Shipment> getShipmentsForUser(String email,
                                              java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities) {
        // Check for Admin role
        boolean isAdmin = authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return shipmentRepository.findAll();
        }

        // For regular users, look up their ID and fetch their specific shipments
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        return shipmentRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
}
