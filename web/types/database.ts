/* ================================================================== */
/*  Database Type Definitions                                          */
/*  Mirrors the Supabase PostgreSQL schema for strict type safety.     */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  Shared Types                                                       */
/* ------------------------------------------------------------------ */

/**
 * Standardised result object returned by every service function.
 *
 * - On success: `data` holds the payload, `error` is null.
 * - On failure: `data` is null, `error` holds the message.
 *
 * This pattern lets the UI handle outcomes gracefully
 * without relying on try/catch at the component level.
 */
export interface IServiceResult<T> {
  data: T | null;
  error: string | null;
}

/* ------------------------------------------------------------------ */
/*  User Profile                                                       */
/* ------------------------------------------------------------------ */

/**
 * Mirrors the `public.profiles` table.
 * Synced from Supabase Auth on login/signup.
 */
export interface IUserProfile {
  id: string; /* UUID — matches Supabase Auth user id */
  email: string;
  full_name: string;
  role: string; /* "admin" | "broker" | "client"        */
  avatar_url: string;
  created_at?: string; /* ISO-8601 timestamp */
}

/* ------------------------------------------------------------------ */
/*  Shipment Status                                                    */
/* ------------------------------------------------------------------ */

/**
 * Possible lifecycle statuses for a shipment.
 * Matches the ShipmentStatus Java enum on the backend.
 */
export type ShipmentStatus =
  | "PENDING"
  | "IN_TRANSIT"
  | "ARRIVED"
  | "CUSTOMS_HOLD"
  | "RELEASED"
  | "DELIVERED";

/* ------------------------------------------------------------------ */
/*  Shipment                                                           */
/* ------------------------------------------------------------------ */

/**
 * Mirrors the `public.shipments` table.
 * Represents a single cargo consignment tracked through customs.
 */
export interface IShipment {
  id: string; /* UUID primary key                */
  user_id: string; /* FK → profiles.id               */
  bl_number: string; /* Unique Bill of Lading number   */
  vessel_name: string | null;
  container_number: string | null;
  arrival_date: string | null; /* ISO-8601 timestamp (ETA)       */
  status: ShipmentStatus;
  created_at: string; /* ISO-8601 timestamp             */
  destination_city?: string | null;
  destination_port?: string | null;
  origin_city?: string | null;
  origin_port?: string | null;
  service_fee: number; /* Brokerage revenue */
  client_name?: string | null;
}

/**
 * Fields required when creating a new shipment.
 * Omits server-generated fields (id, status, created_at).
 */
export interface ICreateShipmentPayload {
  user_id: string;
  bl_number: string;
  vessel_name?: string;
  container_number?: string;
  arrival_date?: string;
  service_fee?: number;
  client_name?: string;
}

/**
 * Fields that may be updated on an existing shipment.
 * All optional — only provided fields are written.
 */
export interface IUpdateShipmentPayload {
  vessel_name?: string;
  container_number?: string;
  arrival_date?: string;
  status?: ShipmentStatus;
  service_fee?: number;
  client_name?: string;
}

/* ------------------------------------------------------------------ */
/*  Shipment Document                                                  */
/* ------------------------------------------------------------------ */

/**
 * Mirrors the `public.shipment_documents` table.
 * Represents a file (invoice, packing list, etc.) attached to a shipment.
 */
export interface IShipmentDocument {
  id: string; /* UUID primary key                     */
  shipment_id: string; /* FK → shipments.id                   */
  document_type: string; /* e.g. "INVOICE", "PACKING_LIST"      */
  file_url: string; /* Supabase Storage URL                 */
  created_at: string; /* ISO-8601 timestamp                   */
}

/**
 * Fields required when attaching a new document to a shipment.
 */
export interface ICreateDocumentPayload {
  shipment_id: string;
  document_type: string;
  file_url: string;
}
