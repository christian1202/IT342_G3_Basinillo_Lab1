package com.it342.basinillo.service;

import com.it342.basinillo.dto.UserSyncDTO;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Service layer for User management.
 * Handles the "Upsert" (Update or Insert) logic for syncing
 * frontend users with the backend database.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    /**
     * Constructor Injection — Spring will automatically inject the UserRepository
     * bean.
     * We avoid @Autowired on fields to follow best practices for testability and
     * immutability.
     */
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Syncs a user from the frontend (after Supabase Auth login) to the backend
     * database.
     *
     * UPSERT LOGIC:
     * 1. Parse the UUID from the incoming DTO.
     * 2. Check if a user with this UUID already exists in the database.
     * 3. If YES → Update the existing user's details (email, fullName, avatarUrl).
     * 4. If NO → Create a new User entity with role defaulting to "client".
     * 5. Save and return the user.
     *
     * @param request the UserSyncDTO containing user details from the frontend
     * @return the saved (created or updated) User entity
     */
    @SuppressWarnings("null")
    public User syncUser(UserSyncDTO request) {
        UUID userId = UUID.fromString(request.getUuid());

        // --- Upsert: Check if user already exists ---
        User user = userRepository.findById(userId).orElse(null);

        if (user != null) {
            // --- UPDATE: User exists, refresh their profile details ---
            user.setEmail(request.getEmail());
            user.setFullName(request.getFullName());
            user.setAvatarUrl(request.getAvatarUrl());
        } else {
            // --- INSERT: New user, create a fresh profile ---
            user = new User();
            user.setId(userId);
            user.setEmail(request.getEmail());
            user.setFullName(request.getFullName());
            user.setAvatarUrl(request.getAvatarUrl());
            user.setRole("client"); // Default role for new users
        }

        return userRepository.save(user);
    }
}
