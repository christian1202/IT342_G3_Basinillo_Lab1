package com.it342.basinillo.controller;

import com.it342.basinillo.dto.UserSyncDTO;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for User management endpoints.
 * Base path: /api/users
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    /**
     * Constructor Injection — avoids @Autowired on fields.
     * Spring automatically injects the UserService bean.
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST /api/users/sync
     *
     * Called by the frontend after a successful Google Login via Supabase Auth.
     * Ensures the user exists in our backend database (public.profiles table).
     *
     * Flow:
     * 1. Frontend authenticates user with Google via Supabase Auth.
     * 2. Frontend calls this endpoint with the user's details.
     * 3. Backend performs an "Upsert" — creates or updates the user profile.
     * 4. Returns the saved user profile.
     *
     * @param request the UserSyncDTO containing user details
     * @return ResponseEntity containing the synced User
     */
    @PostMapping("/sync")
    public ResponseEntity<User> syncUser(@RequestBody UserSyncDTO request) {
        User user = userService.syncUser(request);
        return ResponseEntity.ok(user);
    }
}
