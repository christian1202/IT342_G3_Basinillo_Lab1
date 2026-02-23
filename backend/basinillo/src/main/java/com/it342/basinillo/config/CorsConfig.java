package com.it342.basinillo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

/**
 * Global CORS Configuration.
 *
 * Allows the Next.js frontend (localhost:3000 / 3001) to communicate
 * with the Spring Boot API without being blocked by browser Same-Origin Policy.
 *
 * Two layers of CORS are configured here:
 *   1. WebMvcConfigurer  — handles CORS at the Spring MVC (DispatcherServlet) level.
 *   2. CorsConfigurationSource bean — picked up by Spring Security's CorsFilter,
 *      which runs BEFORE the security filter chain and handles pre-flight OPTIONS requests.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${cors.allowed-origins:http://localhost:3000,http://localhost:8080,https://*.vercel.app}")
    private List<String> allowedOrigins;

    private static final List<String> ALLOWED_METHODS = List.of(
            "GET", "POST", "PUT", "DELETE", "OPTIONS"
    );

    // ──────────────────────────────────────────────
    // Layer 1: Spring MVC-level CORS
    // ──────────────────────────────────────────────
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        String[] origins = allowedOrigins.toArray(new String[0]);
        if (origins != null) {
            registry.addMapping("/**")
                    // Use allowedOriginPatterns for wildcards like https://*.vercel.app
                    .allowedOriginPatterns(origins)
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600); // cache pre-flight response for 1 hour
        }
    }

    // ──────────────────────────────────────────────
    // Layer 2: Spring Security-level CORS
    // (SecurityConfig will reference this bean)
    // ──────────────────────────────────────────────
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Use setAllowedOriginPatterns instead of setAllowedOrigins
        configuration.setAllowedOriginPatterns(allowedOrigins);
        configuration.setAllowedMethods(ALLOWED_METHODS);
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
