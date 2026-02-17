import {
  LucideIcon,
  LayoutDashboard,
  Ship,
  Activity,
  Settings,
} from "lucide-react";

/* ================================================================== */
/*  Navigation Configuration                                           */
/*  Single source of truth for all sidebar links.                      */
/*  Add / remove / reorder items here — the Sidebar renders from this. */
/* ================================================================== */

export interface NavItem {
  /** Display label shown in the sidebar. */
  label: string;
  /** Route path (must match an app directory route). */
  href: string;
  /** Lucide icon component rendered beside the label. */
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Shipments", href: "/shipments", icon: Ship },
  { label: "Shipment Analysis", href: "/analytics", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];
