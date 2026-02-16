import { Session } from "@supabase/supabase-js";

const BACKEND_URL = "http://localhost:8080";

/**
 * Syncs the authenticated Supabase user with the Spring Boot backend.
 *
 * Sends a POST to /api/users/sync with the user's UUID, email, full name,
 * and avatar URL — matching the backend's UserSyncDTO shape.
 *
 * @param session - The active Supabase auth session
 * @throws Error if the backend responds with a non-OK status
 */
export async function syncUserWithBackend(session: Session): Promise<void> {
  const { user } = session;

  const payload = {
    uuid: user.id,
    email: user.email ?? "",
    fullName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? "",
    avatarUrl: user.user_metadata?.avatar_url ?? "",
  };

  const response = await fetch(`${BACKEND_URL}/api/users/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
 * Calls GET /api/dashboard/status to verify the backend connection
 * and retrieve a simple status payload for the Dashboard page.
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
