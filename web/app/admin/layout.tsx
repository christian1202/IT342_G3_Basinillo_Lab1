import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Package,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[],
        ) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-red-500" />
          <span className="text-xl font-bold tracking-wider">ADMIN MODE</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg text-white hover:bg-slate-700 transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase mt-4">
            Management
          </div>
          <Link
            href="/admin?tab=users"
            className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <Users className="h-5 w-5" />
            Users
          </Link>
          <Link
            href="/admin?tab=shipments"
            className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <Package className="h-5 w-5" />
            Shipments
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Exit Admin Mode
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm h-16 flex items-center px-8 justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            System Administration
          </h1>
          <div className="text-sm text-gray-500">
            Logged in as:{" "}
            <span className="font-medium text-gray-800">{user.email}</span>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
