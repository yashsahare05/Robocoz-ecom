import { type PcbMaterialOption, type PrintingMaterial } from "@/types";

export const serviceStatuses = [
  "NEW",
  "IN_REVIEW",
  "QUOTED",
  "ACCEPTED",
  "IN_PRODUCTION",
  "COMPLETED",
] as const;

export const printingMaterials: PrintingMaterial[] = [
  {
    id: "pla",
    name: "PLA",
    colorOptions: ["Natural", "Black", "White", "Blue", "Red"],
    technology: "FDM",
    baseRate: 0.12,
    multiplier: 1,
  },
  {
    id: "abs",
    name: "ABS",
    colorOptions: ["Black", "White", "Grey"],
    technology: "FDM",
    baseRate: 0.18,
    multiplier: 1.2,
  },
  {
    id: "petg",
    name: "PETG",
    colorOptions: ["Black", "White", "Clear"],
    technology: "FDM",
    baseRate: 0.2,
    multiplier: 1.3,
  },
  {
    id: "tpu",
    name: "TPU",
    colorOptions: ["Black", "Blue", "Orange"],
    technology: "FDM",
    baseRate: 0.25,
    multiplier: 1.5,
  },
  {
    id: "resin-standard",
    name: "Standard Resin",
    colorOptions: ["Grey", "Black", "White"],
    technology: "SLA",
    baseRate: 0.35,
    multiplier: 1.6,
  },
  {
    id: "resin-high-temp",
    name: "High Temp Resin",
    colorOptions: ["Amber"],
    technology: "SLA",
    baseRate: 0.45,
    multiplier: 1.85,
  },
];

export const pcbFinishes: PcbMaterialOption[] = [
  { id: "hasl-lead", label: "HASL (Lead)", multiplier: 1 },
  { id: "hasl-lead-free", label: "HASL (Lead Free)", multiplier: 1.15 },
  { id: "enig", label: "ENIG", multiplier: 1.35 },
  { id: "immersion-tin", label: "Immersion Tin", multiplier: 1.2 },
];

export const solderMaskColors = [
  "Green",
  "Red",
  "Blue",
  "Black",
  "White",
  "Yellow",
];

export const silkscreenColors = ["White", "Black"];

export const defaultTaxRate = 0.08;
export const defaultShippingRate = 15;
export const leadTimeEstimates = {
  FDM: { min: 2, max: 5 },
  SLA: { min: 3, max: 7 },
  PCB: { min: 5, max: 14 },
};

