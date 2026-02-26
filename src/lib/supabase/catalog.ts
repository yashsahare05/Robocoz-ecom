import type { Brand, Category, Product, Subcategory, VolumePricingTier } from "@/types";
import {
  brands as fallbackBrands,
  categories as fallbackCategories,
  products as fallbackProducts,
} from "@/data/sample-data";
import { createAdminClient, createServerClient } from "./server";
type SupabaseClient = NonNullable<ReturnType<typeof createServerClient>>;

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hero_image: string | null;
  subcategories?: SubcategoryRow[] | null;
};

type SubcategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type BrandRow = {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  summary: string;
  description: string;
  price: number;
  volume_pricing: unknown;
  images: string[] | null;
  in_stock: number;
  min_order_qty: number;
  rating: number | null;
  tags: string[] | null;
  featured: boolean | null;
  datasheet_url: string | null;
  specs: Record<string, string> | null;
  category?: CategoryRow | null;
  subcategory?: SubcategoryRow | null;
  brand?: BrandRow | null;
};

const productSelect = `id,
  name,
  slug,
  sku,
  summary,
  description,
  price,
  volume_pricing,
  images,
  in_stock,
  min_order_qty,
  rating,
  tags,
  featured,
  datasheet_url,
  specs,
  category:categories (id, name, slug, description, hero_image),
  subcategory:subcategories (id, name, slug),
  brand:brands (id, name, description, logo, website)`;

const baseProductQuery = (client: SupabaseClient) =>
  client.from("products").select(productSelect);

const mapSubcategory = (row: SubcategoryRow): Subcategory => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
});

const mapCategory = (row: CategoryRow): Category => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description ?? undefined,
  heroImage: row.hero_image ?? undefined,
  subcategories: row.subcategories?.map(mapSubcategory),
});

const mapBrand = (row: BrandRow): Brand => ({
  id: row.id,
  name: row.name,
  description: row.description ?? undefined,
  logo: row.logo ?? undefined,
  website: row.website ?? undefined,
});

const mapVolumePricing = (value: unknown): VolumePricingTier[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((tier) => {
      if (!tier || typeof tier !== "object") return null;
      const minQty = Number((tier as Record<string, unknown>).minQty ?? 0);
      const maxQtyRaw = (tier as Record<string, unknown>).maxQty;
      const price = Number((tier as Record<string, unknown>).price ?? 0);
      return {
        minQty: Number.isFinite(minQty) ? minQty : 0,
        maxQty:
          typeof maxQtyRaw === "number" && Number.isFinite(maxQtyRaw)
            ? maxQtyRaw
            : undefined,
        price: Number.isFinite(price) ? price : 0,
      };
    })
    .filter(Boolean) as VolumePricingTier[];
};

export const mapProductRow = (row: ProductRow): Product => {
  const category = row.category
    ? mapCategory(row.category)
    : { id: "", name: "Uncategorized", slug: "uncategorized" };
  const brand = row.brand
    ? mapBrand(row.brand)
    : { id: "", name: "Unknown" };
  const subcategory = row.subcategory ? mapSubcategory(row.subcategory) : undefined;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    summary: row.summary,
    description: row.description,
    category,
    subcategory,
    brand,
    specs: row.specs ?? {},
    datasheetUrl: row.datasheet_url ?? undefined,
    price: row.price,
    volumePricing: mapVolumePricing(row.volume_pricing),
    images: row.images ?? [],
    inStock: row.in_stock,
    minOrderQty: row.min_order_qty,
    rating: row.rating ?? undefined,
    tags: row.tags ?? undefined,
    featured: Boolean(row.featured),
  };
};

export const getCategories = async (): Promise<Category[]> => {
  const supabase = createServerClient();
  const admin = createAdminClient();

  const query = (client: SupabaseClient) =>
    client
      .from("categories")
      .select(
        "id, name, slug, description, hero_image, subcategories (id, name, slug)",
      )
      .order("name");

  if (supabase) {
    const { data, error } = await query(supabase);
    if (!error && data && data.length) {
      return data.map((row) => mapCategory(row as CategoryRow));
    }
  }

  if (admin) {
    const { data, error } = await query(admin);
    if (!error && data && data.length) {
      return data.map((row) => mapCategory(row as CategoryRow));
    }
  }

  return fallbackCategories;
};

export const getBrands = async (): Promise<Brand[]> => {
  const supabase = createServerClient();
  const admin = createAdminClient();

  const query = (client: SupabaseClient) =>
    client.from("brands").select("id, name, description, logo, website").order("name");

  if (supabase) {
    const { data, error } = await query(supabase);
    if (!error && data && data.length) {
      return data.map((row) => mapBrand(row as BrandRow));
    }
  }

  if (admin) {
    const { data, error } = await query(admin);
    if (!error && data && data.length) {
      return data.map((row) => mapBrand(row as BrandRow));
    }
  }

  return fallbackBrands;
};

export const getProducts = async (): Promise<Product[]> => {
  const supabase = createServerClient();
  const admin = createAdminClient();

  const query = (client: SupabaseClient) =>
    baseProductQuery(client).order("created_at", { ascending: false });

  if (supabase) {
    const { data, error } = await query(supabase);
    if (!error && data && data.length) {
      return data.map((row) => mapProductRow(row as unknown as ProductRow));
    }
  }

  if (admin) {
    const { data, error } = await query(admin);
    if (!error && data && data.length) {
      return data.map((row) => mapProductRow(row as unknown as ProductRow));
    }
  }

  return fallbackProducts;
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  if (!slug) return null;
  const supabase = createServerClient();
  const admin = createAdminClient();

  const query = (client: SupabaseClient) =>
    baseProductQuery(client).eq("slug", slug).maybeSingle();

  if (supabase) {
    const { data, error } = await query(supabase);
    if (!error && data) {
      return mapProductRow(data as ProductRow);
    }
  }

  if (admin) {
    const { data, error } = await query(admin);
    if (!error && data) {
      return mapProductRow(data as ProductRow);
    }
  }

  return fallbackProducts.find((product) => product.slug === slug) ?? null;
};

export const getRelatedProducts = async (
  categoryId: string,
  excludeId?: string,
  limit = 6,
): Promise<Product[]> => {
  if (!categoryId) return [];
  const supabase = createServerClient();
  const admin = createAdminClient();

  const query = (client: SupabaseClient) => {
    let builder = baseProductQuery(client).eq("category_id", categoryId);
    if (excludeId) {
      builder = builder.neq("id", excludeId);
    }
    return builder.order("created_at", { ascending: false }).limit(limit);
  };

  if (supabase) {
    const { data, error } = await query(supabase);
    if (!error && data && data.length) {
      return data.map((row) => mapProductRow(row as ProductRow));
    }
  }

  if (admin) {
    const { data, error } = await query(admin);
    if (!error && data && data.length) {
      return data.map((row) => mapProductRow(row as ProductRow));
    }
  }

  return fallbackProducts
    .filter((product) => product.category.id === categoryId)
    .filter((product) => (excludeId ? product.id !== excludeId : true))
    .slice(0, limit);
};

export const getCatalogData = async () => {
  const [categories, brands, products] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(),
  ]);

  return { categories, brands, products };
};
