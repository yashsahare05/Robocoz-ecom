"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuid } from "uuid";
import { toast } from "react-hot-toast";

import { printingMaterials } from "@/lib/constants";
import { estimate3dPrintPrice } from "@/lib/pricing/3d-printing";
import { useCartStore } from "@/store/cart-store";

const schema = z.object({
  technology: z.enum(["FDM", "SLA"]),
  materialId: z.string(),
  color: z.string(),
  layerHeight: z.number().min(0.08).max(0.3),
  infill: z.number().min(0).max(100),
  quantity: z.number().min(1).max(500),
  volumeCm3: z.number().min(1),
  deliveryDate: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type PrintingQuoteFormProps = {
  defaultTechnology?: "FDM" | "SLA";
};

export const PrintingQuoteForm = ({
  defaultTechnology = "FDM",
}: PrintingQuoteFormProps) => {
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const initialTechnology = defaultTechnology;
  const initialMaterial =
    printingMaterials.find(
      (material) => material.technology === initialTechnology,
    ) ?? printingMaterials[0];

  const form = useForm<FormValues>({
    defaultValues: {
      technology: initialTechnology,
      materialId: initialMaterial.id,
      color: initialMaterial.colorOptions[0],
      layerHeight: 0.16,
      infill: 30,
      quantity: 1,
      volumeCm3: 50,
    },
    resolver: zodResolver(schema),
  });

  const selectedMaterial = printingMaterials.find(
    (material) => material.id === form.watch("materialId"),
  );

  const selectedTechnology = form.watch("technology");

  const handleCalculate = (values: FormValues) => {
    setEstimatedPrice(estimate3dPrintPrice(values));
  };

  const handleAddToCart = (values: FormValues) => {
    const price = estimatedPrice ?? estimate3dPrintPrice(values);
    const fileRef = file
      ? { name: file.name, size: file.size, type: file.type }
      : null;
    addItem({
      id: uuid(),
      type: "3d-print",
      referenceId: "3d_print_request",
      name: `${values.technology} print (${selectedMaterial?.name ?? "Material"})`,
      unitPrice: price,
      quantity: 1,
      metadata: { ...values, file: fileRef },
    });
    toast.success("3D print request added to cart");
  };

  return (
    <form
      className="card card-static space-y-4 p-6"
      onSubmit={form.handleSubmit(handleCalculate)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700">
          Material
          <select
            {...form.register("materialId")}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
          >
            {printingMaterials
              .filter((material) => material.technology === selectedTechnology)
              .map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
          </select>
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Technology
          <select
            {...form.register("technology")}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
            onChange={(event) => {
              form.setValue("technology", event.target.value as "FDM" | "SLA");
              const nextMaterial =
                printingMaterials.find(
                  (material) => material.technology === event.target.value,
                ) ?? printingMaterials[0];
              form.setValue("materialId", nextMaterial.id);
              form.setValue("color", nextMaterial.colorOptions[0]);
            }}
          >
            <option value="FDM">FDM</option>
            <option value="SLA">SLA</option>
          </select>
        </label>
      </div>

      <label className="text-sm font-medium text-zinc-700">
        Color
        <select
          {...form.register("color")}
          className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
        >
          {selectedMaterial?.colorOptions.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-zinc-700">
        Upload STL/OBJ
        <input
          type="file"
          accept=".stl,.obj"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="mt-2 w-full rounded-xl border border-dashed border-zinc-300 px-3 py-2 text-sm"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700">
          Layer height (mm)
          <input
            type="number"
            step={0.01}
            {...form.register("layerHeight", { valueAsNumber: true })}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Infill (%)
          <input
            type="number"
            {...form.register("infill", { valueAsNumber: true })}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Quantity
          <input
            type="number"
            {...form.register("quantity", { valueAsNumber: true })}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Estimated volume (cm³)
          <input
            type="number"
            {...form.register("volumeCm3", { valueAsNumber: true })}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
          />
        </label>
      </div>

      <label className="text-sm font-medium text-zinc-700">
        Desired delivery date
        <input
          type="date"
          {...form.register("deliveryDate")}
          className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
        />
      </label>

      <label className="text-sm font-medium text-zinc-700">
        Additional notes
        <textarea
          rows={3}
          {...form.register("notes")}
          className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
        />
      </label>

      <div className="flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900">
            Estimated price
          </p>
          <p className="text-2xl font-bold text-brand-dark">
            {estimatedPrice ? `$${estimatedPrice}` : "—"}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="rounded-full border border-brand px-6 py-3 text-sm font-semibold text-brand disabled:opacity-60"
          >
            Calculate
          </button>
          <button
            type="button"
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
            onClick={form.handleSubmit(handleAddToCart)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </form>
  );
};
