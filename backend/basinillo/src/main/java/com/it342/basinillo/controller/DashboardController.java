package com.it342.basinillo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * REST Controller for Dashboard-related endpoints.
 * Base path: /api/dashboard
 *
 * Provides lightweight status and summary data for the frontend
 * Dashboard page. No service layer is needed yet — when business
 * logic grows, extract it into a DashboardService.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    /**
     * GET /api/dashboard/status
     *
     * Returns a simple JSON object confirming the backend is reachable.
     * The frontend calls this on the Dashboard page to verify the
     * Spring Boot ↔ Next.js connection is working.
     *
     * Response shape:
     * {
     *   "status":    "ok",
     *   "message":   "Spring Boot backend is connected successfully!",
     *   "timestamp": "2026-02-16T09:30:00.000Z"
     * }
     *
     * @return ResponseEntity containing a status map
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> fetchDashboardStatus() {

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "ok");
        response.put("message", "Spring Boot backend is connected successfully!");
        response.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(response);
    }
}
