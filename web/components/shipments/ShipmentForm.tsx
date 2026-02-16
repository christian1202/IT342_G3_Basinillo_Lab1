"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ship, Tag, Navigation, Package, Calendar } from "lucide-react";

import { createShipment } from "@/services/shipmentService";
import type { ShipmentStatus } from "@/types/database";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

/* ================================================================== */
/*  Zod Schema                                                         */
/*  Defines validation rules that mirror database constraints.         */
/*  Extracted OUTSIDE the component for DRY and reusability.           */
/* ================================================================== */

const shipmentSchema = z.object({
  bl_number: z
    .string()
    .min(1, "Bill of Lading number is required.")
    .max(50, "BL number must be 50 characters or fewer."),

  vessel_name: z
    .string()
    .max(150, "Vessel name must be 150 characters or fewer.")
    .optional()
    .or(z.literal("")),

  container_number: z
    .string()
    .max(50, "Container number must be 50 characters or fewer.")
    .optional()
    .or(z.literal("")),

  arrival_date: z.string().optional().or(z.literal("")),
});

/** Inferred TypeScript type from the Zod schema — single source of truth. */
type ShipmentFormValues = z.infer<typeof shipmentSchema>;

/* ================================================================== */
/*  STATUS OPTIONS                                                     */
/*  Extracted as a constant (DRY) for the status select dropdown.      */
/* ================================================================== */

const STATUS_OPTIONS: { value: ShipmentStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_TRANSIT", label: "In Transit" },
  { value: "ARRIVED", label: "Arrived" },
  { value: "CUSTOMS_HOLD", label: "Customs Hold" },
  { value: "RELEASED", label: "Released" },
  { value: "DELIVERED", label: "Delivered" },
];

/* ================================================================== */
/*  SelectGroup — Reusable Label + Select + Error sub-component        */
/*  Eliminates repeated markup for select fields.                      */
/* ================================================================== */

interface SelectGroupProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function SelectGroup({
  label,
  error,
  children,
}: SelectGroupProps): React.JSX.Element {
  const selectId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={selectId}
        className="text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

/* ================================================================== */
/*  ShipmentForm                                                       */
/*  Form component for creating a new shipment.                        */
/*                                                                     */
/*  Props:                                                             */
/*    • userId    — UUID of the shipment owner (from auth session)     */
/*    • onSuccess — callback fired after a successful submission        */
/*    • onCancel  — optional callback to close a modal / navigate back */
/* ================================================================== */

interface ShipmentFormProps {
  /** UUID of the authenticated user creating this shipment. */
  userId: string;
  /** Callback invoked after successful creation (e.g., refresh list). */
  onSuccess: () => void;
  /** Optional callback for cancel/close actions. */
  onCancel?: () => void;
}

export default function ShipmentForm({
  userId,
  onSuccess,
  onCancel,
}: ShipmentFormProps): React.JSX.Element {
  /* ---- React Hook Form wired to Zod schema ---- */
  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      bl_number: "",
      vessel_name: "",
      container_number: "",
      arrival_date: "",
    },
  });

  /* ---- Submit handler ---- */
  const onSubmit = async (values: ShipmentFormValues) => {
    try {
      const result = await createShipment({
        user_id: userId,
        bl_number: values.bl_number,
        vessel_name: values.vessel_name || undefined,
        container_number: values.container_number || undefined,
        arrival_date: values.arrival_date || undefined,
      });

      if (result.error) {
        setFormError("root", { message: result.error });
        return;
      }

      onSuccess();
    } catch (unexpected) {
      setFormError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
      aria-label="Create shipment form"
    >
      {/* ---- Root-level error (e.g., server/network errors) ---- */}
      {errors.root && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
        >
          {errors.root.message}
        </div>
      )}

      {/* ---- Bill of Lading Number (required) ---- */}
      <Input
        label="Bill of Lading Number *"
        placeholder="e.g. BL-2026-001"
        icon={Tag}
        error={errors.bl_number?.message}
        {...register("bl_number")}
      />

      {/* ---- Vessel Name ---- */}
      <Input
        label="Vessel Name"
        placeholder="e.g. MV Ever Given"
        icon={Ship}
        error={errors.vessel_name?.message}
        {...register("vessel_name")}
      />

      {/* ---- Container Number ---- */}
      <Input
        label="Container Number"
        placeholder="e.g. MSKU1234567"
        icon={Package}
        error={errors.container_number?.message}
        {...register("container_number")}
      />

      {/* ---- Arrival Date (ETA) ---- */}
      <Input
        label="Estimated Arrival Date"
        type="datetime-local"
        icon={Calendar}
        error={errors.arrival_date?.message}
        {...register("arrival_date")}
      />

      {/* ---- Action Buttons ---- */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
        <Button type="submit" isLoading={isSubmitting}>
          <Navigation className="h-4 w-4" />
          Create Shipment
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
