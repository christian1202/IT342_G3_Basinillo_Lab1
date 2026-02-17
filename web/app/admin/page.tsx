"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { IUserProfile, IShipment } from "@/types/database";
import {
  Trash2,
  ShieldCheck,
  Ban,
  Search,
  Loader2,
  MoreHorizontal,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "users";
  const supabase = createClient();

  const [users, setUsers] = useState<IUserProfile[]>([]);
  const [shipments, setShipments] = useState<IShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [tab]);

  async function fetchData() {
    setLoading(true);
    if (tab === "users") {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false } as any); // created_at might not exist on type yet, but usually does in DB
      if (data) setUsers(data as any); // Cast for safety if types drift
    } else {
      const { data, error } = await supabase
        .from("shipments")
        .select("*, profiles(email)")
        .order("created_at", { ascending: false });
      if (data) setShipments(data as any);
    }
    setLoading(false);
  }

  /* ------------------------------------------------------------------ */
  /*  USER ACTIONS                                                       */
  /* ------------------------------------------------------------------ */

  async function promoteUser(id: string) {
    if (!confirm("Are you sure you want to promote this user to Admin?"))
      return;
    setActionLoading(id);
    const { error } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", id);
    setActionLoading(null);
    if (!error) fetchData();
    else alert("Failed to promote user: " + error.message);
  }

  async function banUser(id: string) {
    if (
      !confirm(
        "Are you sure you want to BAN this user? This will delete their profile.",
      )
    )
      return;
    setActionLoading(id);
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    setActionLoading(null);
    if (!error) fetchData();
    else alert("Failed to ban user: " + error.message);
  }

  /* ------------------------------------------------------------------ */
  /*  SHIPMENT ACTIONS                                                   */
  /* ------------------------------------------------------------------ */

  async function deleteShipment(id: string) {
    if (
      !confirm(
        "Are you sure you want to FORCE DELETE this shipment? This cannot be undone.",
      )
    )
      return;
    setActionLoading(id);
    const { error } = await supabase.from("shipments").delete().eq("id", id);
    setActionLoading(null);
    if (!error) fetchData();
    else alert("Failed to delete shipment: " + error.message);
  }

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                            */
  /* ------------------------------------------------------------------ */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <Loader2 className="animate-spin h-8 w-8 mr-2" />
        Loading admin data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          {tab === "users" ? "User Management" : "Master Shipment List"}
        </h2>
        <div className="flex gap-2">
          {/* Refresh Button */}
          <button
            onClick={fetchData}
            className="px-3 py-2 bg-white border border-slate-300 rounded text-sm hover:bg-slate-50 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {tab === "users" ? (
        /* USERS TABLE */
        <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                  Joined
                </th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full bg-slate-200"
                          src={
                            user.avatar_url ||
                            `https://ui-avatars.com/api/?name=${user.full_name || user.email}`
                          }
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          {user.full_name || "No Name"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {user.role !== "admin" && (
                        <button
                          onClick={() => promoteUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm"
                        >
                          {actionLoading === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ShieldCheck className="h-4 w-4 mr-1" />
                          )}
                          Promote
                        </button>
                      )}
                      <button
                        onClick={() => banUser(user.id)}
                        disabled={actionLoading === user.id}
                        className="flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-sm"
                      >
                        {actionLoading === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Ban className="h-4 w-4 mr-1" />
                        )}
                        Ban
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* SHIPMENTS TABLE */
        <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                  BL Number
                </th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                  Owner
                </th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shipments.map((shipment: any) => (
                <tr key={shipment.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">
                      {shipment.bl_number}
                    </div>
                    <div className="text-xs text-slate-500">
                      {shipment.vessel_name || "No Vessel"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {shipment.profiles?.email || shipment.user_id}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-slate-100 text-slate-800">
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteShipment(shipment.id)}
                      disabled={actionLoading === shipment.id}
                      className="flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-sm"
                    >
                      {actionLoading === shipment.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Force Delete
                    </button>
                  </td>
                </tr>
              ))}
              {shipments.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No shipments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
