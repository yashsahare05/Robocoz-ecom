import { pcbFinishes } from "@/lib/constants";
import { type PcbQuoteInput } from "@/types";

const BASE_PCB_RATE = 0.08;
const LAYER_MULTIPLIER = 0.15;
const ASSEMBLY_PER_UNIT = 6;

export const estimatePcbPrice = (input: PcbQuoteInput) => {
  const area = (input.lengthMm * input.widthMm) / 100;
  const finish = pcbFinishes.find((f) => f.id === input.finishId);
  const finishMultiplier = finish?.multiplier ?? 1;
  const layerCost = 1 + (input.layers - 2) * LAYER_MULTIPLIER;

  const baseCost =
    area * BASE_PCB_RATE * layerCost * finishMultiplier * input.quantity;
  const copperMultiplier = input.copperWeightOz / 1;
  const leadTimeMultiplier = input.leadTimeDays <= 5 ? 1.4 : 1;

  const assemblyCost = input.assemblyRequired
    ? input.quantity * ASSEMBLY_PER_UNIT
    : 0;

  const subtotal =
    (baseCost * copperMultiplier * leadTimeMultiplier) + assemblyCost;

  return Number(Math.max(subtotal, 85).toFixed(2));
};

