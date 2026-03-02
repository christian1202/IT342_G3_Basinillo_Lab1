"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api";

interface Shipment {
  id: string;
  vesselName: string;
  voyageNo: string;
  blNumber: string;
  status: string;
  arrivalDate: string;
  freeTimeDays: number;
}

export default function ShipmentsPage() {
  const { fetchApi } = useApi();

  const {
    data: shipments,
    isLoading,
    error,
  } = useQuery<Shipment[]>({
    queryKey: ["shipments"],
    queryFn: () => fetchApi("/api/shipments"),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Shipments</h2>
        <a
          href="/dashboard/shipments/new"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          New Shipment
        </a>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        {isLoading && (
          <div className="p-8 text-center text-muted-foreground animate-pulse">
            Loading shipments...
          </div>
        )}

        {error && (
          <div className="p-8 text-center text-destructive">
            Error loading shipments: {error.message}
          </div>
        )}

        {!isLoading && !error && (!shipments || shipments.length === 0) && (
          <div className="p-8 text-center text-muted-foreground">
            No shipments found. Create your first one!
          </div>
        )}

        {!isLoading && !error && shipments && shipments.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">B/L Number</th>
                  <th className="px-4 py-3 font-medium">Vessel</th>
                  <th className="px-4 py-3 font-medium">Voyage</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Arrival</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">
                      {shipment.blNumber}
                    </td>
                    <td className="px-4 py-3">{shipment.vesselName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {shipment.voyageNo}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(shipment.arrivalDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
