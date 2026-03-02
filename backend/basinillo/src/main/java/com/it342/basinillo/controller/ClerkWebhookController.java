package com.it342.basinillo.controller;

import com.it342.basinillo.service.OrganizationService;
import com.it342.basinillo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Receives webhook events from Clerk.
 *
 * Clerk sends POST requests to this endpoint when users, organizations,
 * or memberships are created/updated. The controller dispatches each
 * event to the appropriate service handler.
 *
 * Endpoint: POST /api/webhooks/clerk
 *
 * Note: Webhooks do NOT carry JWTs — they use Svix signatures for
 * verification. This endpoint is explicitly permitted in SecurityConfig.
 */
@RestController
@RequestMapping("/api/webhooks")
public class ClerkWebhookController {

    private final UserService userService;
    private final OrganizationService organizationService;

    public ClerkWebhookController(UserService userService,
                                  OrganizationService organizationService) {
        this.userService = userService;
        this.organizationService = organizationService;
    }

    /**
     * Handles all Clerk webhook events.
     *
     * Clerk event structure:
     * {
     *   "type": "user.created",
     *   "data": { ... }
     * }
     *
     * @param payload the full webhook JSON body
     * @return 200 OK to acknowledge receipt
     */
    @PostMapping("/clerk")
    @SuppressWarnings("unchecked")
    public ResponseEntity<Map<String, String>> handleClerkWebhook(
            @RequestBody Map<String, Object> payload) {

        String eventType = (String) payload.get("type");
        Map<String, Object> data = (Map<String, Object>) payload.get("data");

        if (eventType == null || data == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid webhook payload"));
        }

        switch (eventType) {
            case "user.created", "user.updated" ->
                    userService.syncUserFromWebhook(data);

            case "organization.created", "organization.updated" ->
                    organizationService.syncOrganization(data);

            case "organizationMembership.created", "organizationMembership.updated" ->
                    organizationService.syncMembership(data);

            default -> {
                // Unhandled event type — acknowledge but do nothing
            }
        }

        return ResponseEntity.ok(Map.of("status", "processed", "event", eventType));
    }
}
