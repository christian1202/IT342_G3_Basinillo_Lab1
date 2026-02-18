"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Anchor, LogOut, X, LayoutDashboard } from "lucide-react";

import { NAV_ITEMS } from "@/config/navigation";

/* ================================================================== */
/*  Sidebar                                                            */
/*  Renders the PortKey brand mark, navigation links, and a logout     */
/*  button. Active link is highlighted based on the current pathname.  */
/*                                                                     */
/*  Used in two modes:                                                 */
/*    1. Desktop — always visible (static sidebar).                    */
/*    2. Mobile  — rendered inside a slide-over drawer.                */
/* ================================================================== */

interface SidebarProps {
  /** Callback for the logout action. */
  onLogout: () => void;
  /** If true, renders a close (X) button for mobile drawer mode. */
  isMobile?: boolean;
  /** Closes the mobile drawer when called. */
  onClose?: () => void;
  /** If true, shows admin-specific navigation items. */
  isAdmin?: boolean;
}

export default function Sidebar({
  onLogout,
  isMobile = false,
  onClose,
  isAdmin = false,
}: SidebarProps): React.JSX.Element {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col bg-white dark:bg-slate-900">
      {/* ============================================================ */}
      {/*  Brand + Mobile Close                                         */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between px-5 py-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5"
          onClick={onClose}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30">
            <Anchor className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            PortKey
          </span>
        </Link>

        {isMobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* ============================================================ */}
      {/*  Navigation Links                                              */}
      {/* ============================================================ */}
      <nav className="flex-1 space-y-1 px-3">
        {isAdmin && (
          <Link
            href="/admin"
            onClick={onClose}
            className={`
                flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors mb-4
                bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 dark:shadow-none
              `}
          >
            <LayoutDashboard className="h-4.5 w-4.5 shrink-0 text-white" />
            Command Center
          </Link>
        )}

        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`
                flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                }
              `}
            >
              <Icon
                className={`h-4.5 w-4.5 shrink-0 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ============================================================ */}
      {/*  Logout                                                        */}
      {/* ============================================================ */}
      <div className="border-t border-slate-200 px-3 py-4 dark:border-slate-800">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
