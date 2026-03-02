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
 * Syncs the authenticated Clerk user with the Spring Boot backend.
 *
 * Sends a POST to /api/users/sync matching the backend's UserSyncDTO:
 *   { clerkId, email, fullName, avatarUrl }
 *
 * The backend upserts: creates the user if new, updates if existing.
 *
 * @param payload - The Clerk user data to sync
 * @throws Error if the backend responds with a non-OK status
 */
export async function syncClerkUser(payload: ClerkUserPayload): Promise<void> {
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
