"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  SCHEMA                                                             */
/* ------------------------------------------------------------------ */

const shipmentSchema = z.object({
  bl_number: z.string().min(3, "BL Number is required"),
  client_name: z.string().min(2, "Client Name is required"),
  service_fee: z.coerce
    .number()
    .min(0, "Service Fee must be 0 or greater")
    .default(0),
  vessel_name: z.string().optional(),
  container_number: z.string().optional(),
  arrival_date: z.string().optional(),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

export function CreateShipmentModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      service_fee: 0,
    },
  });

  async function onSubmit(data: ShipmentFormValues) {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { error } = await supabase.from("shipments").insert({
        user_id: user.id,
        bl_number: data.bl_number,
        client_name: data.client_name,
        service_fee: data.service_fee, // Saved as Decimal in DB
        vessel_name: data.vessel_name,
        container_number: data.container_number,
        arrival_date: data.arrival_date || null,
        status: "PENDING",
      });

      if (error) throw error;

      setOpen(false);
      reset();
      router.refresh(); // Refresh server components/data
    } catch (error: any) {
      alert("Error creating shipment: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Shipment
      </Button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Create New Consignment"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {/* Row 1: BL & Client */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">BL Number *</label>
              <Input
                {...register("bl_number")}
                placeholder="e.g. OOLU123456"
                className={errors.bl_number ? "border-red-500" : ""}
              />
              {errors.bl_number && (
                <p className="text-xs text-red-500">
                  {errors.bl_number.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Name *</label>
              <Input
                {...register("client_name")}
                placeholder="e.g. Toyota Cebu"
                className={errors.client_name ? "border-red-500" : ""}
              />
              {errors.client_name && (
                <p className="text-xs text-red-500">
                  {errors.client_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Vessel & Container */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Vessel Name</label>
              <Input
                {...register("vessel_name")}
                placeholder="e.g. MV EVERGREEN"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Container No.</label>
              <Input
                {...register("container_number")}
                placeholder="e.g. TGHU7654321"
              />
            </div>
          </div>

          {/* Row 3: Financials & Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Service Fee (PHP)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₱</span>
                <Input
                  {...register("service_fee")}
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
              {errors.service_fee && (
                <p className="text-xs text-red-500">
                  {errors.service_fee.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Est. Arrival</label>
              <div className="relative">
                <Input type="date" {...register("arrival_date")} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Consignment
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
