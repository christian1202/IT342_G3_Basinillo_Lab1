package com.it342.basinillo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for the /api/users/sync endpoint.
 *
 * We use a DTO instead of exposing the raw User entity to the public API.
 * This decouples the API contract from the database schema and allows us
 * to control exactly which fields are accepted from the frontend.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSyncDTO {

    /**
     * The Supabase Auth user UUID, received as a String and parsed to UUID in the
     * service.
     */
    private String uuid;

    private String email;

    private String fullName;

    private String avatarUrl;
}
