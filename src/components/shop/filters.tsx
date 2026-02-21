import { cn } from "@/lib/utils";
import type { Brand, Category } from "@/types";

export type ShopFilters = {
  category?: string;
  subcategory?: string;
  brand?: string;
  inStock?: boolean;
};

type Props = {
  categories: Category[];
  brands: Brand[];
  filters?: ShopFilters;
  onFilterChange?: (filters: Partial<ShopFilters>) => void;
};

export const ProductFilters = ({ categories, brands, filters, onFilterChange }: Props) => {
  return (
    <aside className="card p-5">
      <h3 className="text-lg font-semibold text-zinc-900">Filters</h3>
      <div className="mt-4 space-y-5 text-sm">
        <div>
          <p className="font-medium text-zinc-700">Category</p>
          <div className="mt-2 space-y-2">
            <button
              type="button"
              onClick={() =>
                onFilterChange?.({ category: undefined, subcategory: undefined })
              }
              className={cn(
                "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm font-medium transition",
                !filters?.category
                  ? "border-brand/50 bg-brand/10 text-brand-dark"
                  : "border-zinc-200 text-zinc-700 hover:border-brand/40",
              )}
            >
              <span>All categories</span>
            </button>
            {categories.map((category) => {
              const isSelected = filters?.category === category.slug;
              const subcategories = category.subcategories ?? [];
              return (
                <div
                  key={category.id}
                  className={cn(
                    "group rounded-xl transition",
                    isSelected ? "bg-brand/5" : "hover:bg-zinc-50",
                  )}
                >
                  <button
                    type="button"
                    onClick={() =>
                      onFilterChange?.({
                        category: category.slug,
                        subcategory: undefined,
                      })
                    }
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium transition",
                      isSelected
                        ? "text-brand-dark"
                        : "text-zinc-700 hover:text-brand-dark",
                    )}
                  >
                    <span>{category.name}</span>
                    <span
                      className={cn(
                        "text-lg text-zinc-400 transition-transform duration-200",
                        isSelected ? "rotate-90" : "rotate-0 group-hover:rotate-90",
                      )}
                    >
                      &rsaquo;
                    </span>
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden px-3 transition-[max-height,opacity] duration-300 ease-out",
                      isSelected
                        ? "max-h-48 pb-3 opacity-100"
                        : "max-h-0 pb-0 opacity-0 group-hover:max-h-48 group-hover:pb-3 group-hover:opacity-100",
                    )}
                  >
                    {subcategories.length ? (
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() =>
                            onFilterChange?.({
                              category: category.slug,
                              subcategory: undefined,
                            })
                          }
                          className={cn(
                            "block w-full rounded-md px-2 py-1 text-left text-xs font-medium transition",
                            !filters?.subcategory
                              ? "bg-brand/10 text-brand-dark"
                              : "text-zinc-600 hover:text-brand-dark",
                          )}
                        >
                          All subcategories
                        </button>
                        {subcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            onClick={() =>
                              onFilterChange?.({
                                category: category.slug,
                                subcategory: subcategory.slug,
                              })
                            }
                            className={cn(
                              "block w-full rounded-md px-2 py-1 text-left text-xs font-medium transition",
                              filters?.subcategory === subcategory.slug
                                ? "bg-brand/10 text-brand-dark"
                                : "text-zinc-600 hover:text-brand-dark",
                            )}
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500">
                        Subcategories are coming soon.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <p className="font-medium text-zinc-700">Brand</p>
          <div className="mt-2 space-y-1">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={brand.id}
                  className="rounded border-zinc-300 text-brand focus:ring-brand"
                  checked={filters?.brand === brand.id}
                  onChange={(event) =>
                    onFilterChange?.({
                      brand: event.target.checked ? brand.id : undefined,
                    })
                  }
                />
                {brand.name}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium text-zinc-700">Stock</p>
          <label className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-zinc-300 text-brand focus:ring-brand"
              checked={Boolean(filters?.inStock)}
              onChange={(event) =>
                onFilterChange?.({ inStock: event.target.checked })
              }
            />
            Show only in-stock
          </label>
        </div>
      </div>
    </aside>
  );
};
