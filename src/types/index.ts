export type VolumePricingTier = {
  minQty: number;
  maxQty?: number;
  price: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  heroImage?: string;
  subcategories?: Subcategory[];
};

export type Subcategory = {
  id: string;
  name: string;
  slug: string;
};

export type Brand = {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  summary: string;
  description: string;
  category: Category;
  subcategory?: Subcategory;
  brand: Brand;
  specs: Record<string, string>;
  datasheetUrl?: string;
  price: number;
  volumePricing?: VolumePricingTier[];
  images: string[];
  inStock: number;
  minOrderQty: number;
  rating?: number;
  tags?: string[];
  featured?: boolean;
};

export type CartItem = {
  id: string;
  type: "product" | "3d-print" | "pcb";
  referenceId: string;
  name: string;
  summary?: string;
  unitPrice: number;
  quantity: number;
  metadata?: Record<string, unknown>;
};

export type Address = {
  id: string;
  label?: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
};

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type ServiceStatus =
  | "NEW"
  | "IN_REVIEW"
  | "QUOTED"
  | "ACCEPTED"
  | "IN_PRODUCTION"
  | "COMPLETED";

export type OrderItem = {
  id: string;
  itemType: CartItem["type"];
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  meta?: Record<string, unknown>;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
};

export type PrintingTechnology = "FDM" | "SLA";

export type PrintingMaterial = {
  id: string;
  name: string;
  colorOptions: string[];
  technology: PrintingTechnology;
  baseRate: number;
  multiplier: number;
};

export type PrinterQuoteInput = {
  technology: PrintingTechnology;
  materialId: string;
  color: string;
  layerHeight: number;
  infill: number;
  quantity: number;
  volumeCm3: number;
  deliveryDate?: string;
};

export type PrintingOrder = {
  id: string;
  userId?: string;
  status: ServiceStatus;
  quoteMode: boolean;
  estimatedPrice: number;
  payload: PrinterQuoteInput;
  files: string[];
};

export type PcbMaterialOption = {
  id: string;
  label: string;
  multiplier: number;
};

export type PcbQuoteInput = {
  layers: number;
  lengthMm: number;
  widthMm: number;
  quantity: number;
  solderMaskColor: string;
  silkscreenColor: string;
  finishId: string;
  copperWeightOz: number;
  leadTimeDays: number;
  assemblyRequired: boolean;
  bomReference?: string;
};

export type PcbOrder = {
  id: string;
  userId?: string;
  status: ServiceStatus;
  quoteMode: boolean;
  estimatedPrice: number;
  payload: PcbQuoteInput;
  files: string[];
};

export type NotificationPreferences = {
  orderUpdates: boolean;
  quoteStatus: boolean;
  marketing: boolean;
};

