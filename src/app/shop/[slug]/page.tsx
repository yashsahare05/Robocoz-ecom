import { Suspense } from "react";
import { ProductDetailClient } from "./product-detail-client";
import { getCatalogData } from "@/lib/supabase/catalog";

export const revalidate = 60;

export default async function ProductDetailPage() {
  const { products } = await getCatalogData();
  return (
    <Suspense fallback={<div className="section-container py-6">Loading...</div>}>
      <ProductDetailClient products={products} />
    </Suspense>
  );
}
