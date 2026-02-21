import { type Product } from "@/types";
import { ProductCard } from "@/components/shop/product-card";

type Props = {
  products: Product[];
  emptyState?: string;
  returnTo?: string;
};

export const ProductGrid = ({ products, emptyState, returnTo }: Props) => {
  if (!products.length) {
    return (
      <div className="card p-8 text-center text-sm text-zinc-500">
        {emptyState ?? "No products match your filters yet."}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} returnTo={returnTo} />
      ))}
    </div>
  );
};

