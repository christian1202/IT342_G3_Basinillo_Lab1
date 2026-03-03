package com.it342.basinillo.service;

import com.it342.basinillo.dto.DemurrageStatusResponse;
import com.it342.basinillo.dto.ShipmentRequest;
import com.it342.basinillo.dto.UpdateLaneRequest;
import com.it342.basinillo.dto.UpdateStatusRequest;
import com.it342.basinillo.entity.*;
import com.it342.basinillo.repository.ClientRepository;
import com.it342.basinillo.repository.ShipmentRepository;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service layer for Shipment management.
 *
 * Contains the business logic for creating, reading, updating,
 * and soft-deleting shipments. All write operations are wrapped
 * in @Transactional for data integrity.
 *
 * Multi-tenant: all queries are org-scoped via the assigned broker's
 * organization.
 */
@Service
@SuppressWarnings("null")
public class ShipmentService {

    /** Default daily demurrage charge estimate (₱3,000). */
    private static final BigDecimal DEFAULT_DAILY_CHARGE = new BigDecimal("3000.00");

    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final AuditLogService auditLogService;

    public ShipmentService(ShipmentRepository shipmentRepository,
                           UserRepository userRepository,
                           ClientRepository clientRepository,
                           AuditLogService auditLogService) {
        this.shipmentRepository = shipmentRepository;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.auditLogService = auditLogService;
    }

    /* ================================================================== */
    /*  CREATE                                                             */
    /* ================================================================== */

