import { DollarSign, Package, Clock, Users, LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: "blue" | "green" | "orange" | "purple";
}

function KPICard({ title, value, icon: Icon, color }: KPICardProps) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}

interface KPIGridProps {
  totalRevenue: number;
  activeShipments: number;
  delayedShipments: number;
  totalClients: number;
}

export function KPICards({
  totalRevenue,
  activeShipments,
  delayedShipments,
  totalClients,
}: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        title="Brokerage Revenue"
        value={`₱${totalRevenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        icon={DollarSign}
        color="green"
      />
      <KPICard
        title="Active Shipments"
        value={activeShipments}
        icon={Package}
        color="blue"
      />
      <KPICard
        title="Delayed Cargo"
        value={delayedShipments}
        icon={Clock}
        color="orange"
      />
      <KPICard
        title="Clients Served"
        value={totalClients}
        icon={Users}
        color="purple"
      />
    </div>
  );
}
