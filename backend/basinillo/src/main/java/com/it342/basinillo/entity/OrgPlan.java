package com.it342.basinillo.entity;

/**
 * Subscription plan tiers for a PortKey organization.
 *
 *   STARTER    — Free: 10 active shipments, 1 broker, no AI.
 *   PRO        — ₱2,500/mo: unlimited shipments, 5 users, 100 AI uses/mo.
 *   BUSINESS   — ₱6,000/mo: unlimited shipments, 15 users, unlimited AI.
 *   ENTERPRISE — Custom pricing: unlimited everything + API access + SLA.
 */
public enum OrgPlan {
    STARTER,
    PRO,
    BUSINESS,
    ENTERPRISE
}
