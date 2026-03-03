"use client";

import { useState } from "react";
import { IUserProfile } from "@/types/database";
import { Loader2, ShieldCheck, Ban } from "lucide-react";

/* ================================================================== */
/*  StaffTable                                                         */
/*  Admin user management table — uses backend API for mutations.      */
/* ================================================================== */

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

interface StaffTableProps {
  users: IUserProfile[];
  onRefresh: () => void;
}

export function StaffTable({ users, onRefresh }: StaffTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function promoteUser(id: string) {
    if (!confirm("Promote user to Admin?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`${API_URL}/api/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin" }),
      });
      if (res.ok) onRefresh();
    } catch (err) {
      console.error("Failed to promote user:", err);
    } finally {
      setActionLoading(null);
    }
  }

  async function banUser(id: string) {
    if (!confirm("Ban this user?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) onRefresh();
    } catch (err) {
      console.error("Failed to ban user:", err);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-700">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              User
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              Role
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              Joined
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50"
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full bg-slate-200"
                      src={
                        user.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "U")}`
                      }
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.fullName || "Unknown"}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => promoteUser(user.id)}
                      disabled={actionLoading === user.id}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30"
                      title="Promote to Admin"
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => banUser(user.id)}
                    disabled={actionLoading === user.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors dark:text-red-400 dark:hover:bg-red-900/30"
                    title="Ban User"
                  >
                    {actionLoading === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Ban className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
