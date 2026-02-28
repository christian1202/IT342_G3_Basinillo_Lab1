package com.it342.basinillo.entity;

/**
 * User roles within a PortKey organization.
 *
 * Maps directly to Clerk organization roles:
 *   ADMIN   — Full access: manage users, shipments, billing, settings.
 *   BROKER  — Create and manage assigned shipments, upload docs, use AI tools.
 *   VIEWER  — Read-only access to all org shipments (management/oversight).
 *   CLIENT  — Read-only access to own shipments only via Client Portal.
 */
public enum UserRole {
    ADMIN,
    BROKER,
    VIEWER,
    CLIENT
}
