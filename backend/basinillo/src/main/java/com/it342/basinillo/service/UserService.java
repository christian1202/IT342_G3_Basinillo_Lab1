package com.it342.basinillo.service;

import com.it342.basinillo.dto.UserSyncDTO;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.entity.UserRole;
import com.it342.basinillo.repository.OrganizationRepository;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
