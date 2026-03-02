import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

export const useApi = () => {
  const { getToken } = useAuth();

  const fetchApi = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const token = await getToken();
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const url = `${baseUrl}${endpoint}`;

      const headers = new Headers(options.headers);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      // Default to JSON unless explicitly overridden
      if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `API request failed with status ${response.status}`,
        );
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      return response.json();
    },
    [getToken],
  );

  return { fetchApi };
};
