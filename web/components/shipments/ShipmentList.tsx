"use client";

import type { IShipment } from "@/types/database";
import ShipmentCard from "@/components/shipments/ShipmentCard";

/* ================================================================== */
/*  ShipmentList                                                       */
/*  Renders a vertical list of ShipmentCards.                          */
/*  Now supports deletion via the onDelete prop.                       */
/* ================================================================== */

interface ShipmentListProps {
  /** Array of shipments to display. */
  shipments: IShipment[];
  /** Optional click handler forwarded to each card. */
  onCardClick?: (shipment: IShipment) => void;
  /** Optional handler for deleting a shipment. */
  onDelete?: (shipment: IShipment) => void;
  /** Optional max number of items to show (e.g. 5 for a dashboard preview). */
  limit?: number;
}

export default function ShipmentList({
  shipments,
  onCardClick,
  onDelete,
  limit,
}: ShipmentListProps): React.JSX.Element {
  const visibleShipments = limit ? shipments.slice(0, limit) : shipments;

  return (
    <div className="space-y-3">
      {visibleShipments.map((shipment) => (
        <ShipmentCard
          key={shipment.id}
          shipment={shipment}
          onClick={onCardClick}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
