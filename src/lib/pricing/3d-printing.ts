import { printingMaterials } from "@/lib/constants";
import { type PrinterQuoteInput } from "@/types";

const BASE_SERVICE_FEE = 12;
const TECHNOLOGY_MULTIPLIER = {
  FDM: 1,
  SLA: 1.4,
} as const;

export const estimate3dPrintPrice = (input: PrinterQuoteInput) => {
  const material = printingMaterials.find((m) => m.id === input.materialId);
  if (!material) {
    throw new Error("Unknown material selection");
  }

  const materialRate = material.baseRate * material.multiplier;
  const technologyRate = TECHNOLOGY_MULTIPLIER[input.technology];
  const volumeCost = input.volumeCm3 * materialRate * technologyRate;
  const quantityMultiplier = Math.max(input.quantity, 1);

  const layerMultiplier = 1 + (0.2 - input.layerHeight) * 2;
  const infillMultiplier = 1 + input.infill / 200;

  const estimate =
    (volumeCost * layerMultiplier * infillMultiplier + BASE_SERVICE_FEE) *
    quantityMultiplier;

  return Number(estimate.toFixed(2));
};

