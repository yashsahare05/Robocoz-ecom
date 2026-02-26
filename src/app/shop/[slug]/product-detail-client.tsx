"use client";

import { useSearchParams } from "next/navigation";
import { ProductDetail } from "@/components/shop/product-detail";
import { ProductGrid } from "@/components/shop/product-grid";
import { BackNav } from "@/components/shop/back-nav";
import type { Product } from "@/types";

type Props = {
  product: Product;
  related: Product[];
};

export const ProductDetailClient = ({ product, related }: Props) => {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? undefined;

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
