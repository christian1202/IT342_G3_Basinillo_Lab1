/* ================================================================== */
/*  Backend API Client                                                 */
/*  Centralised functions for calling the Spring Boot backend.         */
/* ================================================================== */

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

/* ------------------------------------------------------------------ */
/*  User Sync                                                          */
/* ------------------------------------------------------------------ */

/**
 * Shape of the Clerk user data we send to the backend.
 * Mirrors the backend's UserSyncDTO.
 */
interface ClerkUserPayload {
  clerkId: string;
  email: string;
  fullName: string;
  avatarUrl: string;
}

/**
 * Shape of the User entity returned by the backend.
 * Contains the internal database UUID that all other tables reference.
 */
export interface BackendUser {
  id: string; // Internal UUID (e.g., "550e8400-e29b-...")
  clerkId: string; // Clerk ID (e.g., "user_3ANa...")
  email: string;
  fullName: string;
  avatarUrl: string;
  role: string;
}

/**
 * Syncs the authenticated Clerk user with the Spring Boot backend.
 *
 * Returns the backend User entity, which contains the **internal UUID**.
 * This UUID is what the `shipments.user_id` column references.
 *
 * Clerk ID (string) → Backend sync → Internal UUID
 *
 * @param payload - The Clerk user data to sync
 * @returns The synced BackendUser with internal UUID
 * @throws Error if the backend responds with a non-OK status
 */
export async function syncClerkUser(
  payload: ClerkUserPayload,
): Promise<BackendUser> {
  const response = await fetch(`${BACKEND_URL}/api/users/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Backend sync failed (${response.status}): ${errorBody}`);
  }

  return response.json();
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */

/**
 * Shape of the JSON returned by GET /api/dashboard/status.
 */
export interface DashboardStatusResponse {
  status: string;
  message: string;
  timestamp: string;
}

/**
 * Fetches the dashboard status from the Spring Boot backend.
 *
 * @returns The parsed DashboardStatusResponse
 * @throws Error if the backend responds with a non-OK status
 */
export async function fetchDashboardStatus(): Promise<DashboardStatusResponse> {
  const response = await fetch(`${BACKEND_URL}/api/dashboard/status`);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Dashboard fetch failed (${response.status}): ${errorBody}`,
    );
  }

  return response.json();
}
