import Link from "next/link";
import { getCategories } from "@/lib/supabase/catalog";

export const CategoryHighlights = async () => {
  const categories = await getCategories();
  return (
    <section className="section-container py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
            Core categories
          </p>
          <h2 className="section-title mt-2">
            Components curated for product teams
          </h2>
        </div>
        <Link
          href="/categories"
          className="text-sm font-semibold text-brand-dark hover:underline"
        >
          View all categories â†’
        </Link>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group card relative overflow-hidden border-2 border-zinc-200 p-6 transition-shadow duration-300 before:absolute before:inset-0 before:opacity-0 before:transition before:duration-300 before:content-[''] before:bg-gradient-to-br before:from-blue-400/30 before:via-blue-400/10 before:to-blue-400/60 hover:before:opacity-100"
          >
            <div className="relative z-10">
              <p className="text-lg font-semibold text-zinc-900">
                {category.name}
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                {category.description}
              </p>
            </div>
            <span className="relative z-10 mt-4 inline-flex items-center text-sm font-semibold text-brand-dark">
              Explore â†’
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
