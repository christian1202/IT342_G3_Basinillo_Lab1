"use client";

import { CheckCircle, Circle } from "lucide-react";
import type { ShipmentStatus } from "@portkey/shared-types";

/* ================================================================== */
/*  StageProgress                                                      */
/*  Visual pipeline: ARRIVED → LODGED → ASSESSED → PAID → RELEASED    */
/* ================================================================== */

const STAGES: { key: ShipmentStatus; label: string }[] = [
  { key: "ARRIVED", label: "Arrived" },
  { key: "LODGED", label: "Lodged" },
  { key: "ASSESSED", label: "Assessed" },
  { key: "PAID", label: "Paid" },
  { key: "RELEASED", label: "Released" },
];

const STAGE_INDEX: Record<string, number> = Object.fromEntries(
  STAGES.map((s, i) => [s.key, i]),
);

interface StageProgressProps {
  currentStatus: ShipmentStatus;
}

export default function StageProgress({
  currentStatus,
}: StageProgressProps): React.JSX.Element {
  const currentIndex = STAGE_INDEX[currentStatus] ?? -1;

  return (
    <div className="flex items-center gap-0">
      {STAGES.map((stage, i) => {
        const isComplete = i <= currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={stage.key} className="flex items-center">
            {/* Step Dot */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                  isComplete
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500"
                } ${isCurrent ? "ring-4 ring-emerald-500/20" : ""}`}
              >
                {isComplete ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isComplete
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {stage.label}
              </span>
            </div>

            {/* Connector Line */}
            {i < STAGES.length - 1 && (
              <div
                className={`mx-1 h-0.5 w-8 sm:w-12 lg:w-16 ${
                  i < currentIndex
                    ? "bg-emerald-500"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
