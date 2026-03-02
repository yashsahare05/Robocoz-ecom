import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { mapProductRow } from "@/lib/supabase/catalog";

const schema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  subcategoryId: z.string().optional().nullable(),
  brandId: z.string().min(1),
  price: z.number().nonnegative(),
  images: z.array(z.string()).optional().default([]),
  inStock: z.number().int().nonnegative().optional().default(0),
  minOrderQty: z.number().int().positive().optional().default(1),
  specs: z.record(z.string(), z.string()).optional().default({}),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional().default(false),
  datasheetUrl: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
  volumePricing: z.array(z.any()).optional().default([]),
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureUniqueSlug = async (supabase: ReturnType<typeof createAdminClient>, base: string) => {
  if (!supabase) return base || crypto.randomUUID();
  const baseSlug = base || crypto.randomUUID();
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .like("slug", `${baseSlug}%`);

  if (error || !data) {
    return baseSlug;
  }

  const existing = new Set(data.map((row) => row.slug));
  if (!existing.has(baseSlug)) {
    return baseSlug;
  }
  let counter = 2;
  let next = `${baseSlug}-${counter}`;
  while (existing.has(next)) {
    counter += 1;
    next = `${baseSlug}-${counter}`;
  }
  return next;
};

export async function POST(request: Request) {
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase admin client not configured." },
      { status: 500 },
    );
  }

  let payload: z.infer<typeof schema>;
  try {
    const json = await request.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    payload = parsed.data;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const slug = await ensureUniqueSlug(supabase, slugify(payload.name));

  const { data, error } = await supabase
    .from("products")
    .insert({
      id: crypto.randomUUID(),
      name: payload.name,
      slug,
      sku: payload.sku,
      summary: payload.summary,
      description: payload.description,
      category_id: payload.categoryId,
      subcategory_id: payload.subcategoryId || null,
      brand_id: payload.brandId,
      specs: payload.specs ?? {},
      datasheet_url: payload.datasheetUrl ?? null,
      price: payload.price,
      volume_pricing: payload.volumePricing ?? [],
      images: payload.images ?? [],
      in_stock: payload.inStock ?? 0,
      min_order_qty: payload.minOrderQty ?? 1,
      rating: payload.rating ?? null,
      tags: payload.tags ?? [],
      featured: payload.featured ?? false,
    })
    .select(
      `id,
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
       brand:brands (id, name, description, logo, website)`,
    )
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to create product." },
      { status: 500 },
    );
  }

  const product = mapProductRow(data as any);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/categories");
  revalidatePath(`/shop/${product.slug}`);
  if (product.category?.slug) {
    revalidatePath(`/categories/${product.category.slug}`);
  }

  return NextResponse.json({ product });
}

export async function DELETE(request: Request) {
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase admin client not configured." },
      { status: 500 },
    );
  }

  let id: string | undefined;
  try {
    const json = await request.json();
    id = json?.id;
  } catch {
    id = undefined;
  }

  if (!id) {
    return NextResponse.json(
      { error: "Missing product id." },
      { status: 400 },
    );
  }

  type ExistingProductRow = {
    slug: string | null;
    category: { slug: string | null } | null;
  };

  const { data: existing } = await supabase
    .from("products")
    .select("slug, category:categories (slug)")
    .eq("id", id)
    .maybeSingle<ExistingProductRow>();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to delete product." },
      { status: 500 },
    );
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/categories");
  const existingSlug = existing?.slug ?? null;
  const categorySlug = existing?.category?.slug ?? null;

  if (existingSlug) {
    revalidatePath(`/shop/${existingSlug}`);
  }
  if (categorySlug) {
    revalidatePath(`/categories/${categorySlug}`);
  }

  return NextResponse.json({ ok: true });
}
