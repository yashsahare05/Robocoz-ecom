import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-detail-client";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/supabase/catalog";

export const revalidate = 60;

type Props = {
  params: { slug: string };
};

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }
  const related = await getRelatedProducts(product.category.id, product.id);
  return (
    <Suspense fallback={<div className="section-container py-6">Loading...</div>}>
      <ProductDetailClient product={product} related={related} />
    </Suspense>
  );
}
