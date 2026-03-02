package com.it342.basinillo.service;

import com.it342.basinillo.entity.Organization;
import com.it342.basinillo.entity.OrgPlan;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.entity.UserRole;
import com.it342.basinillo.repository.OrganizationRepository;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

/**
 * Service for managing Organization entities.
 *
 * Handles webhook-driven creation/update of organizations and
 * membership assignments from Clerk.
 */
@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    public OrganizationService(OrganizationRepository organizationRepository,
                               UserRepository userRepository) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Creates or updates an organization from a Clerk webhook event.
     *
     * Called when Clerk fires `organization.created` or `organization.updated`.
     *
     * @param orgData the "data" payload from the Clerk webhook
     */
    @Transactional
    public void syncOrganization(Map<String, Object> orgData) {
        String clerkOrgId = (String) orgData.get("id");
        String name = (String) orgData.get("name");

        Optional<Organization> existing = organizationRepository.findAll().stream()
                .filter(o -> clerkOrgId.equals(o.getName()))
                .findFirst();

        if (existing.isPresent()) {
            Organization org = existing.get();
            org.setName(name);
            organizationRepository.save(org);
        } else {
            Organization org = Organization.builder()
                    .name(name)
                    .plan(OrgPlan.STARTER)
                    .build();
            organizationRepository.save(org);
        }
    }

    /**
     * Assigns a user to an organization with a specific role.
     *
     * Called when Clerk fires `organizationMembership.created`.
     *
     * @param membershipData the "data" payload from the Clerk webhook
     */
    @Transactional
    @SuppressWarnings("null")
    public void syncMembership(Map<String, Object> membershipData) {
        // Extract the nested objects
        @SuppressWarnings("unchecked")
        Map<String, Object> publicUserData = (Map<String, Object>) membershipData.get("public_user_data");
        String clerkUserId = publicUserData != null ? (String) publicUserData.get("user_id") : null;
        String role = (String) membershipData.get("role");

        @SuppressWarnings("unchecked")
        Map<String, Object> orgData = (Map<String, Object>) membershipData.get("organization");
        String orgName = orgData != null ? (String) orgData.get("name") : null;

        if (clerkUserId == null || orgName == null) {
            return; // Cannot process without user and org info
        }

        // Find the user by Clerk ID
        Optional<User> userOpt = userRepository.findByClerkId(clerkUserId);
        if (userOpt.isEmpty()) {
            return; // User not synced yet — webhook ordering issue
        }

        // Find the organization by name
        Optional<Organization> orgOpt = organizationRepository.findAll().stream()
                .filter(o -> orgName.equals(o.getName()))
                .findFirst();

        if (orgOpt.isEmpty()) {
            return; // Org not synced yet
        }

        User user = userOpt.get();
        user.setOrganization(orgOpt.get());
        user.setRole(mapClerkRole(role));
        userRepository.save(user);
    }

    /**
     * Maps a Clerk organization role string to our UserRole enum.
     */
    private UserRole mapClerkRole(String clerkRole) {
        if (clerkRole == null) return UserRole.CLIENT;

        return switch (clerkRole) {
            case "org:admin" -> UserRole.ADMIN;
            case "org:broker" -> UserRole.BROKER;
            case "org:viewer" -> UserRole.VIEWER;
            default -> UserRole.CLIENT;
        };
    }
}
