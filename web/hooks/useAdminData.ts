"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { IUserProfile, IShipment } from "@/types/database";

/* ================================================================== */
/*  useAdminData                                                       */
/*  Fetches admin-level data (users + shipments) from NeonDB.          */
/*  Auth is handled by Clerk middleware — this hook is data-only.      */
/* ================================================================== */

interface AdminDataPayload {
  users: IUserProfile[];
  shipments: IShipment[];
  metrics: {
    totalRevenue: number;
    activeShipments: number;
    delayedShipments: number;
    uniqueClients: number;
    chartData: { date: string; revenue: number }[];
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
      const [userResponse, shipmentResponse] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false } as any),
        supabase.from("shipments").select("*"),
      ]);

      if (userResponse.data) setUsers(userResponse.data as IUserProfile[]);
      if (shipmentResponse.data)
        setShipments(shipmentResponse.data as IShipment[]);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---- Derived Metrics (Business Logic) ---- */
  const metrics = {
    totalRevenue: shipments.reduce(
      (sum, s) => sum + (Number(s.service_fee) || 0),
      0,
    ),

    activeShipments: shipments.filter(
      (s) => s.status === "IN_TRANSIT" || s.status === "PENDING",
    ).length,

    delayedShipments: shipments.filter((s) => {
      if (s.status === "DELIVERED") return false;
      const created = new Date(s.created_at);
      const now = new Date();
      const diffDays = Math.ceil(
        Math.abs(now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
      );
      return diffDays > 30;
    }).length,

    uniqueClients: new Set(shipments.map((s) => s.client_name).filter(Boolean))
      .size,

    chartData: Object.entries(
      shipments.reduce(
        (acc, curr) => {
          const date = new Date(curr.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          acc[date] = (acc[date] || 0) + (curr.service_fee || 0);
          return acc;
        },
        {} as Record<string, number>,
      ),
    )
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  };

  return { users, shipments, metrics, loading, refresh: fetchData };
}
