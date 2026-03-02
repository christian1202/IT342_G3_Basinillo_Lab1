package com.it342.basinillo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

/**
 * Configures JWT decoding for Clerk-issued tokens.
 *
 * Clerk publishes its public keys at a JWKS (JSON Web Key Set) endpoint.
 * Spring Security fetches these keys automatically and uses them to
 * verify the signature on every incoming Bearer token.
 */
@Configuration
public class ClerkJwtConfig {

    @Value("${clerk.jwks-uri}")
    private String jwksUri;

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(jwksUri).build();
    }
}
