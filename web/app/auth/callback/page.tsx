import { redirect } from "next/navigation";

/**
 * Legacy OAuth callback route.
 *
 * Clerk handles OAuth callbacks internally — this page is no longer needed.
 * Kept as a redirect so any bookmarked/cached URLs still work.
 */
export default function AuthCallbackPage() {
  redirect("/dashboard");
}
