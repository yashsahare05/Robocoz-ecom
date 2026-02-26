import Link from "next/link";
import { getCategories } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <section className="section-container py-12">
      <h1 className="text-3xl font-heading font-semibold text-zinc-900">
        Categories
      </h1>
      <p className="mt-3 text-sm text-zinc-600">
        Select a category to browse curated components, documentation and
        recommended services.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="card p-6"
          >
            <p className="text-lg font-semibold text-zinc-900">
              {category.name}
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              {category.description}
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-brand-dark">
              View products →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

