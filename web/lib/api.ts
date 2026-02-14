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
    throw new Error(
      `Backend sync failed (${response.status}): ${errorBody}`
    );
  }
}
