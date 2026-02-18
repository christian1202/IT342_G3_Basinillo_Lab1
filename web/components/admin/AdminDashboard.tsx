"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  Truck,
  Users,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface Shipment {
  id: string;
  bl_number: string;
  client_name: string;
  service_fee: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching shipments:", error);
      } else {
        setShipments(data || []);
      }
      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  // --- KPI Calculations ---
  const totalRevenue = shipments.reduce(
    (sum, s) => sum + (Number(s.service_fee) || 0),
    0,
  );
  const activeShipments = shipments.filter(
    (s) => s.status === "IN_TRANSIT",
  ).length;
  const uniqueClients = new Set(shipments.map((s) => s.client_name)).size;

  // --- Chart Data Preparation ---
  // Group revenue by date (YYYY-MM-DD)
  const revenueByDate = shipments.reduce(
    (acc, s) => {
      const date = new Date(s.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[date] = (acc[date] || 0) + (Number(s.service_fee) || 0);
      return acc;
    },
    {} as Record<string, number>,
  );

  // Convert to array and sort by date (simple sort for now, assuming last 30 days)
  const chartData = Object.entries(revenueByDate)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // --- Recent Operations (Last 5) ---
  const recentShipments = shipments.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
            <CheckCircle className="h-3 w-3" /> Delivered
          </span>
        );
      case "PENDING":
        return (
          <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
      case "DELAYED":
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
            <AlertCircle className="h-3 w-3" /> Delayed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
            <XCircle className="h-3 w-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
            <Truck className="h-3 w-3" /> {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Command Center</h1>
          <p className="text-gray-500">Real-time logistics analytics</p>
        </div>
        <div className="rounded-lg bg-white p-2 shadow-sm">
          <span className="text-sm font-medium text-gray-500">
            Last Updated:
          </span>{" "}
          <span className="font-bold text-gray-900">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">
                ₱
                {totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-2 text-xs text-green-600 flex items-center">
            +12.5% from last month
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Shipments
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {activeShipments}
              </h3>
            </div>
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Truck className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-2 text-xs text-blue-600">Updates every 5 mins</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Clients</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {uniqueClients}
              </h3>
            </div>
            <div className="rounded-full bg-purple-100 p-3 text-purple-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-2 text-xs text-purple-600">4 new this week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="mb-6 text-lg font-bold text-gray-900">
            Revenue Trend
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(value) => `₱${value / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "#f3f4f6" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [
                    `₱${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Bar
                  dataKey="amount"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Operations Table */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="mb-6 text-lg font-bold text-gray-900">
            Recent Operations
          </h3>
          <div className="overflow-hidden">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-4 py-3">Shipment</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {shipment.bl_number || "No BL Info"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {shipment.client_name || "Unknown Client"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(shipment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            View All Shipments
          </button>
        </div>
      </div>
    </div>
  );
}
