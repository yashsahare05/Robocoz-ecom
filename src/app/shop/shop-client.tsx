"use client";

import { Suspense, useMemo, useRef } from "react";
import type { MouseEvent } from "react";
import { CategoryGrid } from "@/components/shop/category-grid";
import { ProductFilters, type ShopFilters } from "@/components/shop/filters";
import { ProductGrid } from "@/components/shop/product-grid";
import {
  SubcategoryGrid,
  type SubcategoryCardItem,
} from "@/components/shop/subcategory-grid";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Brand, Category, Product } from "@/types";

type ShopClientProps = {
  categories: Category[];
  brands: Brand[];
  products: Product[];
};

export const ShopClient = ({ categories, brands, products }: ShopClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sectionRef = useRef<HTMLElement | null>(null);
  const allProducts = useMemo(() => products, [products]);

  const parsedFilters = useMemo<ShopFilters>(() => {
    const params = new URLSearchParams(searchParams.toString());
    const subcategory = params.get("subcategory") ?? undefined;
    let category = params.get("category") ?? undefined;
    if (!category && subcategory) {
      const parentCategory = categories.find((item) =>
        item.subcategories?.some((entry) => entry.slug === subcategory),
      );
      category = parentCategory?.slug;
    }
    return {
      category,
      subcategory,
      brand: params.get("brand") ?? undefined,
      inStock: params.get("inStock") === "true" ? true : undefined,
    };
  }, [searchParams]);

  const filters = parsedFilters;
  const selectedCategory = filters.category
    ? categories.find((category) => category.slug === filters.category)
    : undefined;
  const showCategoryGrid = !selectedCategory;
  const showSubcategoryGrid = Boolean(selectedCategory && !filters.subcategory);
  const showSubcategoryProducts = Boolean(
    selectedCategory && filters.subcategory,
  );

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory = filters.category
        ? product.category.slug === filters.category
        : true;
      const matchesSubcategory = filters.subcategory
        ? product.subcategory?.slug === filters.subcategory
        : true;
      const matchesBrand = filters.brand
        ? product.brand.id === filters.brand
        : true;
      const matchesStock = filters.inStock ? product.inStock > 0 : true;
      return matchesCategory && matchesSubcategory && matchesBrand && matchesStock;
    });
  }, [allProducts, filters]);

  const returnTo = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const featuredProducts = allProducts.filter((product) => product.featured);
  const motorSubcategoryImages: Record<string, string> = {
    "sub-dc-motors": "/images/subcategories/motors.jpg",
    "sub-motor-driver": "/images/subcategories/motordriver.jpg",
    "sub-dc-pumps": "/images/subcategories/dc-pump.jpg",
  };

  const subcategoryItems: SubcategoryCardItem[] = selectedCategory?.subcategories
    ? selectedCategory.id === "cat-motors"
      ? selectedCategory.subcategories.map((subcategory) => ({
          ...subcategory,
          image: motorSubcategoryImages[subcategory.id],
        }))
      : selectedCategory.subcategories
    : [];
  const selectedSubcategory = selectedCategory?.subcategories?.find(
    (subcategory) => subcategory.slug === filters.subcategory,
  );

  const syncUrl = (nextFilters: ShopFilters) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextFilters.category) {
      params.set("category", nextFilters.category);
    } else {
      params.delete("category");
    }
    if (nextFilters.subcategory) {
      params.set("subcategory", nextFilters.subcategory);
    } else {
      params.delete("subcategory");
    }
    if (nextFilters.brand) {
      params.set("brand", nextFilters.brand);
    } else {
      params.delete("brand");
    }
    if (nextFilters.inStock) {
      params.set("inStock", "true");
    } else {
      params.delete("inStock");
    }
    const query = params.toString();
    const currentQuery = searchParams.toString();
    if (query === currentQuery) {
      return;
    }
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const maybeScrollToTop = (_event?: MouseEvent<HTMLElement>) => {
    if (typeof window === "undefined") {
      return;
    }
    if (window.scrollY <= 0) {
      return;
    }
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (next: Partial<ShopFilters>) => {
    const updated = { ...filters, ...next };
    const categoryChanged =
      "category" in next && next.category !== filters.category;
    if (categoryChanged && next.subcategory === undefined) {
      updated.subcategory = undefined;
    }
    syncUrl(updated);
  };

  const handleCategorySelect = (
    slug: string,
    event?: MouseEvent<HTMLElement>,
  ) => {
    syncUrl({
      ...filters,
      category: slug,
      subcategory: undefined,
    });
    maybeScrollToTop(event);
  };

  const handleBackToCategories = () => {
    syncUrl({
      ...filters,
      category: undefined,
      subcategory: undefined,
    });
  };

  const handleBackToSubcategories = () => {
    syncUrl({
      ...filters,
      subcategory: undefined,
    });
  };

  const handleSubcategorySelect = (
    slug: string,
    event?: MouseEvent<HTMLElement>,
  ) => {
    syncUrl({
      ...filters,
      subcategory: slug,
    });
    maybeScrollToTop(event);
  };

  return (
    <section ref={sectionRef} className="section-container py-8">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
          Shop
        </p>
        <h1 className="text-3xl font-heading font-semibold text-zinc-900">
          Electronic components for modern hardware teams
        </h1>
        <p className="text-sm text-zinc-600">
          Browse in-stock ICs, connectors, sensors, power modules, cables and
          more. Filter by category, brand or stock status to find the exact part
          you need.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <ProductFilters
          categories={categories}
          brands={brands}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <div className="space-y-10">
          <div className="relative">
            <div
              className={cn(
                "transition-all duration-300 ease-out",
                showCategoryGrid
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none absolute inset-0 -translate-y-2 opacity-0",
              )}
            >
              <CategoryGrid
                categories={categories}
                selectedSlug={filters.category}
                onSelectCategory={handleCategorySelect}
              />
            </div>
            <div
              className={cn(
                "transition-all duration-300 ease-out",
                showSubcategoryGrid
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none absolute inset-0 -translate-y-2 opacity-0",
              )}
            >
              <SubcategoryGrid
                items={subcategoryItems}
                selectedSlug={filters.subcategory}
                title={
                  selectedCategory
                    ? `${selectedCategory.name} subcategories`
                    : "Shop by subcategory"
                }
                description={
                  selectedCategory
                    ? "Pick a subcategory to narrow the product list."
                    : "Pick a category to reveal subcategories."
                }
                onSelectItem={handleSubcategorySelect}
                onBackToCategories={
                  selectedCategory ? handleBackToCategories : undefined
                }
              />
            </div>
            <div
              className={cn(
                "transition-all duration-300 ease-out",
                showSubcategoryProducts
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none absolute inset-0 translate-y-2 opacity-0",
              )}
            >
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
                      Subcategory
                    </p>
                    <h3 className="mt-2 text-2xl font-heading font-semibold text-zinc-900">
                      {selectedSubcategory?.name ?? "Subcategory"}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600">
                      Related products for this subcategory.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm font-semibold text-brand-dark">
                    <button
                      type="button"
                      onClick={handleBackToSubcategories}
                      className="hover:text-orange-500"
                    >
                      Back to subcategories &rarr;
                    </button>
                    <button
                      type="button"
                      onClick={handleBackToCategories}
                      className="hover:text-orange-500"
                    >
                      Back to categories &rarr;
                    </button>
                  </div>
                </div>
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-heading font-semibold text-zinc-900">
                      Related products
                    </h3>
                    <p className="text-sm text-zinc-500">
                      Showing {filteredProducts.length} results
                    </p>
                  </div>
                  <Suspense fallback={<div>Loading products...</div>}>
                    <ProductGrid
                      products={filteredProducts}
                      emptyState="No products in this subcategory yet."
                      returnTo={returnTo}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
          {selectedCategory ? null : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-heading font-semibold text-zinc-900">
                  Featured products
                </h2>
                <p className="text-sm text-zinc-500">
                  Showing {featuredProducts.length} results
                </p>
              </div>
              <Suspense fallback={<div>Loading products...</div>}>
                <ProductGrid products={featuredProducts} returnTo={returnTo} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
