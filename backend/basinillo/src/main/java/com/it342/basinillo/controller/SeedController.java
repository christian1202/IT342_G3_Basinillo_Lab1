package com.it342.basinillo.controller;

import com.it342.basinillo.entity.*;
import com.it342.basinillo.repository.ClientRepository;
import com.it342.basinillo.repository.OrganizationRepository;
import com.it342.basinillo.repository.ShipmentRepository;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

/**
 * Development-only controller for seeding the database with sample data.
 *
 * Creates: 1 Organization → 2 Users → 3 Clients → 40 Shipments.
 * Should be disabled or removed before production deployment.
 */
@RestController
@RequestMapping("/api/seed")
public class SeedController {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final ShipmentRepository shipmentRepository;
    private final Random random = new Random();

    public SeedController(OrganizationRepository organizationRepository,
                          UserRepository userRepository,
                          ClientRepository clientRepository,
                          ShipmentRepository shipmentRepository) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.shipmentRepository = shipmentRepository;
    }

    @PostMapping
    @Transactional
    @SuppressWarnings("null")
    public ResponseEntity<String> seedDatabase() {

        // ── 1. Organization ───────────────────────────────────────────
        Organization org = Organization.builder()
                .name("Cebu Customs Brokerage Corp.")
                .licenseNumber("CB-2026-001")
                .plan(OrgPlan.PRO)
                .build();
        org = organizationRepository.save(org);

        // ── 2. Users (Admin + Broker) ─────────────────────────────────
        User admin = User.builder()
                .clerkId("clerk_seed_admin_001")
                .email("admin@portkey.ph")
                .fullName("Maria Santos")
                .role(UserRole.ADMIN)
                .organization(org)
                .build();
        admin = userRepository.save(admin);

        User broker = User.builder()
                .clerkId("clerk_seed_broker_001")
                .email("broker@portkey.ph")
                .fullName("Juan Dela Cruz")
                .role(UserRole.BROKER)
                .organization(org)
                .build();
        broker = userRepository.save(broker);

        List<User> brokers = List.of(admin, broker);

        // ── 3. Clients ────────────────────────────────────────────────
        String[][] clientData = {
            {"Toyota Motor Philippines", "123-456-789", "imports@toyota.ph"},
            {"Jollibee Foods Corporation", "987-654-321", "logistics@jollibee.ph"},
            {"SM Prime Holdings", "555-123-456", "warehouse@smprime.ph"}
        };

        for (String[] c : clientData) {
            clientRepository.save(Client.builder()
                    .organization(org)
                    .companyName(c[0])
                    .tinNumber(c[1])
                    .contactEmail(c[2])
                    .build());
        }

        // ── 4. Shipments ──────────────────────────────────────────────
        String[] vessels = {
            "MV Gloria", "Ever Given", "Maersk Cebu",
            "CMA CGM Marco Polo", "Hapag-Lloyd Express"
        };

        String[] ports = {
            "Port of Cebu", "Port of Manila", "Port of Subic",
            "Port of Batangas", "Port of Davao"
        };

        ShipmentStatus[] statuses = ShipmentStatus.values();

        for (int i = 0; i < 40; i++) {
            User assignedBroker = brokers.get(random.nextInt(brokers.size()));
            ShipmentStatus status = statuses[random.nextInt(statuses.length)];
            LocalDateTime arrivalDate = LocalDateTime.now().minusDays(random.nextInt(30));
            int freeDays = 5 + random.nextInt(5); // 5–9 days
            LocalDate doomsdayDate = arrivalDate.toLocalDate().plusDays(freeDays);

            Shipment shipment = Shipment.builder()
                    .organization(org)
                    .assignedBroker(assignedBroker)
                    .blNumber("BL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .vesselName(vessels[random.nextInt(vessels.length)])
                    .containerNumber("CONT-" + (1000 + random.nextInt(9000)))
                    .portOfDischarge(ports[random.nextInt(ports.length)])
                    .arrivalDate(arrivalDate)
                    .freeTimeDays(freeDays)
                    .doomsdayDate(doomsdayDate)
                    .status(status)
                    .laneStatus(LaneStatus.values()[random.nextInt(LaneStatus.values().length)])
                    .serviceFee(BigDecimal.valueOf(1500 + random.nextInt(13501)))
                    .clientName(clientData[random.nextInt(clientData.length)][0])
                    .build();

            shipmentRepository.save(shipment);
        }

        return ResponseEntity.ok("Seeded: 1 org, 2 users, 3 clients, 40 shipments.");
    }
}
