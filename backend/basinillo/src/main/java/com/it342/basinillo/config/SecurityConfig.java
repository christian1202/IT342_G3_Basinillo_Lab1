package com.it342.basinillo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

/**
 * Spring Security configuration.
 *
 * Uses OAuth2 Resource Server with JWT to validate Clerk-issued tokens.
 * Public endpoints (webhooks, user sync, health) are explicitly permitted.
 * All other API endpoints require a valid Bearer token.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Allows @PreAuthorize on controller methods
public class SecurityConfig {

    private final ClerkJwtAuthenticationConverter jwtAuthConverter;

    public SecurityConfig(ClerkJwtAuthenticationConverter jwtAuthConverter) {
        this.jwtAuthConverter = jwtAuthConverter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Enable CORS — picks up the CorsConfigurationSource bean from CorsConfig
                .cors(Customizer.withDefaults())
                // Disable CSRF for stateless API
                .csrf(csrf -> csrf.disable())
                // Stateless sessions — no server-side session storage
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Pre-flight OPTIONS are always allowed
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Clerk webhook endpoint — no JWT (webhooks use their own verification)
                        .requestMatchers("/api/webhooks/**").permitAll()
                        // User sync endpoint — called by frontend right after login
                        .requestMatchers("/api/users/sync").permitAll()
                        // Dashboard status endpoint
                        .requestMatchers("/api/dashboard/**").permitAll()
                        // Seed endpoint (development only)
                        .requestMatchers("/api/seed/**").permitAll()
                        // Everything else requires a valid JWT
                        .anyRequest().authenticated())
                // Enable JWT-based OAuth2 resource server with Custom Role Converter
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(
                        jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter)
                ));

        return http.build();
    }
}
