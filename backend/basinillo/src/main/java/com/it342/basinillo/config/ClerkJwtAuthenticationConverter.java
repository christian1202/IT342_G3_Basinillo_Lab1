package com.it342.basinillo.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;

/**
 * Converts a Clerk JWT into a Spring Security Authentication token,
 * extracting the custom 'orgRole' claim and mapping it to a Spring GrantedAuthority.
 */
@Component
public class ClerkJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(@org.springframework.lang.NonNull Jwt jwt) {
        Collection<GrantedAuthority> authorities = extractAuthorities(jwt);
        return new JwtAuthenticationToken(jwt, authorities);
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        // Look for the "orgRole" claim configured in the Clerk JWT template
        String orgRole = jwt.getClaimAsString("orgRole");

        if (orgRole == null || orgRole.isBlank()) {
            return Collections.emptyList();
        }

        // e.g., "org:admin" -> "ROLE_ADMIN"
        String mappedRole = mapClerkRoleToSpringRole(orgRole);
        return Collections.singletonList(new SimpleGrantedAuthority(mappedRole));
    }

    private String mapClerkRoleToSpringRole(String clerkRole) {
        return switch (clerkRole) {
            case "org:admin" -> "ROLE_ADMIN";
            case "org:broker" -> "ROLE_BROKER";
            case "org:client" -> "ROLE_CLIENT";
            case "org:viewer" -> "ROLE_VIEWER";
            default -> "ROLE_USER"; // Fallback
        };
    }
}
