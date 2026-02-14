package com.it342.basinillo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration for the application.
 *
 * Since spring-boot-starter-security is on the classpath, all endpoints
 * are secured by default. This config explicitly permits the user sync
 * endpoint so the frontend can call it after Google Login.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for API endpoints (frontend uses token-based auth)
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Allow the sync endpoint without authentication
                        .requestMatchers("/api/users/sync").permitAll()
                        // All other endpoints require authentication
                        .anyRequest().authenticated());

        return http.build();
    }
}
