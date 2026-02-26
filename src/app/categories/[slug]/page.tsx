import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/shop/product-grid";
import { getCatalogData } from "@/lib/supabase/catalog";

export const revalidate = 60;

type Props = {
  params: { slug: string };
};

export default async function CategoryDetailPage({ params }: Props) {
  const { categories, products } = await getCatalogData();
  const category = categories.find((item) => item.slug === params.slug);
  if (!category) {
    notFound();
  }
  const categoryProducts = products.filter(
    (product) => product.category.id === category.id,
  );

  return (
    <section className="section-container py-12">
      <p className="text-sm uppercase tracking-wide text-brand-dark">
        Category
      </p>
      <h1 className="text-3xl font-heading font-semibold text-zinc-900">
        {category.name}
      </h1>
      <p className="mt-2 text-sm text-zinc-600">{category.description}</p>

      <div className="mt-10">
        <ProductGrid
          products={categoryProducts}
          emptyState="No products in this category yet."
        />
      </div>
    </section>
  );
}

