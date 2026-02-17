"use client";

import { useState } from "react";
import { IUserProfile } from "@/types/database";
import { createClient } from "@/lib/supabase";
import { Loader2, ShieldCheck, Ban } from "lucide-react";

interface StaffTableProps {
  users: IUserProfile[];
  onRefresh: () => void;
}

export function StaffTable({ users, onRefresh }: StaffTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const supabase = createClient();

  async function promoteUser(id: string) {
    if (!confirm("Promote user to Admin?")) return;
    setActionLoading(id);
    const { error } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", id);
    setActionLoading(null);
    if (!error) onRefresh();
  }

  async function banUser(id: string) {
    if (!confirm("Ban this user?")) return;
    setActionLoading(id);
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    setActionLoading(null);
    if (!error) onRefresh();
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Joined
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full bg-slate-200"
                      src={
                        user.avatar_url ||
                        `https://ui-avatars.com/api/?name=${user.full_name}`
                      }
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-slate-900">
                      {user.full_name || "Unknown"}
                    </div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
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
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
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
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
              <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
