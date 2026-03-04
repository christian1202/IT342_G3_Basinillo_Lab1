"use client";

import { useMemo } from "react";
import Image from "next/image";
import { AlertTriangle, Clock, ArrowRight, Flame } from "lucide-react";
import type { IShipment } from "@/types/database";

/* ================================================================== */
/*  DESIGN TOKENS                                                      */
/* ================================================================== */

const CARD_BG = "#131B2E";
const CARD_BORDER = "#1F2937";

/* ================================================================== */
/*  DemurrageWatch                                                     */
/*  Shows the most urgent at-risk shipments with free-time countdown.  */
/*  Layout: image on left, details on right, timer bar at bottom.      */
/* ================================================================== */

/** Fallback port images */
const PORT_IMAGES = ["/cargo-ship.png", "/warehouse.png"];

/** Compute days/hours/minutes/seconds remaining until doomsday. */
function getTimeRemaining(doomsdayDate: string) {
  const diff = new Date(doomsdayDate).getTime() - Date.now();
  if (diff <= 0)
    return { overdue: true, days: 0, hours: 0, minutes: 0, seconds: 0 };

  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);

  return { overdue: false, days: 0, hours, minutes, seconds };
}

/** Determine severity label + badge styles. */
function getSeverity(doomsdayDate: string) {
  const diff = new Date(doomsdayDate).getTime() - Date.now();
  const daysLeft = diff / 86_400_000;

  if (daysLeft <= 0)
    return {
      label: "Overdue Risk",
      badgeBg: "bg-red-500/20",
      badgeText: "text-red-400",
      badgeBorder: "border-red-500/30",
      timerColor: "text-orange-500",
      buttonLabel: "Expedite",
      buttonStyle:
        "bg-orange-500 hover:bg-orange-400 text-white border-orange-500",
    };
  if (daysLeft <= 3)
    return {
      label: "Warning",
      badgeBg: "bg-amber-500/20",
      badgeText: "text-amber-400",
      badgeBorder: "border-amber-500/30",
      timerColor: "text-white",
      buttonLabel: "Review",
      buttonStyle:
        "bg-transparent hover:bg-white/5 text-white border-slate-600",
    };
  return {
    label: "On Track",
    badgeBg: "bg-emerald-500/20",
    badgeText: "text-emerald-400",
    badgeBorder: "border-emerald-500/30",
    timerColor: "text-white",
    buttonLabel: "Review",
    buttonStyle: "bg-transparent hover:bg-white/5 text-white border-slate-600",
  };
}

/* ------------------------------------------------------------------ */
/*  Watch Card — Horizontal layout with image                          */
/* ------------------------------------------------------------------ */

interface WatchCardProps {
  shipment: IShipment;
  imageIndex: number;
  onAction?: (shipment: IShipment) => void;
}

function WatchCard({ shipment, imageIndex, onAction }: WatchCardProps) {
  const time = getTimeRemaining(shipment.doomsdayDate!);
  const severity = getSeverity(shipment.doomsdayDate!);
  const imageSrc = PORT_IMAGES[imageIndex % PORT_IMAGES.length];

  const portCode = shipment.portOfDischarge
    ? shipment.portOfDischarge
        .replace(/\s+/g, "-")
        .substring(0, 9)
        .toUpperCase()
    : "PORT";

  return (
    <article
      className="flex overflow-hidden rounded-2xl border"
      style={{ backgroundColor: CARD_BG, borderColor: CARD_BORDER }}
    >
      {/* Image Section */}
      <div className="relative hidden w-[220px] shrink-0 sm:block">
        <Image
          src={imageSrc}
          alt={`Port ${portCode}`}
          fill
          className="object-cover"
          sizes="220px"
        />
        {/* Port badge overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
            {portCode}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-4">
        {/* Top row: severity badge + shipment ID */}
        <div>
          <div className="flex items-center gap-2.5">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${severity.badgeBg} ${severity.badgeText} ${severity.badgeBorder}`}
            >
              {severity.label}
            </span>
            <span className="font-mono text-xs text-slate-500">
              {shipment.blNumber}
            </span>
          </div>

          {/* Description */}
          <h3 className="mt-2 text-sm font-bold text-white">
            {shipment.clientName || "Cargo Shipment"}
          </h3>
          <p className="text-xs text-slate-400">
            Arrival: {shipment.portOfDischarge || "—"}
          </p>
        </div>

        {/* Timer bar */}
        <div
          className="mt-3 flex items-center justify-between rounded-xl px-3 py-2"
          style={{ backgroundColor: "#0D1221" }}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Free Time Remaining
            </span>
          </div>
          <div className="flex items-center gap-2">
            {time.overdue ? (
              <span className="text-sm font-bold text-red-500">OVERDUE</span>
            ) : (
              <span
                className={`font-mono text-sm font-bold ${severity.timerColor}`}
              >
                {String(time.hours).padStart(2, "0")}h :{" "}
                {String(time.minutes).padStart(2, "0")}m :{" "}
                {String(time.seconds).padStart(2, "0")}s
              </span>
            )}

            {onAction && (
              <button
                type="button"
                onClick={() => onAction(shipment)}
                className={`ml-2 rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${severity.buttonStyle}`}
              >
                {severity.buttonLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ================================================================== */
/*  DemurrageWatch (Main Export)                                        */
/* ================================================================== */

interface DemurrageWatchProps {
  shipments: IShipment[];
  isLoading: boolean;
  onViewAll?: () => void;
  onAction?: (shipment: IShipment) => void;
}

export default function DemurrageWatch({
  shipments,
  isLoading,
  onViewAll,
  onAction,
}: DemurrageWatchProps): React.JSX.Element | null {
  /** Filter to at-risk shipments (has doomsday, not released, ≤7 days). */
  const atRiskShipments = useMemo(() => {
    return shipments
      .filter((s) => {
        if (!s.doomsdayDate || s.status === "RELEASED") return false;
        const days =
          (new Date(s.doomsdayDate).getTime() - Date.now()) / 86_400_000;
        return days <= 7;
      })
      .sort(
        (a, b) =>
          new Date(a.doomsdayDate!).getTime() -
          new Date(b.doomsdayDate!).getTime(),
      )
      .slice(0, 2);
  }, [shipments]);

  if (isLoading) {
    return (
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold text-white">Demurrage Watch</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl border"
              style={{ backgroundColor: CARD_BG, borderColor: CARD_BORDER }}
            />
          ))}
        </div>
      </section>
    );
  }

  if (atRiskShipments.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold text-white">Demurrage Watch</h2>
        </div>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
          >
            View all risks
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {atRiskShipments.map((s, idx) => (
          <WatchCard
            key={s.id}
            shipment={s}
            imageIndex={idx}
            onAction={onAction}
          />
        ))}
      </div>
    </section>
  );
}
