/**
 * PortKey — Shared Type Definitions
 *
 * These enums are the single source of truth for status values
 * used across the Next.js frontend and Spring Boot backend.
 */

// ── Shipment Lifecycle Stages ──────────────────────────────────
export enum ShipmentStatus {
  ARRIVED = "ARRIVED",
  LODGED = "LODGED",
  UNDER_ASSESSMENT = "UNDER_ASSESSMENT",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  RELEASED = "RELEASED",
}

// ── BOC Lane Assignment ────────────────────────────────────────
export enum LaneStatus {
  NONE = "NONE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  RED = "RED",
}

// ── User Roles (mirrors Clerk org roles) ───────────────────────
export enum UserRole {
  ADMIN = "ADMIN",
  BROKER = "BROKER",
  VIEWER = "VIEWER",
  CLIENT = "CLIENT",
}

// ── Document Types (Golden Documents + extras) ─────────────────
export enum DocumentType {
  BILL_OF_LADING = "BILL_OF_LADING",
  COMMERCIAL_INVOICE = "COMMERCIAL_INVOICE",
  PACKING_LIST = "PACKING_LIST",
  PERMIT = "PERMIT",
  CERTIFICATE_OF_ORIGIN = "CERTIFICATE_OF_ORIGIN",
  OTHER = "OTHER",
}

// ── OCR Processing Status ──────────────────────────────────────
export enum OcrStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

// ── Demurrage Urgency Levels ───────────────────────────────────
export enum DemurrageUrgency {
  SAFE = "SAFE",
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
  OVERDUE = "OVERDUE",
}

// ── Organization Plan Tiers ────────────────────────────────────
export enum OrgPlan {
  STARTER = "STARTER",
  PRO = "PRO",
  BUSINESS = "BUSINESS",
  ENTERPRISE = "ENTERPRISE",
}
