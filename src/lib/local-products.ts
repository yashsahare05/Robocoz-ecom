import type { Product } from "@/types";
import { brands, categories, products as baseProducts } from "@/data/sample-data";

export const LOCAL_PRODUCTS_KEY = "robocoz_products_v1";
export const LOCAL_PRODUCTS_EVENT = "robocoz:products-updated";

export type LocalProductEntry = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  summary: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  brandId: string;
  price: number;
  images: string[];
  localImages?: string[];
  inStock: number;
  minOrderQty: number;
  specs: Record<string, string>;
  tags?: string[];
  featured?: boolean;
  createdAt: string;
};

export type LocalProductInput = {
  name: string;
  sku: string;
  summary: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  brandId: string;
  price: number;
  images: string[];
  inStock: number;
  minOrderQty: number;
  specs: Record<string, string>;
  tags?: string[];
  featured?: boolean;
  slug?: string;
};

const safeParse = (value: string | null) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureUniqueSlug = (slug: string, existing: Set<string>) => {
  if (!existing.has(slug)) return slug;
  let counter = 2;
  let next = `${slug}-${counter}`;
  while (existing.has(next)) {
    counter += 1;
    next = `${slug}-${counter}`;
  }
  return next;
};

export const readLocalProductEntries = (): LocalProductEntry[] => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(LOCAL_PRODUCTS_KEY);
  return safeParse(raw) as LocalProductEntry[];
};

export const writeLocalProductEntries = (entries: LocalProductEntry[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event(LOCAL_PRODUCTS_EVENT));
};

export const addLocalProductEntry = (entry: LocalProductEntry) => {
  const entries = readLocalProductEntries();
  const next = [entry, ...entries];
  writeLocalProductEntries(next);
  return next;
};

export const removeLocalProductEntry = (id: string) => {
  const entries = readLocalProductEntries();
  const next = entries.filter((entry) => entry.id !== id);
  writeLocalProductEntries(next);
  return next;
};

export const mapEntryToProduct = (entry: LocalProductEntry): Product | null => {
  const category = categories.find((item) => item.id === entry.categoryId);
  if (!category) return null;
  const brand = brands.find((item) => item.id === entry.brandId);
  if (!brand) return null;
  const subcategory = category.subcategories?.find(
    (item) => item.id === entry.subcategoryId,
  );
  const images = [
    ...(entry.images ?? []),
    ...(entry.localImages ?? []),
  ].filter(Boolean);
  return {
    id: entry.id,
    name: entry.name,
    slug: entry.slug,
    sku: entry.sku,
    summary: entry.summary,
    description: entry.description,
    category,
    subcategory,
    brand,
    specs: entry.specs ?? {},
    price: entry.price,
    volumePricing: [],
    images,
    inStock: entry.inStock,
    minOrderQty: entry.minOrderQty,
    tags: entry.tags,
    featured: entry.featured,
  };
};

export const getLocalProducts = (): Product[] => {
  const entries = readLocalProductEntries();
  return entries
    .map((entry) => mapEntryToProduct(entry))
    .filter((product): product is Product => Boolean(product));
};

export const createLocalProductEntry = (
  input: LocalProductInput,
  existingSlugs?: string[],
): LocalProductEntry => {
  const existing = new Set<string>([
    ...baseProducts.map((item) => item.slug),
    ...(existingSlugs ?? []),
  ]);
  const baseSlug = slugify(input.slug?.trim() || input.name);
  const slug = ensureUniqueSlug(baseSlug || createId(), existing);

  return {
    id: createId(),
    name: input.name.trim(),
    slug,
    sku: input.sku.trim(),
    summary: input.summary.trim(),
    description: input.description.trim(),
    categoryId: input.categoryId,
    subcategoryId: input.subcategoryId,
    brandId: input.brandId,
    price: input.price,
    images: input.images,
    inStock: input.inStock,
    minOrderQty: input.minOrderQty,
    specs: input.specs,
    tags: input.tags?.length ? input.tags : undefined,
    featured: input.featured,
    createdAt: new Date().toISOString(),
  };
};

export const parseTags = (raw: string) =>
  raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export const parseImages = (raw: string) =>
  raw
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

export const parseSpecs = (raw: string) => {
  const specs: Record<string, string> = {};
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [key, ...rest] = line.split(":");
      if (!key || rest.length === 0) return;
      const value = rest.join(":").trim();
      if (!value) return;
      specs[key.trim()] = value;
    });
  return specs;
};
