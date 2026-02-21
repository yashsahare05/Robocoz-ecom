"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/providers/session-provider";
import {
  parseImages,
  parseSpecs,
  parseTags,
} from "@/lib/local-products";
import type { Brand, Category, Product } from "@/types";

const stats = [
  { label: "Recent orders", value: "24", change: "+12%" },
  { label: "Low stock SKUs", value: "6", change: "-2 this week" },
  { label: "3D print requests", value: "11", change: "+4" },
  { label: "PCB RFQs", value: "8", change: "+1" },
];

const ADMIN_FLAGS_KEY = "robocoz_admin_flags_v1";

const defaultFlags = {
  maintenanceMode: false,
  acceptNewOrders: true,
  acceptServiceRequests: true,
};

type Props = {
  categories: Category[];
  brands: Brand[];
  products: Product[];
};

export const AdminDashboard = ({ categories, brands, products: initialProducts }: Props) => {
  const router = useRouter();
  const { adminEmail, logout } = useAdminAuth();
  const [flags, setFlags] = useState(defaultFlags);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localImages, setLocalImages] = useState<
    { name: string; dataUrl: string }[]
  >([]);
  const localImagesInputRef = useRef<HTMLInputElement | null>(null);
  const initialCategory = categories[0];
  const initialSubcategory = initialCategory?.subcategories?.[0];
  const initialBrand = brands[0];
  const [form, setForm] = useState(() => ({
    name: "",
    sku: "",
    summary: "",
    description: "",
    categoryId: initialCategory?.id ?? "",
    subcategoryId: initialSubcategory?.id ?? "",
    brandId: initialBrand?.id ?? "",
    price: "",
    inStock: "",
    minOrderQty: "1",
    imageUrls: "",
    tags: "",
    specs: "",
    featured: false,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(ADMIN_FLAGS_KEY);
      if (stored) {
        setFlags({ ...defaultFlags, ...JSON.parse(stored) });
      }
    } catch {
      setFlags(defaultFlags);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ADMIN_FLAGS_KEY, JSON.stringify(flags));
  }, [flags]);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const category = categories.find((item) => item.id === form.categoryId);
    const subcategories = category?.subcategories ?? [];
    if (!subcategories.length) {
      if (form.subcategoryId) {
        setForm((prev) => ({ ...prev, subcategoryId: "" }));
      }
      return;
    }
    const isValid = subcategories.some(
      (item) => item.id === form.subcategoryId,
    );
    if (!isValid) {
      setForm((prev) => ({
        ...prev,
        subcategoryId: subcategories[0].id,
      }));
    }
  }, [form.categoryId, form.subcategoryId]);

  const toggleFlag = (key: keyof typeof defaultFlags) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = Number(form.price);
    const inStock = Number(form.inStock);
    const minOrderQty = Number(form.minOrderQty);
    const summary =
      form.summary.trim() ||
      form.description.trim() ||
      "Custom electronics component.";
    const description = form.description.trim() || summary;

    const remoteImages = parseImages(form.imageUrls);
    const localImageUrls = localImages.map((image) => image.dataUrl);
    const images = Array.from(
      new Set([...remoteImages, ...localImageUrls].filter(Boolean)),
    );

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          sku: form.sku.trim(),
          summary,
          description,
          categoryId: form.categoryId,
          subcategoryId: form.subcategoryId || null,
          brandId: form.brandId,
          price: Number.isFinite(price) ? price : 0,
          images,
          inStock: Number.isFinite(inStock) ? inStock : 0,
          minOrderQty: Number.isFinite(minOrderQty) ? minOrderQty : 1,
          specs: parseSpecs(form.specs),
          tags: parseTags(form.tags),
          featured: form.featured,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Failed to create product.");
      }

      const payload = await response.json();
      if (payload?.product) {
        setProducts((prev) => [payload.product, ...prev]);
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create product.",
      );
      return;
    } finally {
      setIsSubmitting(false);
    }

    setForm((prev) => ({
      ...prev,
      name: "",
      sku: "",
      summary: "",
      description: "",
      price: "",
      inStock: "",
      minOrderQty: "1",
      imageUrls: "",
      tags: "",
      specs: "",
      featured: false,
    }));
    setLocalImages([]);
    if (localImagesInputRef.current) {
      localImagesInputRef.current.value = "";
    }
  };

  const handleRemoveProduct = async (id: string) => {
    try {
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        return;
      }
      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch {
      // ignore for now
    }
  };

  const selectedCategory =
    categories.find((item) => item.id === form.categoryId) ?? categories[0];
  const subcategoryOptions = selectedCategory?.subcategories ?? [];
  const catalogReady = categories.length > 0 && brands.length > 0;

  const remotePreviewImages = useMemo(
    () => parseImages(form.imageUrls),
    [form.imageUrls],
  );
  const combinedPreviewImages = useMemo(() => {
    return Array.from(
      new Set([
        ...remotePreviewImages,
        ...localImages.map((image) => image.dataUrl),
      ]),
    );
  }, [localImages, remotePreviewImages]);

  const handleLocalImageUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const entries = Array.from(files);
    const readFile = (file: File) =>
      new Promise<{ name: string; dataUrl: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({ name: file.name, dataUrl: String(reader.result) });
        reader.onerror = () => reject(new Error("Failed to read image file."));
        reader.readAsDataURL(file);
      });

    try {
      const results = await Promise.all(entries.map((file) => readFile(file)));
      setLocalImages((prev) => {
        const existing = new Set(prev.map((item) => item.dataUrl));
        const merged = [...prev];
        results.forEach((item) => {
          if (!existing.has(item.dataUrl)) {
            merged.push(item);
          }
        });
        return merged;
      });
    } catch {
      setLocalImages((prev) => prev);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-zinc-900">
              {stat.value}
            </p>
            <p className="text-xs text-brand-dark">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-zinc-900">
            Admin session
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Signed in as{" "}
            <span className="font-semibold">{adminEmail ?? "admin"}</span>
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-700 transition hover:border-brand hover:text-brand-dark"
          >
            Sign out
          </button>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-900">
            Operations controls
          </h2>
          <div className="mt-4 space-y-4 text-sm">
            {[
              {
                key: "maintenanceMode",
                label: "Maintenance mode",
                description: "Pause the storefront while updates deploy.",
              },
              {
                key: "acceptNewOrders",
                label: "Accept new orders",
                description: "Keep checkout and cart purchases enabled.",
              },
              {
                key: "acceptServiceRequests",
                label: "Accept service requests",
                description: "Allow 3D print and PCB RFQ submissions.",
              },
            ].map((item) => {
              const enabled = flags[item.key as keyof typeof defaultFlags];
              return (
                <div
                  key={item.key}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-100 bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-zinc-900">
                      {item.label}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {item.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      toggleFlag(item.key as keyof typeof defaultFlags)
                    }
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                      enabled
                        ? "bg-brand text-white"
                        : "border border-zinc-200 text-zinc-600"
                    }`}
                  >
                    {enabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
        <div className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Product management
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Add products stored in local storage and surfaced on the shop
                page.
              </p>
            </div>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark">
              {products.length} products
            </span>
          </div>

          <form className="mt-6 space-y-4 text-sm" onSubmit={handleAddProduct}>
            {!catalogReady ? (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                Categories and brands are missing from the database. Run the
                Supabase seed script (`supabase/seed.sql`) or create categories
                and brands first.
              </div>
            ) : null}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-zinc-700">
                Product name
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                  placeholder="Robocoz Sensor Module"
                  required
                  disabled={!catalogReady}
                />
              </label>
              <label className="text-sm font-medium text-zinc-700">
                SKU
                <input
                  type="text"
                  value={form.sku}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, sku: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                  placeholder="RBZ-SENS-01"
                  required
                  disabled={!catalogReady}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-zinc-700">
                Category
                <select
                  value={form.categoryId}
                  onChange={(event) => {
                    const nextCategoryId = event.target.value;
                    const nextCategory = categories.find(
                      (item) => item.id === nextCategoryId,
                    );
                    const nextSubcategory =
                      nextCategory?.subcategories?.[0]?.id ?? "";
                    setForm((prev) => ({
                      ...prev,
                      categoryId: nextCategoryId,
                      subcategoryId: nextSubcategory,
                    }));
                  }}
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                  required
                  disabled={!catalogReady || categories.length === 0}
                >
                  {categories.length ? (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No categories available</option>
                  )}
                </select>
              </label>
              <label className="text-sm font-medium text-zinc-700">
                Subcategory
                <select
                  value={form.subcategoryId}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      subcategoryId: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                  disabled={!catalogReady || !subcategoryOptions.length}
                >
                  {subcategoryOptions.length ? (
                    subcategoryOptions.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No subcategories</option>
                  )}
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-zinc-700">
                Brand
                <select
                  value={form.brandId}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, brandId: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                  required
                  disabled={!catalogReady || brands.length === 0}
                >
                  {brands.length ? (
                    brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No brands available</option>
                  )}
                </select>
              </label>
              <label className="text-sm font-medium text-zinc-700">
                Price (USD)
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.price}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, price: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                  required
                  disabled={!catalogReady}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-zinc-700">
                Stock quantity
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form.inStock}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, inStock: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                  disabled={!catalogReady}
                />
              </label>
              <label className="text-sm font-medium text-zinc-700">
                Minimum order quantity
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={form.minOrderQty}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      minOrderQty: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                  disabled={!catalogReady}
                />
              </label>
            </div>

            <label className="text-sm font-medium text-zinc-700">
              Summary
              <input
                type="text"
                value={form.summary}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, summary: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                placeholder="Short highlight shown on the shop card."
                disabled={!catalogReady}
              />
            </label>

            <label className="text-sm font-medium text-zinc-700">
              Description
              <textarea
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                placeholder="Full product description."
                disabled={!catalogReady}
              />
            </label>

            <div className="space-y-3">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                <p className="text-sm font-semibold text-zinc-900">
                  Product images
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Add images via URL or upload from your device. Multiple images
                  are supported for both options.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <label className="text-sm font-medium text-zinc-700">
                    Image URLs (comma or new line separated)
                    <input
                      type="text"
                      value={form.imageUrls}
                    onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          imageUrls: event.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                      placeholder="https://..."
                      disabled={!catalogReady}
                    />
                  </label>
                  <label className="text-sm font-medium text-zinc-700">
                    Upload local images
                    <input
                      ref={localImagesInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) =>
                        handleLocalImageUpload(event.target.files)
                      }
                      className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs"
                      disabled={!catalogReady}
                    />
                  </label>
                </div>
              </div>
              {combinedPreviewImages.length ? (
                <div className="rounded-xl border border-zinc-100 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    {combinedPreviewImages.length} image
                    {combinedPreviewImages.length > 1 ? "s" : ""} selected
                  </p>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {combinedPreviewImages.map((image) => (
                      <li
                        key={image}
                        className="flex items-center gap-3 rounded-lg border border-zinc-100 p-2"
                      >
                        <img
                          src={image}
                          alt="Selected product"
                          className="h-12 w-12 rounded-md border border-zinc-200 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-zinc-700">
                            {image.startsWith("data:") ? "Local image" : "Image URL"}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            {image.startsWith("data:")
                              ? "Stored locally"
                              : "Linked URL"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            image.startsWith("data:")
                              ? setLocalImages((prev) =>
                                  prev.filter((item) => item.dataUrl !== image),
                                )
                              : setForm((prev) => ({
                                  ...prev,
                                  imageUrls: parseImages(prev.imageUrls)
                                    .filter((item) => item !== image)
                                    .join(", "),
                                }))
                          }
                          className="rounded-full border border-zinc-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 hover:border-brand hover:text-brand-dark"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-zinc-500">
                  Local images are stored as data URLs in your browser.
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-zinc-700">
                Tags (comma separated)
                <input
                  type="text"
                  value={form.tags}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, tags: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                  placeholder="featured, new"
                  disabled={!catalogReady}
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-zinc-700">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      featured: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-zinc-300 text-brand focus:ring-brand"
                  disabled={!catalogReady}
                />
                Feature on shop landing
              </label>
            </div>

            <label className="text-sm font-medium text-zinc-700">
              Specs (one per line, Key: Value)
              <textarea
                rows={3}
                value={form.specs}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, specs: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 font-mono text-xs"
                placeholder="Voltage: 5V"
                disabled={!catalogReady}
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4">
              <p className="text-xs text-zinc-500">
                Products are stored in Supabase and synced to the shop.
              </p>
              <button
                type="submit"
                disabled={isSubmitting || !catalogReady}
                className="rounded-full bg-brand px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white"
              >
                {isSubmitting ? "Saving..." : "Add product"}
              </button>
            </div>
            {submitError ? (
              <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                {submitError}
              </p>
            ) : null}
          </form>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">
              Products
            </h2>
            <span className="text-xs text-zinc-500">
              {products.length} stored
            </span>
          </div>
          {products.length ? (
            <ul className="mt-4 space-y-3 text-sm">
              {products.map((product) => {
                return (
                  <li
                    key={product.id}
                    className="rounded-xl border border-zinc-100 px-3 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-zinc-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {product.brand?.name ?? "Brand"} /{" "}
                          {product.category?.name ?? "Category"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          SKU {product.sku} - ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="rounded-full border border-zinc-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-600 hover:border-brand hover:text-brand-dark"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              No products added yet.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-900">
            Service requests
          </h2>
          <div className="mt-4 divide-y divide-zinc-100 text-sm">
            {[
              {
                id: "PRNT-2041",
                type: "3D PRINT",
                status: "In Review",
                owner: "M. Patel",
              },
              {
                id: "PCB-983",
                type: "PCB",
                status: "Quoted",
                owner: "J. Howard",
              },
            ].map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-semibold text-zinc-900">{request.id}</p>
                  <p className="text-xs text-zinc-500">{request.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-brand-dark">
                    {request.status}
                  </p>
                  <p className="text-xs text-zinc-500">{request.owner}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-zinc-900">
            CMS quick links
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-brand-dark">
            <li>
              <a href="/admin/cms/homepage">Homepage content -&gt;</a>
            </li>
            <li>
              <a href="/admin/cms/faq">FAQ entries -&gt;</a>
            </li>
            <li>
              <a href="/admin/cms/services">Services descriptions -&gt;</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
