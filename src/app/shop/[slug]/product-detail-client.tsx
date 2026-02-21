"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ProductDetail } from "@/components/shop/product-detail";
import { ProductGrid } from "@/components/shop/product-grid";
import { BackNav } from "@/components/shop/back-nav";
import type { Product } from "@/types";

type Props = {
  products: Product[];
};

export const ProductDetailClient = ({ products }: Props) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const allProducts = useMemo(() => products, [products]);
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const product = allProducts.find((item) => item.slug === slug);
  const related = product
    ? allProducts.filter(
        (item) =>
          item.category.id === product.category.id && item.id !== product.id,
      )
    : [];
  const returnTo = searchParams.get("returnTo") ?? undefined;

  if (!slug) {
    return null;
  }

  if (!product) {
    return (
      <section className="section-container space-y-6 py-6">
        <BackNav label="Back to shop" />
        <div className="card card-static p-6 text-sm text-zinc-600">
          Product not found. Try returning to the shop catalog.
        </div>
      </section>
    );
  }

  return (
    <section className="section-container space-y-12 py-6">
      <div className="space-y-6">
        <div>
          <BackNav label="Back to shop" />
        </div>
        <ProductDetail product={product} />
      </div>
      <div>
        <h2 className="section-title">Related products</h2>
        <div className="mt-6">
          <ProductGrid
            products={related}
            emptyState="No related products yet."
            returnTo={returnTo}
          />
        </div>
      </div>
    </section>
  );
};
