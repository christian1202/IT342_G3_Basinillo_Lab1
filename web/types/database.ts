/* ================================================================== */
/*  Database Type Definitions                                          */
/*  Mirrors the Spring Boot backend DTOs for strict type safety.       */
/* ================================================================== */

import {
  ShipmentStatus,
  LaneStatus,
  DocumentType,
  OcrStatus,
  DemurrageUrgency,
  AuditAction,
} from "@portkey/shared-types";

// Re-export enums so consumers can import from a single location
export {
  ShipmentStatus,
  LaneStatus,
  DocumentType,
  OcrStatus,
  DemurrageUrgency,
  AuditAction,
};

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
