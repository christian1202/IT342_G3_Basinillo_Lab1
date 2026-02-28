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
     * Called by the frontend after a successful Clerk authentication.
     * Ensures the user exists in our backend database (users table).
     *
     * @param request the UserSyncDTO containing Clerk user details
     * @return ResponseEntity containing the synced User
     */
    @PostMapping("/sync")
    public ResponseEntity<User> syncUser(@RequestBody UserSyncDTO request) {
        User user = userService.syncUser(request);
        return ResponseEntity.ok(user);
    }
}
