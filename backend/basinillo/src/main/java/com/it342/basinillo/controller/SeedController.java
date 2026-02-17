package com.it342.basinillo.controller;

import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.entity.ShipmentStatus;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.repository.ShipmentRepository;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/api/seed")
public class SeedController {

    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;
    private final Random random = new Random();

    public SeedController(ShipmentRepository shipmentRepository, UserRepository userRepository) {
        this.shipmentRepository = shipmentRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<String> seedShipments() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            return ResponseEntity.badRequest().body("No users found. Please create a user first.");
        }

        String[] companies = {
            "Toyota Cebu", "Ayala Land", "Shopee Logistics", "Jollibee Foods",
            "San Miguel Corp", "SM Prime", "Globe Telecom", "PLDT Enterprise"
        };

        String[] locations = {
            "Mactan Export Zone", "Cebu IT Park", "Danao Port", "Cebu International Port",
            "Mandaue Reclamation Area", "Naga City Industrial Park"
        };
        
        String[] vessels = {
            "MV Gloria", "Ever Given", "Maersk Cebu", "CMA CGM Marco Polo", "Hapag-Lloyd Express"
        };

        for (int i = 0; i < 40; i++) {
            User randomUser = users.get(random.nextInt(users.size()));
            ShipmentStatus status = getRandomStatus();
            LocalDateTime date = LocalDateTime.now().minusDays(random.nextInt(30));
            
            // Random service fee between 1,500 and 15,000
            BigDecimal serviceFee = BigDecimal.valueOf(1500 + random.nextInt(13501));

            Shipment shipment = Shipment.builder()
                    .user(randomUser)
                    .blNumber("BL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .vesselName(vessels[random.nextInt(vessels.length)])
                    .containerNumber("CONT-" + (1000 + random.nextInt(9000)))
                    .arrivalDate(date.plusDays(random.nextInt(10)))
                    .status(status)
                    .serviceFee(serviceFee)
                    .clientName(companies[random.nextInt(companies.length)] + " - " + locations[random.nextInt(locations.length)])
                    .createdAt(date)
                    .build();

            java.util.Objects.requireNonNull(shipmentRepository.save(shipment));
        }

        return ResponseEntity.ok("Successfully seeded 40 shipments.");
    }

    private ShipmentStatus getRandomStatus() {
        ShipmentStatus[] statuses = ShipmentStatus.values();
        return statuses[random.nextInt(statuses.length)];
    }
}
