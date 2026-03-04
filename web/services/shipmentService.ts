import type {
  IShipment,
  IShipmentDetail,
  ICreateShipmentPayload,
  IUpdateShipmentPayload,
  IDemurrageStatus,
  IServiceResult,
  ShipmentStatus,
  LaneStatus,
} from "@/types/database";

/* ================================================================== */
/*  Shipment Service                                                   */
/*  All calls go through the Spring Boot backend REST API.             */
/* ================================================================== */

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

/**
 * Helper to make authenticated API calls.
 * Wraps fetch with standard error handling → IServiceResult.
 * Includes the Clerk JWT as a Bearer token when provided.
 */
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<IServiceResult<T>> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        data: null,
        error:
          errorData.message || errorData.error || `Error: ${response.status}`,
      };
    }

    // Handle 204 No Content (e.g., DELETE)
    if (response.status === 204) {
      return { data: null as unknown as T, error: null };
    }

    const data = await response.json();
    return { data: data as T, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/* ------------------------------------------------------------------ */
/*  CREATE                                                             */
/* ------------------------------------------------------------------ */

export async function createShipment(
  payload: ICreateShipmentPayload,
  token?: string | null,
): Promise<IServiceResult<IShipment>> {
  return apiFetch<IShipment>(
    "/api/shipments",
    { method: "POST", body: JSON.stringify(payload) },
    token,
  );
}

/* ------------------------------------------------------------------ */
/*  READ — List (with optional filters)                                */
/* ------------------------------------------------------------------ */

export interface ShipmentFilters {
  status?: ShipmentStatus;
  laneStatus?: LaneStatus;
  assignedBrokerId?: string;
  clientId?: string;
  arrivalDateFrom?: string;
  arrivalDateTo?: string;
}

export async function fetchShipments(
  filters?: ShipmentFilters,
  token?: string | null,
): Promise<IServiceResult<IShipment[]>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<IShipment[]>(`/api/shipments${query}`, {}, token);
}

/* ------------------------------------------------------------------ */
/*  READ — Single by ID (full detail)                                  */
/* ------------------------------------------------------------------ */

export async function fetchShipmentById(
  shipmentId: string,
  token?: string | null,
): Promise<IServiceResult<IShipmentDetail>> {
  return apiFetch<IShipmentDetail>(`/api/shipments/${shipmentId}`, {}, token);
}

/* ------------------------------------------------------------------ */
/*  UPDATE                                                             */
/* ------------------------------------------------------------------ */

export async function updateShipment(
  shipmentId: string,
  payload: IUpdateShipmentPayload,
  token?: string | null,
): Promise<IServiceResult<IShipment>> {
  return apiFetch<IShipment>(
    `/api/shipments/${shipmentId}`,
    { method: "PUT", body: JSON.stringify(payload) },
    token,
  );
}

/* ------------------------------------------------------------------ */
/*  STATUS UPDATE                                                      */
/* ------------------------------------------------------------------ */

export async function updateShipmentStatus(
  shipmentId: string,
  status: ShipmentStatus,
  token?: string | null,
): Promise<IServiceResult<IShipment>> {
  return apiFetch<IShipment>(
    `/api/shipments/${shipmentId}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) },
    token,
  );
}

/* ------------------------------------------------------------------ */
/*  LANE STATUS UPDATE                                                 */
/* ------------------------------------------------------------------ */

export async function updateShipmentLane(
  shipmentId: string,
  laneStatus: LaneStatus,
  token?: string | null,
): Promise<IServiceResult<IShipment>> {
  return apiFetch<IShipment>(
    `/api/shipments/${shipmentId}/lane`,
    { method: "PATCH", body: JSON.stringify({ laneStatus }) },
    token,
  );
}

/* ------------------------------------------------------------------ */
/*  DELETE (soft delete)                                                */
/* ------------------------------------------------------------------ */

export async function deleteShipment(
  shipmentId: string,
  token?: string | null,
): Promise<IServiceResult<boolean>> {
  const result = await apiFetch<void>(
    `/api/shipments/${shipmentId}`,
    { method: "DELETE" },
    token,
  );
  if (result.error) return { data: null, error: result.error };
  return { data: true, error: null };
}

/* ------------------------------------------------------------------ */
/*  DEMURRAGE STATUS                                                   */
/* ------------------------------------------------------------------ */

export async function fetchDemurrageStatus(
  shipmentId: string,
  token?: string | null,
): Promise<IServiceResult<IDemurrageStatus>> {
  return apiFetch<IDemurrageStatus>(
    `/api/shipments/${shipmentId}/demurrage-status`,
    {},
    token,
  );
}
