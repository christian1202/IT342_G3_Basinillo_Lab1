"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ship, Tag, Navigation, Package, Calendar } from "lucide-react";

import { createShipment, updateShipment } from "@/services/shipmentService";
import type {
  IShipment,
  ShipmentStatus,
  IUpdateShipmentPayload,
} from "@/types/database";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

/* ================================================================== */
/*  Zod Schema                                                         */
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

  status: z
    .enum([
      "PENDING",
      "IN_TRANSIT",
      "ARRIVED",
      "CUSTOMS_HOLD",
      "RELEASED",
      "DELIVERED",
    ] as const)
    .optional(),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

/* ================================================================== */
/*  STATUS OPTIONS                                                     */
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
/*  SelectGroup Helper                                                 */
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
/*  Supports both Creating (default) and Editing (via initialData).    */
/* ================================================================== */

interface ShipmentFormProps {
  /** UUID of the shipment owner. */
  userId: string;
  /** Callback fired after successful create/update. */
  onSuccess: () => void;
  /** Optional callback to close modal. */
  onCancel?: () => void;
  /** If provided, switches form to "Edit Mode". */
  initialData?: IShipment | null;
}

export default function ShipmentForm({
  userId,
  onSuccess,
  onCancel,
  initialData,
}: ShipmentFormProps): React.JSX.Element {
  const isEditMode = !!initialData;

  /* ---- RHF Setup ---- */
  const {
    register,
    handleSubmit,
    setError: setFormError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      bl_number: "",
      vessel_name: "",
      container_number: "",
      arrival_date: "",
      status: "PENDING",
    },
  });

  /* ---- Pre-fill form when initialData changes ---- */
  useEffect(() => {
    if (initialData) {
      reset({
        bl_number: initialData.bl_number,
        vessel_name: initialData.vessel_name || "",
        container_number: initialData.container_number || "",
        arrival_date: initialData.arrival_date
          ? new Date(initialData.arrival_date).toISOString().slice(0, 16) // format for datetime-local
          : "",
        status: initialData.status,
      });
    } else {
      reset({
        bl_number: "",
        vessel_name: "",
        container_number: "",
        arrival_date: "",
        status: "PENDING",
      });
    }
  }, [initialData, reset]);

  /* ---- Submit Handler ---- */
  const onSubmit = async (values: ShipmentFormValues) => {
    try {
      let result;

      if (isEditMode && initialData) {
        /* UPDATE Logic */
        const payload: IUpdateShipmentPayload = {
          vessel_name: values.vessel_name || undefined,
          container_number: values.container_number || undefined,
          arrival_date: values.arrival_date || undefined,
          status: values.status,
        };
        result = await updateShipment(initialData.id, payload);
      } else {
        /* CREATE Logic */
        result = await createShipment({
          user_id: userId,
          bl_number: values.bl_number,
          vessel_name: values.vessel_name || undefined,
          container_number: values.container_number || undefined,
          arrival_date: values.arrival_date || undefined,
        });
      }

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
      aria-label={isEditMode ? "Edit shipment form" : "Create shipment form"}
    >
      {errors.root && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
        >
          {errors.root.message}
        </div>
      )}

      {/* Bill of Lading */}
      <Input
        label="Bill of Lading Number *"
        placeholder="e.g. BL-2026-001"
        icon={Tag}
        error={errors.bl_number?.message}
        {...register("bl_number")}
        disabled={isEditMode}
      />

      {/* Vessel Name */}
      <Input
        label="Vessel Name"
        placeholder="e.g. MV Ever Given"
        icon={Ship}
        error={errors.vessel_name?.message}
        {...register("vessel_name")}
      />

      {/* Container Number */}
      <Input
        label="Container Number"
        placeholder="e.g. MSKU1234567"
        icon={Package}
        error={errors.container_number?.message}
        {...register("container_number")}
      />

      {/* Arrival Date */}
      <Input
        label="Estimated Arrival Date"
        type="datetime-local"
        icon={Calendar}
        error={errors.arrival_date?.message}
        {...register("arrival_date")}
      />

      {/* Status (Only visible in Edit Mode) */}
      {isEditMode && (
        <SelectGroup label="Current Status" error={errors.status?.message}>
          <div className="relative">
            <select
              {...register("status")}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {/* Custom arrow could go here */}
          </div>
        </SelectGroup>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
        <Button type="submit" isLoading={isSubmitting}>
          <Navigation className="h-4 w-4" />
          {isEditMode ? "Save Changes" : "Create Shipment"}
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
