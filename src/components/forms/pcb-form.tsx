"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuid } from "uuid";

import {
  pcbFinishes,
  silkscreenColors,
  solderMaskColors,
} from "@/lib/constants";
import { estimatePcbPrice } from "@/lib/pricing/pcb";
import { useCartStore } from "@/store/cart-store";
import { toast } from "react-hot-toast";

const schema = z.object({
  layers: z.number().min(2).max(12),
  lengthMm: z.number().min(10),
  widthMm: z.number().min(10),
  quantity: z.number().min(5),
  solderMaskColor: z.string(),
  silkscreenColor: z.string(),
  finishId: z.string(),
  copperWeightOz: z.number().min(1).max(4),
  leadTimeDays: z.number().min(5).max(21),
  assemblyRequired: z.boolean(),
  bomReference: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export const PcbQuoteForm = () => {
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const form = useForm<FormValues>({
    defaultValues: {
      layers: 4,
      lengthMm: 100,
      widthMm: 80,
      quantity: 10,
      solderMaskColor: solderMaskColors[0],
      silkscreenColor: silkscreenColors[0],
      finishId: pcbFinishes[0].id,
      copperWeightOz: 1,
      leadTimeDays: 10,
      assemblyRequired: false,
    },
    resolver: zodResolver(schema),
  });

  const handleCalculate = (values: FormValues) => {
    setEstimatedPrice(estimatePcbPrice(values));
  };

  const handleAddToCart = (values: FormValues) => {
    const price = estimatedPrice ?? estimatePcbPrice(values);
    const fileRef = designFile
      ? { name: designFile.name, size: designFile.size, type: designFile.type }
      : null;
    addItem({
      id: uuid(),
      type: "pcb",
      referenceId: "pcb_request",
      name: `${values.layers} layer PCB (${values.quantity} pcs)`,
      unitPrice: price,
      quantity: 1,
      metadata: { ...values, file: fileRef },
    });
    toast.success("PCB request added to cart");
  };

  return (
    <form className="card card-static space-y-4 p-6" onSubmit={form.handleSubmit(handleCalculate)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700">
          Layer count
          <input
            type="number"
            {...form.register("layers", { valueAsNumber: true })}
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
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700">
          Length (mm)
          <input
            type="number"
            {...form.register("lengthMm", { valueAsNumber: true })}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Width (mm)
          <input
            type="number"
            {...form.register("widthMm", { valueAsNumber: true })}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700">
          Solder mask color
          <select
            {...form.register("solderMaskColor")}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
          >
            {solderMaskColors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Silkscreen color
          <select
            {...form.register("silkscreenColor")}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
          >
            {silkscreenColors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="text-sm font-medium text-zinc-700">
        Surface finish
        <select
          {...form.register("finishId")}
          className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
        >
          {pcbFinishes.map((finish) => (
            <option key={finish.id} value={finish.id}>
              {finish.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700">
          Copper weight (oz)
          <input
            type="number"
            {...form.register("copperWeightOz", { valueAsNumber: true })}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Lead time (days)
          <input
            type="number"
            {...form.register("leadTimeDays", { valueAsNumber: true })}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
          />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-zinc-700">
        <input
          type="checkbox"
          {...form.register("assemblyRequired")}
          className="rounded border-zinc-300 text-brand focus:ring-brand"
        />
        Assembly required
      </label>

      <label className="text-sm font-medium text-zinc-700">
        BOM reference (optional)
        <input
          type="text"
          placeholder="Link or internal reference"
          {...form.register("bomReference")}
          className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
        />
      </label>

      <label className="text-sm font-medium text-zinc-700">
        Notes
        <textarea
          rows={3}
          {...form.register("notes")}
          className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
        />
      </label>
      <label className="text-sm font-medium text-zinc-700">
        Upload Gerber / zip
        <input
          type="file"
          accept=".zip,.rar,.gz,.tgz"
          onChange={(event) => setDesignFile(event.target.files?.[0] ?? null)}
          className="mt-2 w-full rounded-xl border border-dashed border-zinc-300 px-3 py-2 text-sm"
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

