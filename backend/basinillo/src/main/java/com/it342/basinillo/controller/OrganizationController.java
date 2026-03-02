package com.it342.basinillo.controller;

import com.it342.basinillo.entity.Organization;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for Organization-scoped details.
 * Base path: /api/orgs
 */
@RestController
@RequestMapping("/api/orgs")
public class OrganizationController {

    private final UserRepository userRepository;

    public OrganizationController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Retrieves the Organization details for the currently authenticated user.
     *
     * @param authentication Security context principal containing the Clerk JWT
     * @return 200 OK with the Organization entity (Tenant scope context)
     */
    @GetMapping("/me")
    public ResponseEntity<Organization> getMyOrganization(Authentication authentication) {
        String email = authentication.getName(); // JWT sub or email claim
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found in database"));

        return ResponseEntity.ok(user.getOrganization());
    }
}
