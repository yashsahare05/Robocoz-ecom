import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { getProducts } from "@/lib/supabase/catalog";

export const FeaturedProducts = async () => {
  const products = await getProducts();
  const featured = products.filter((product) => product.featured);
  return (
    <section className="section-container py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
            Featured products
          </p>
          <h2 className="section-title mt-2">
            Ready-to-ship components for critical builds
          </h2>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link href="/shop/new">New arrivals</Link>
          <span className="text-zinc-400">|</span>
          <Link href="/shop/best-sellers">Best sellers</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {featured.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.slug}`}
            className="group card relative overflow-hidden flex flex-col !bg-white !opacity-100 p-6 hover:!opacity-100 border-2 border-zinc-200 transition-shadow duration-300 before:absolute before:inset-0 before:opacity-0 before:transition before:duration-300 before:content-[''] before:bg-gradient-to-br before:from-blue-400/30 before:via-blue-400/10 before:to-blue-400/60 hover:before:opacity-100"
          >
            <div className="relative z-10 flex-1">
              <p className="text-sm uppercase tracking-wide text-zinc-500">
                {product.category.name}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-zinc-900">
                {product.name}
              </h3>
              <p className="mt-3 text-sm text-zinc-600">{product.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500">
                {Object.entries(product.specs)
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <span
                      key={key}
                      className="rounded-full border border-zinc-300 px-3 py-1"
                    >
                      {key}: {value}
                    </span>
                  ))}
              </div>
            </div>
            <div className="relative z-10 mt-6 flex items-center justify-between">
              <span className="text-lg font-semibold text-zinc-900">
                {formatCurrency(product.price)}
              </span>
              <span className="text-sm font-semibold text-brand-dark">
                View details →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};