    @Transactional
    public Shipment createShipment(@NonNull ShipmentRequest request) {

        User broker = userRepository.findById(request.getBrokerId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found: " + request.getBrokerId()));

        Organization org = broker.getOrganization();
        if (org == null) {
            throw new IllegalStateException("User is not assigned to any organization.");
        }

        if (shipmentRepository.findByBlNumber(request.getBlNumber()).isPresent()) {
            throw new IllegalArgumentException(
                    "A shipment with BL number '" + request.getBlNumber() + "' already exists.");
        }

        int freeTimeDays = request.getFreeTimeDays() != null ? request.getFreeTimeDays() : 7;
        LocalDate doomsdayDate = computeDoomsdayDate(request.getArrivalDate(), freeTimeDays);

        Shipment shipment = Shipment.builder()
                .organization(org)
                .assignedBroker(broker)
                .blNumber(request.getBlNumber())
                .vesselName(request.getVesselName())
                .voyageNo(request.getVoyageNo())
                .containerNumber(request.getContainerNumber())
                .portOfDischarge(request.getPortOfDischarge())
                .arrivalDate(request.getArrivalDate())
                .freeTimeDays(freeTimeDays)
                .doomsdayDate(doomsdayDate)
                .status(ShipmentStatus.ARRIVED)
                .serviceFee(request.getServiceFee())
                .clientName(request.getClientName())
                .build();

        if (request.getClientId() != null) {
            Client client = clientRepository.findById(request.getClientId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Client not found: " + request.getClientId()));
            shipment.setClient(client);
        }

        Shipment saved = shipmentRepository.save(shipment);

        auditLogService.log(
                broker.getId(), AuditAction.SHIPMENT_CREATED, "SHIPMENT",
                saved.getId(), null,
                Map.of("blNumber", saved.getBlNumber(), "status", saved.getStatus().name()));

        return saved;
    }

    /* ================================================================== */
    /*  UPDATE                                                             */
    /* ================================================================== */

    @Transactional
    public Shipment updateShipment(@NonNull UUID shipmentId, @NonNull ShipmentRequest request) {
        Shipment shipment = findActiveShipmentById(shipmentId);

        shipment.setBlNumber(request.getBlNumber());
        shipment.setVesselName(request.getVesselName());
        shipment.setVoyageNo(request.getVoyageNo());
        shipment.setContainerNumber(request.getContainerNumber());
        shipment.setPortOfDischarge(request.getPortOfDischarge());
        shipment.setArrivalDate(request.getArrivalDate());
        shipment.setServiceFee(request.getServiceFee());
        shipment.setClientName(request.getClientName());

        int freeTimeDays = request.getFreeTimeDays() != null ? request.getFreeTimeDays() : 7;
        shipment.setFreeTimeDays(freeTimeDays);
        shipment.setDoomsdayDate(computeDoomsdayDate(request.getArrivalDate(), freeTimeDays));

        if (request.getBrokerId() != null
                && !request.getBrokerId().equals(shipment.getAssignedBrokerId())) {
            User broker = userRepository.findById(request.getBrokerId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "User not found: " + request.getBrokerId()));
            shipment.setAssignedBroker(broker);
        }

        if (request.getClientId() != null) {
            if (shipment.getClient() == null
                    || !request.getClientId().equals(shipment.getClient().getId())) {
                Client client = clientRepository.findById(request.getClientId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Client not found: " + request.getClientId()));
                shipment.setClient(client);
            }
        } else {
            shipment.setClient(null);
        }

        return shipmentRepository.save(shipment);
    }

    /* ================================================================== */
    /*  STATUS & LANE                                                      */
    /* ================================================================== */

    @Transactional
    public Shipment updateStatus(@NonNull UUID shipmentId,
                                 @NonNull UpdateStatusRequest request) {
        Shipment shipment = findActiveShipmentById(shipmentId);
        ShipmentStatus oldStatus = shipment.getStatus();
        shipment.setStatus(request.getStatus());

        Shipment saved = shipmentRepository.save(shipment);

        if (shipment.getAssignedBrokerId() != null) {
            auditLogService.log(
                    shipment.getAssignedBrokerId(), AuditAction.STATUS_CHANGED, "SHIPMENT",
                    saved.getId(),
                    Map.of("status", oldStatus.name()),
                    Map.of("status", request.getStatus().name()));
        }

        return saved;
    }

    @Transactional
    public Shipment updateLane(@NonNull UUID shipmentId,
                               @NonNull UpdateLaneRequest request) {
        Shipment shipment = findActiveShipmentById(shipmentId);
        LaneStatus oldLane = shipment.getLaneStatus();
        shipment.setLaneStatus(request.getLaneStatus());

        Shipment saved = shipmentRepository.save(shipment);

        if (shipment.getAssignedBrokerId() != null) {
            auditLogService.log(
                    shipment.getAssignedBrokerId(), AuditAction.LANE_CHANGED, "SHIPMENT",
                    saved.getId(),
                    Map.of("laneStatus", oldLane.name()),
                    Map.of("laneStatus", request.getLaneStatus().name()));
        }

        return saved;
    }

    /* ================================================================== */
    /*  SOFT DELETE                                                         */
    /* ================================================================== */

    @Transactional
    public void deleteShipment(@NonNull UUID shipmentId) {
        Shipment shipment = findActiveShipmentById(shipmentId);
        shipment.setDeletedAt(LocalDateTime.now());
        shipmentRepository.save(shipment);
    }

    /* ================================================================== */
    /*  READ                                                               */
    /* ================================================================== */

    @Transactional(readOnly = true)
    public Shipment findShipmentById(@NonNull UUID shipmentId) {
        return shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Shipment not found: " + shipmentId));
    }

    @Transactional(readOnly = true)
    public List<Shipment> findShipmentsByOrg(@NonNull UUID orgId) {
        return shipmentRepository.findByOrgIdAndDeletedAtIsNullOrderByCreatedAtDesc(orgId);
    }

    @Transactional(readOnly = true)
    public List<Shipment> getShipmentsForUser(
            String email,
            java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities) {

        boolean isAdmin = authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return shipmentRepository.findAll(deletedAtIsNull());
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        return shipmentRepository.findByAssignedBrokerIdAndDeletedAtIsNullOrderByCreatedAtDesc(
                user.getId());
    }

    /* ================================================================== */
    /*  FILTERED LIST                                                      */
    /* ================================================================== */

    @Transactional(readOnly = true)
    public List<Shipment> findShipmentsFiltered(UUID orgId,
                                                ShipmentStatus status,
                                                LaneStatus laneStatus,
                                                UUID assignedBrokerId,
                                                UUID clientId,
                                                LocalDateTime arrivalDateFrom,
                                                LocalDateTime arrivalDateTo) {
        Specification<Shipment> spec = deletedAtIsNull();

        if (orgId != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("orgId"), orgId));
        }
        if (status != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("status"), status));
        }
        if (laneStatus != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("laneStatus"), laneStatus));
        }
        if (assignedBrokerId != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("assignedBrokerId"), assignedBrokerId));
        }
        if (clientId != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("clientId"), clientId));
        }
        if (arrivalDateFrom != null) {
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("arrivalDate"), arrivalDateFrom));
        }
        if (arrivalDateTo != null) {
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("arrivalDate"), arrivalDateTo));
        }

        return shipmentRepository.findAll(spec);
    }

    /* ================================================================== */
    /*  DEMURRAGE STATUS                                                   */
    /* ================================================================== */

    @Transactional(readOnly = true)
    public DemurrageStatusResponse getDemurrageStatus(@NonNull UUID shipmentId) {
        Shipment shipment = findActiveShipmentById(shipmentId);

        if (shipment.getDoomsdayDate() == null) {
            return DemurrageStatusResponse.builder()
                    .daysRemaining(0)
                    .urgency(DemurrageUrgency.SAFE)
                    .estimatedCost(BigDecimal.ZERO)
                    .build();
        }

        long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), shipment.getDoomsdayDate());

        DemurrageUrgency urgency;
        if (daysRemaining <= 0) {
            urgency = DemurrageUrgency.CRITICAL;
        } else if (daysRemaining <= 3) {
            urgency = DemurrageUrgency.WARNING;
        } else {
            urgency = DemurrageUrgency.SAFE;
        }

        BigDecimal estimatedCost = BigDecimal.ZERO;
        if (daysRemaining < 0) {
            estimatedCost = DEFAULT_DAILY_CHARGE.multiply(BigDecimal.valueOf(Math.abs(daysRemaining)));
        }

        return DemurrageStatusResponse.builder()
                .daysRemaining(daysRemaining)
                .urgency(urgency)
                .estimatedCost(estimatedCost)
                .build();
    }

    /** Returns all active (non-released, non-deleted) shipments for the cron job. */
    @Transactional(readOnly = true)
    public List<Shipment> findActiveShipmentsForDemurrage() {
        return shipmentRepository.findByStatusNotAndDeletedAtIsNull(ShipmentStatus.RELEASED);
    }

    /* ================================================================== */
    /*  PRIVATE HELPERS                                                    */
    /* ================================================================== */

    private Shipment findActiveShipmentById(@NonNull UUID shipmentId) {
        Shipment shipment = findShipmentById(shipmentId);
        if (shipment.getDeletedAt() != null) {
            throw new IllegalArgumentException("Shipment has been deleted: " + shipmentId);
        }
        return shipment;
    }

    private LocalDate computeDoomsdayDate(LocalDateTime arrivalDate, int freeTimeDays) {
        if (arrivalDate == null) return null;
        return arrivalDate.toLocalDate().plusDays(freeTimeDays);
    }

    private static Specification<Shipment> deletedAtIsNull() {
        return (root, query, cb) -> cb.isNull(root.get("deletedAt"));
    }
}
