import { redirect } from "next/navigation";

/**
 * Root page — redirects to /login.
 */
export default function HomePage() {
  redirect("/login");
}
