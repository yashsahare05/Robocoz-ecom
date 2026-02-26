import { Suspense } from "react";
import { ShopClient } from "./shop-client";
import { getCatalogData } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const { categories, brands, products } = await getCatalogData();
  return (
    <Suspense fallback={<div className="section-container py-8">Loading...</div>}>
      <ShopClient categories={categories} brands={brands} products={products} />
    </Suspense>
  );
}
