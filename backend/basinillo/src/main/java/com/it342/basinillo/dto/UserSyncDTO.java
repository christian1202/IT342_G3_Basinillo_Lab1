package com.it342.basinillo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for the /api/users/sync endpoint.
 *
 * Decouples the API contract from the database schema. Accepts
 * Clerk user data from the frontend for upsert into the users table.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSyncDTO {

    /** Clerk external user ID (e.g., "user_2abc123..."). */
    private String clerkId;

    private String email;

    private String fullName;

    private String avatarUrl;
}
