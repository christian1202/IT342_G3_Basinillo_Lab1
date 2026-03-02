package com.it342.basinillo.controller;

import com.it342.basinillo.dto.ClientRequest;
import com.it342.basinillo.dto.ClientResponse;
import com.it342.basinillo.entity.Client;
import com.it342.basinillo.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Controller for managing Clients.
 * Base path: /api/clients
 */
@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_BROKER')")
    public ResponseEntity<ClientResponse> createClient(
            @NonNull Authentication authentication,
            @NonNull @Valid @RequestBody ClientRequest request) {

        String email = authentication.getName();
        Client client = clientService.createClient(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ClientResponse.fromEntity(client));
    }

    @GetMapping
    public ResponseEntity<List<ClientResponse>> getClients(@NonNull Authentication authentication) {
        String email = authentication.getName();
        List<ClientResponse> clients = clientService.getClientsForOrganization(email)
                .stream()
                .map(ClientResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(clients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> getClientById(@NonNull @PathVariable("id") UUID clientId) {
        Client client = clientService.getClientById(clientId);
        return ResponseEntity.ok(ClientResponse.fromEntity(client));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_BROKER')")
    public ResponseEntity<ClientResponse> updateClient(
            @NonNull @PathVariable("id") UUID clientId,
            @NonNull @Valid @RequestBody ClientRequest request) {

        Client updated = clientService.updateClient(clientId, request);
        return ResponseEntity.ok(ClientResponse.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteClient(@NonNull @PathVariable("id") UUID clientId) {
        clientService.deleteClient(clientId);
        return ResponseEntity.noContent().build();
    }
}
