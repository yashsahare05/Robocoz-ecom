import Link from "next/link";
import type { MouseEvent } from "react";
import { type Category } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  categories: Category[];
  selectedSlug?: string;
  onSelectCategory?: (slug: string, event?: MouseEvent<HTMLButtonElement>) => void;
};

export const CategoryGrid = ({
  categories,
  selectedSlug,
  onSelectCategory,
}: Props) => (
  <div className="space-y-6">
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
        Shop by category
      </p>
      <h2 className="mt-2 text-2xl font-heading font-semibold text-zinc-900">
        Explore subcategories
      </h2>
      <p className="mt-2 text-sm text-zinc-600">
        Pick a category to reveal the subcategories, then browse the products
        that match your spec and stock needs.
      </p>
    </div>
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => {
        const isSelected = selectedSlug === category.slug;
        const cardClass = cn(
          "group card relative flex h-full flex-col justify-between overflow-hidden border-2 p-6 transition-shadow duration-300 hover:translate-y-0 hover:shadow-lg",
          isSelected ? "border-brand/60 shadow-card" : "border-zinc-200",
        );

        const content = (
          <>
            <div>
              {category.heroImage ? (
                <div className="-mx-6 -mt-6 mb-5 overflow-hidden rounded-t-2xl bg-zinc-50">
                  <img
                    src={category.heroImage}
                    alt={category.name}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <p className="text-lg font-semibold text-zinc-900">
                {category.name}
              </p>
              {category.description ? (
                <p className="mt-2 text-sm text-zinc-600">
                  {category.description}
                </p>
              ) : null}
            </div>
            <span className="mt-6 inline-flex items-center text-sm font-semibold text-brand-dark">
              Browse products &rarr;
            </span>
          </>
        );

        if (onSelectCategory) {
          return (
            <button
              key={category.id}
              type="button"
              onClick={(event) => onSelectCategory(category.slug, event)}
              className={cardClass}
            >
              {content}
            </button>
          );
        }

        return (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className={cardClass}
          >
            {content}
          </Link>
        );
      })}
    </div>
  </div>
);
