"use client";

import { useEffect, useState, useCallback } from "react";
import { IUserProfile, IShipment } from "@/types/database";
import { fetchShipments } from "@/services/shipmentService";

/* ================================================================== */
/*  useAdminData                                                       */
/*  Fetches admin-level data (users + shipments) from the backend.     */
/* ================================================================== */

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

interface AdminDataPayload {
  users: IUserProfile[];
  shipments: IShipment[];
  metrics: {
    totalRevenue: number;
    activeShipments: number;
    demurrageRisk: number;
    uniqueClients: number;
  };
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useAdminData(): AdminDataPayload {
  const [users, setUsers] = useState<IUserProfile[]>([]);
  const [shipments, setShipments] = useState<IShipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      /* Fetch users from backend */
      const userRes = await fetch(`${API_URL}/api/users`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setUsers(userData as IUserProfile[]);
      }

      /* Fetch shipments from backend */
      const shipResult = await fetchShipments();
      if (!shipResult.error && shipResult.data) {
        setShipments(shipResult.data);
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* Derived metrics */
  const metrics = {
    totalRevenue: shipments.reduce(
      (sum, s) => sum + (Number(s.serviceFee) || 0),
      0,
    ),
    activeShipments: shipments.filter((s) =>
      ["ARRIVED", "LODGED", "ASSESSED", "PAID"].includes(s.status),
    ).length,
    demurrageRisk: shipments.filter((s) => {
      if (!s.doomsdayDate || s.status === "RELEASED") return false;
      const days = Math.ceil(
        (new Date(s.doomsdayDate).getTime() - Date.now()) / 86_400_000,
      );
      return days <= 3;
    }).length,
    uniqueClients: new Set(shipments.map((s) => s.clientName).filter(Boolean))
      .size,
  };

  return { users, shipments, metrics, loading, refresh: fetchData };
}
