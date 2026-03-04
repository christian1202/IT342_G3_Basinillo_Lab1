"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Anchor,
  LogOut,
  X,
  Plus,
  LayoutDashboard,
  Settings as SettingsIcon,
} from "lucide-react";

import { NAV_ITEMS } from "@/config/navigation";

/* ================================================================== */
/*  Sidebar                                                            */
/*  PortKey brand, navigation, "New Shipment" CTA, and user profile.   */
/*  Design tokens: bg = #0D1221, active = #3B82F6                     */
/* ================================================================== */

interface SidebarProps {
  onLogout: () => void;
  isMobile?: boolean;
  onClose?: () => void;
  isAdmin?: boolean;
  userName?: string;
  userRole?: string;
}

export default function Sidebar({
  onLogout,
  isMobile = false,
  onClose,
  isAdmin = false,
  userName = "Alex Morgan",
  userRole = "Logistics Manager",
}: SidebarProps): React.JSX.Element {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-full flex-col"
      style={{ backgroundColor: "#0D1221" }}
    >
      {/* ============================================================ */}
      {/*  Brand                                                       */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
          onClick={onClose}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
            <Anchor className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="block text-base font-bold text-white">
              PortKey
            </span>
            <span className="block text-[11px] text-slate-500">
              Customs Dashboard
            </span>
          </div>
        </Link>

        {isMobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* ============================================================ */}
      {/*  Navigation Links                                             */}
      {/* ============================================================ */}
      <nav className="mt-6 flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`
                flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-white" : "text-slate-500"}`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ============================================================ */}
      {/*  New Shipment CTA                                             */}
      {/* ============================================================ */}
      <div className="px-3 pb-3">
        <Link
          href="/shipments"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          New Shipment
        </Link>
      </div>

      {/* ============================================================ */}
      {/*  User Profile                                                 */}
      {/* ============================================================ */}
      <div className="border-t border-white/5 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {userName}
            </p>
            <p className="truncate text-xs text-slate-500">{userRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
