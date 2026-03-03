"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Ship,
  Tag,
  Navigation,
  Package,
  Calendar,
  User,
  Receipt,
  Hash,
  Anchor,
} from "lucide-react";

import { createShipment, updateShipment } from "@/services/shipmentService";
import type { IShipment, ICreateShipmentPayload } from "@/types/database";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

/* ================================================================== */
/*  Zod Schema                                                         */
/*  Uses camelCase field names matching the backend DTO.                */
/* ================================================================== */

const shipmentSchema = z.object({
  blNumber: z
    .string()
    .min(1, "Bill of Lading number is required.")
    .max(50, "BL number must be 50 characters or fewer."),
  vesselName: z
    .string()
    .min(1, "Vessel name is required.")
    .max(150, "Vessel name must be 150 characters or fewer."),
  voyageNo: z
    .string()
    .max(50, "Voyage number must be 50 characters or fewer.")
    .optional()
    .or(z.literal("")),
  containerNumber: z
    .string()
    .max(50, "Container number must be 50 characters or fewer.")
    .optional()
    .or(z.literal("")),
  portOfDischarge: z
    .string()
    .max(100, "Port name must be 100 characters or fewer.")
    .optional()
    .or(z.literal("")),
  arrivalDate: z.string().optional().or(z.literal("")),
  freeTimeDays: z.coerce.number().min(0).optional(),
  serviceFee: z.coerce.number().min(0, "Service fee must be valid").optional(),
  clientName: z
    .string()
    .max(150, "Client name must be 150 characters or fewer")
    .optional()
    .or(z.literal("")),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

/* ================================================================== */
/*  ShipmentForm                                                       */
/*  Create / Edit — sends camelCase payloads to the backend.           */
/* ================================================================== */

interface ShipmentFormProps {
  /** UUID of the assigned broker (from Clerk). */
  brokerId: string;
  /** Fired after successful create/update. */
  onSuccess: () => void;
  /** Optional — closes modal or navigates back. */
  onCancel?: () => void;
  /** If provided, switches to edit mode. */
  initialData?: IShipment | null;
}

export default function ShipmentForm({
  brokerId,
  onSuccess,
  onCancel,
  initialData,
}: ShipmentFormProps): React.JSX.Element {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    setError: setFormError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      blNumber: "",
      vesselName: "",
      voyageNo: "",
      containerNumber: "",
      portOfDischarge: "",
      arrivalDate: "",
      freeTimeDays: 15,
      serviceFee: 0,
      clientName: "",
    },
  });

  /* Pre-fill form in edit mode */
  useEffect(() => {
    if (initialData) {
      reset({
        blNumber: initialData.blNumber,
        vesselName: initialData.vesselName || "",
        voyageNo: initialData.voyageNo || "",
        containerNumber: initialData.containerNumber || "",
        portOfDischarge: initialData.portOfDischarge || "",
        arrivalDate: initialData.arrivalDate
          ? new Date(initialData.arrivalDate).toISOString().slice(0, 16)
          : "",
        freeTimeDays: initialData.freeTimeDays ?? 15,
        serviceFee: initialData.serviceFee ?? 0,
        clientName: initialData.clientName || "",
      });
    } else {
      reset({
        blNumber: "",
        vesselName: "",
        voyageNo: "",
        containerNumber: "",
        portOfDischarge: "",
        arrivalDate: "",
        freeTimeDays: 15,
        serviceFee: 0,
        clientName: "",
      });
    }
  }, [initialData, reset]);

  /* Submit handler */
  const onSubmit = async (values: ShipmentFormValues) => {
    try {
      const payload: ICreateShipmentPayload = {
        brokerId,
        blNumber: values.blNumber,
        vesselName: values.vesselName,
        voyageNo: values.voyageNo || undefined,
        containerNumber: values.containerNumber || undefined,
        portOfDischarge: values.portOfDischarge || undefined,
        arrivalDate: values.arrivalDate || undefined,
        freeTimeDays: values.freeTimeDays,
        serviceFee: values.serviceFee,
        clientName: values.clientName || undefined,
      };

      const result =
        isEditMode && initialData
          ? await updateShipment(initialData.id, payload)
          : await createShipment(payload);

      if (result.error) {
        setFormError("root", { message: result.error });
        return;
      }

      onSuccess();
    } catch {
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
        error={errors.blNumber?.message}
        {...register("blNumber")}
        disabled={isEditMode}
      />

      {/* Vessel Name */}
      <Input
        label="Vessel Name *"
        placeholder="e.g. MV Ever Given"
        icon={Ship}
        error={errors.vesselName?.message}
        {...register("vesselName")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Voyage Number */}
        <Input
          label="Voyage Number"
          placeholder="e.g. V-2026-01"
          icon={Hash}
          error={errors.voyageNo?.message}
          {...register("voyageNo")}
        />

        {/* Container Number */}
        <Input
          label="Container Number"
          placeholder="e.g. MSKU1234567"
          icon={Package}
          error={errors.containerNumber?.message}
          {...register("containerNumber")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Port of Discharge */}
        <Input
          label="Port of Discharge"
          placeholder="e.g. Manila North Harbor"
          icon={Anchor}
          error={errors.portOfDischarge?.message}
          {...register("portOfDischarge")}
        />

        {/* Arrival Date */}
        <Input
          label="Estimated Arrival Date"
          type="datetime-local"
          icon={Calendar}
          error={errors.arrivalDate?.message}
          {...register("arrivalDate")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Free Time Days */}
        <Input
          label="Free Time (Days)"
          type="number"
          min="0"
          icon={Calendar}
          error={errors.freeTimeDays?.message}
          {...register("freeTimeDays")}
        />

        {/* Service Fee */}
        <Input
          label="Service Fee (₱)"
          type="number"
          step="0.01"
          icon={Receipt}
          error={errors.serviceFee?.message}
          {...register("serviceFee")}
        />

        {/* Client Name */}
        <Input
          label="Client Name"
          placeholder="e.g. Toyota Motor"
          icon={User}
          error={errors.clientName?.message}
          {...register("clientName")}
        />
      </div>

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
