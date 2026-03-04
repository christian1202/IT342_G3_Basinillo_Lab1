/* ================================================================== */
/*  Database Type Definitions                                          */
/*  Mirrors the Spring Boot backend DTOs for strict type safety.       */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  Enum Types (mirrors Spring Boot entity enums)                      */
/* ------------------------------------------------------------------ */

/** 5-stage lifecycle: ARRIVED → LODGED → ASSESSED → PAID → RELEASED */
export type ShipmentStatus =
  | "ARRIVED"
  | "LODGED"
  | "ASSESSED"
  | "PAID"
  | "RELEASED";

/** BOC lane assignment */
export type LaneStatus = "PENDING" | "GREEN" | "YELLOW" | "RED";

export type DocumentType =
  | "BILL_OF_LADING"
  | "COMMERCIAL_INVOICE"
  | "PACKING_LIST"
  | "IMPORT_PERMIT"
  | "CERTIFICATE_OF_ORIGIN"
  | "OTHER";

export type OcrStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type DemurrageUrgency = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AuditAction =
  | "CREATED"
  | "UPDATED"
  | "STATUS_CHANGED"
  | "DELETED"
  | "DOCUMENT_UPLOADED";

/* ------------------------------------------------------------------ */
/*  Shared Types                                                       */
/* ------------------------------------------------------------------ */

/** Standard result wrapper for service functions. */
export interface IServiceResult<T> {
  data: T | null;
  error: string | null;
}

/* ------------------------------------------------------------------ */
/*  User Profile                                                       */
/* ------------------------------------------------------------------ */

/** Mirrors backend User entity (synced from Clerk). */
export interface IUserProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  createdAt?: string;
}

/* ------------------------------------------------------------------ */
/*  Client                                                             */
/* ------------------------------------------------------------------ */

export interface IClient {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
}

/* ------------------------------------------------------------------ */
/*  Shipment (List View — mirrors ShipmentResponse DTO)                */
/* ------------------------------------------------------------------ */

export interface IShipment {
  id: string;
  blNumber: string;
  vesselName: string;
  voyageNo?: string;
  containerNumber?: string;
  portOfDischarge?: string;
  status: ShipmentStatus;
  laneStatus: LaneStatus;
  entryNumber?: string;
  arrivalDate?: string;
  freeTimeDays?: number;
  doomsdayDate?: string;
  serviceFee?: number;
  client?: IClient;
  clientName?: string;
  itemCount: number;
  documentCount: number;
}

/* ------------------------------------------------------------------ */
/*  Shipment Detail (Full View — mirrors ShipmentDetailResponse DTO)   */
/* ------------------------------------------------------------------ */

export interface IShipmentDetail extends IShipment {
  orgId: string;
  assignedBrokerId?: string;
  createdAt: string;
  updatedAt: string;
  items: IShipmentItem[];
  documents: IShipmentDocument[];
  auditLogs: IAuditLog[];
}

/* ------------------------------------------------------------------ */
/*  Shipment Item (mirrors ShipmentItemResponse DTO)                   */
/* ------------------------------------------------------------------ */

export interface IShipmentItem {
  id: string;
  shipmentId: string;
  description: string;
  quantity?: number;
  unit?: string;
  unitValue?: number;
  currency: string;
  hsCode?: string;
  dutyRate?: number;
  vatRate?: number;
  estimatedDuty?: number;
  aiConfidenceScore?: number;
  isVerified: boolean;
}

/* ------------------------------------------------------------------ */
/*  Shipment Document (mirrors DocumentResponse DTO)                   */
/* ------------------------------------------------------------------ */

export interface IShipmentDocument {
  id: string;
  shipmentId: string;
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedBy?: string;
  ocrStatus: OcrStatus;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  Audit Log (mirrors AuditLogResponse DTO)                           */
/* ------------------------------------------------------------------ */

export interface IAuditLog {
  id: string;
  shipmentId: string;
  userId: string;
  action: AuditAction;
  entityType: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

/* ------------------------------------------------------------------ */
/*  Demurrage Status (mirrors DemurrageStatusResponse DTO)             */
/* ------------------------------------------------------------------ */

export interface IDemurrageStatus {
  daysRemaining: number;
  urgency: DemurrageUrgency;
  estimatedCost: number;
}

/* ------------------------------------------------------------------ */
/*  Request Payloads                                                   */
/* ------------------------------------------------------------------ */

/** Payload for POST /api/shipments. */
export interface ICreateShipmentPayload {
  brokerId: string;
  clientId?: string;
  blNumber: string;
  vesselName: string;
  voyageNo?: string;
  containerNumber?: string;
  portOfDischarge?: string;
  arrivalDate?: string;
  freeTimeDays?: number;
  serviceFee?: number;
  clientName?: string;
}

/** Payload for PUT /api/shipments/:id. */
export interface IUpdateShipmentPayload extends ICreateShipmentPayload {}

/** Payload for POST /api/shipments/:id/items. */
export interface ICreateShipmentItemPayload {
  description: string;
  quantity?: number;
  unit?: string;
  unitValue?: number;
  currency?: string;
  hsCode?: string;
  dutyRate?: number;
  vatRate?: number;
}
