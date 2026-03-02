package com.it342.basinillo.service;

import com.it342.basinillo.dto.UserSyncDTO;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.entity.UserRole;
import com.it342.basinillo.repository.OrganizationRepository;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * Service layer for User management.
 *
 * Handles the upsert (update-or-insert) logic for syncing
 * Clerk-authenticated users with the backend database.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public UserService(UserRepository userRepository, OrganizationRepository organizationRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }

    /**
     * Syncs a user from the frontend (after Clerk login) to the backend database.
     *
     * UPSERT logic:
     *   1. Look up by Clerk ID (preferred) or email (fallback).
     *   2. If found → update profile fields.
     *   3. If not found → create a new user with CLIENT role default.
     *
     * @param request the DTO containing user details from the frontend
     * @return the saved (created or updated) User entity
     */
    @Transactional
    @SuppressWarnings("null")
    public User syncUser(UserSyncDTO request) {

        // Try to find by clerkId first, then by email
        User user = userRepository.findByClerkId(request.getClerkId())
                .orElseGet(() -> userRepository.findByEmail(request.getEmail())
                        .orElse(null));

        if (user != null) {
            // UPDATE: user exists, refresh profile details
            user.setEmail(request.getEmail());
            user.setFullName(request.getFullName());
            user.setAvatarUrl(request.getAvatarUrl());
            if (user.getClerkId() == null) {
                user.setClerkId(request.getClerkId());
            }
            if (user.getOrganization() == null) {
                user.setOrganization(organizationRepository.findAll().stream().findFirst().orElse(null));
            }
        } else {
            // INSERT: new user
            user = User.builder()
                    .clerkId(request.getClerkId())
                    .email(request.getEmail())
                    .fullName(request.getFullName())
                    .avatarUrl(request.getAvatarUrl())
                    .role(UserRole.CLIENT)
                    .organization(organizationRepository.findAll().stream().findFirst().orElse(null))
                    .build();
        }

        return userRepository.save(user);
    }

    /**
     * Creates or updates a user from a Clerk webhook event.
     *
     * Called when Clerk fires `user.created` or `user.updated`.
     *
     * @param userData the "data" payload from the Clerk webhook
     */
    @Transactional
    @SuppressWarnings("null")
    public void syncUserFromWebhook(Map<String, Object> userData) {
        String clerkId = (String) userData.get("id");

        // Build email from Clerk's email_addresses array
        String email = null;
        Object emailAddresses = userData.get("email_addresses");
        if (emailAddresses instanceof java.util.List<?> list && !list.isEmpty()) {
            Object first = list.get(0);
            if (first instanceof java.util.Map<?, ?> emailMap) {
                email = (String) emailMap.get("email_address");
            }
        }

        String firstName = (String) userData.get("first_name");
        String lastName = (String) userData.get("last_name");
        String fullName = ((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "")).trim();
        String avatarUrl = (String) userData.get("image_url");

        // Upsert by clerkId
        User user = userRepository.findByClerkId(clerkId).orElse(null);

        if (user != null) {
            user.setEmail(email != null ? email : user.getEmail());
            user.setFullName(fullName.isEmpty() ? user.getFullName() : fullName);
            user.setAvatarUrl(avatarUrl);
        } else {
            user = User.builder()
                    .clerkId(clerkId)
                    .email(email != null ? email : "unknown@portkey.app")
                    .fullName(fullName.isEmpty() ? "New User" : fullName)
                    .avatarUrl(avatarUrl)
                    .role(UserRole.CLIENT)
                    .organization(organizationRepository.findAll().stream().findFirst().orElse(null))
                    .build();
        }

        userRepository.save(user);
    }
}
