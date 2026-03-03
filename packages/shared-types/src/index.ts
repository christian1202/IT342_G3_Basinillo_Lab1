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
  ASSESSED = "ASSESSED",
  PAID = "PAID",
  RELEASED = "RELEASED",
}

// ── BOC Lane Assignment ────────────────────────────────────────
export enum LaneStatus {
  PENDING = "PENDING",
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
}

// ── Organization Plan Tiers ────────────────────────────────────
export enum OrgPlan {
  STARTER = "STARTER",
  PRO = "PRO",
  BUSINESS = "BUSINESS",
  ENTERPRISE = "ENTERPRISE",
}

// ── Audit Log Actions ──────────────────────────────────────────
export enum AuditAction {
  SHIPMENT_CREATED = "SHIPMENT_CREATED",
  STATUS_CHANGED = "STATUS_CHANGED",
  LANE_CHANGED = "LANE_CHANGED",
  DOCUMENT_UPLOADED = "DOCUMENT_UPLOADED",
  DOCUMENT_DELETED = "DOCUMENT_DELETED",
  ITEM_ADDED = "ITEM_ADDED",
  ITEM_EDITED = "ITEM_EDITED",
  ITEM_DELETED = "ITEM_DELETED",
}

// ── Notification Types ─────────────────────────────────────────
export enum NotificationType {
  DEMURRAGE_WARNING = "DEMURRAGE_WARNING",
  DEMURRAGE_CRITICAL = "DEMURRAGE_CRITICAL",
  STAGE_CHANGE = "STAGE_CHANGE",
}
