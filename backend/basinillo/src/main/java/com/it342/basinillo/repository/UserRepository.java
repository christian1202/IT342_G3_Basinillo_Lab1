package com.it342.basinillo.repository;

import com.it342.basinillo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for the User entity.
 * Provides standard CRUD plus lookups by Clerk ID and email.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find a user by their Clerk external ID.
     * Primary lookup method for webhook-synced users.
     */
    Optional<User> findByClerkId(String clerkId);

    /**
     * Find a user by their email address.
     * Fallback lookup for users not yet linked to Clerk.
     */
    Optional<User> findByEmail(String email);
}
