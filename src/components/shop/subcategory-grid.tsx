import { type Subcategory } from "@/types";
import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";

export type SubcategoryCardItem = Subcategory & {
  image?: string;
};

type Props = {
  items: SubcategoryCardItem[];
  selectedSlug?: string;
  title?: string;
  description?: string;
  emptyState?: string;
  onSelectItem?: (slug: string, event?: MouseEvent<HTMLButtonElement>) => void;
  onBackToCategories?: () => void;
};

export const SubcategoryGrid = ({
  items,
  selectedSlug,
  title = "Shop by subcategory",
  description = "Pick a subcategory to narrow the product list.",
  emptyState = "Subcategories are coming soon.",
  onSelectItem,
  onBackToCategories,
}: Props) => {
  if (!items.length) {
    return (
      <div className="card p-6 text-sm text-zinc-500">{emptyState}</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
            Subcategories
          </p>
          <h3 className="mt-2 text-2xl font-heading font-semibold text-zinc-900">
            {title}
          </h3>
          <p className="mt-2 text-sm text-zinc-600">{description}</p>
        </div>
        {onBackToCategories ? (
          <button
            type="button"
            onClick={onBackToCategories}
            className="text-sm font-semibold text-brand-dark hover:text-orange-500"
          >
            Back to categories &rarr;
          </button>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const isSelected = selectedSlug === item.slug;
          const cardClass = cn(
            "group card flex h-full flex-col justify-between border-2 p-5 text-left transition-shadow duration-300 hover:translate-y-0 hover:shadow-lg",
            isSelected ? "border-brand/60 shadow-card" : "border-zinc-200",
          );

          const content = (
            <>
              <div>
                {item.image ? (
                  <div className="-mx-5 -mt-5 mb-4 overflow-hidden rounded-t-2xl bg-zinc-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-32 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <p className="text-lg font-semibold text-zinc-900">
                  {item.name}
                </p>
                <p className="mt-2 text-sm text-zinc-600">
                  Explore parts in this subcategory.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand-dark">
                Browse products &rarr;
              </span>
            </>
          );

          if (onSelectItem) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={(event) => onSelectItem(item.slug, event)}
                className={cardClass}
              >
                {content}
              </button>
            );
          }

          return (
            <div key={item.id} className={cardClass}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
