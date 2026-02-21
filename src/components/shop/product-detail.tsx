"use client";

import { useEffect, useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import { type Product } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { toast } from "react-hot-toast";

type Props = {
  product: Product;
};

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={cn("h-4 w-4", filled ? "text-brand" : "text-zinc-200")}
    fill="currentColor"
  >
    <path d="M12 2l2.83 6.63 7.17.62-5.43 4.7 1.62 7.05L12 17.3 5.81 21l1.62-7.05L2 9.25l7.17-.62L12 2z" />
  </svg>
);

const RatingStars = ({ rating }: { rating: number }) => {
  const filledStars = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon key={index} filled={index < filledStars} />
      ))}
    </div>
  );
};

export const ProductDetail = ({ product }: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const isAvailable = product.inStock > 0;
  const rating = product.rating ?? 4.8;
  const reviewCount = Math.max(1, Math.round(rating * 12));
  const specs = Object.entries(product.specs ?? {});
  const highlightSpecs = specs.slice(0, 5);
  const galleryImages = useMemo(() => {
    const fallbackImage = "/images/products/stm32f4.jpg";
    const baseImages =
      product.images && product.images.length ? product.images : [fallbackImage];
    if (baseImages.length >= 4) {
      return baseImages.slice(0, 4);
    }
    return Array.from({ length: 4 }, (_, index) => baseImages[index % baseImages.length]);
  }, [product.images]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [galleryImages]);

  const handleZoomMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty("--zoom-x", `${x}%`);
    event.currentTarget.style.setProperty("--zoom-y", `${y}%`);
  };

  const handleZoomLeave = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--zoom-x", "50%");
    event.currentTarget.style.setProperty("--zoom-y", "50%");
  };

  const handleAdd = () => {
    addItem({
      id: product.id,
      referenceId: product.id,
      type: "product",
      name: product.name,
      summary: product.summary,
      quantity: product.minOrderQty,
      unitPrice: product.price,
      metadata: { sku: product.sku },
    });
    toast.success("Added to cart");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="space-y-6">
        <div className="card card-static relative overflow-hidden p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/15 via-white to-transparent" />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-wide text-zinc-500">
              <span>{product.category.name}</span>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-[10px] font-semibold text-brand-dark">
                Robocoz certified
              </span>
            </div>
            <div
              className="group relative mt-6 flex items-center justify-center overflow-hidden rounded-2xl border border-zinc-100 bg-white/80 p-8 shadow-inner"
              style={
                {
                  "--zoom-x": "50%",
                  "--zoom-y": "50%",
                } as CSSProperties
              }
              onMouseMove={handleZoomMove}
              onMouseLeave={handleZoomLeave}
            >
              <img
                src={galleryImages[activeIndex]}
                alt={product.name}
                className="h-56 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-[4] sm:h-64"
                style={{ transformOrigin: "var(--zoom-x) var(--zoom-y)" }}
              />
            </div>
            <div className="mt-6 grid grid-cols-4 gap-3">
              {galleryImages.map((image, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "flex items-center justify-center rounded-xl border p-3 transition",
                      isActive
                        ? "border-brand bg-brand/5 shadow-sm"
                        : "border-zinc-200 bg-white hover:border-brand/60",
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-10 w-auto object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card card-static p-6">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Technical specs
          </p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-900">
            Engineering-ready details
          </h2>
          {specs.length ? (
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {specs.map(([label, value]) => (
                <div key={label} className="rounded-xl border border-zinc-100 p-4">
                  <dt className="text-xs uppercase tracking-wide text-zinc-500">
                    {label}
                  </dt>
                  <dd className="text-base font-medium text-zinc-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-3 text-sm text-zinc-500">
              Specs are being finalized. Contact our team for a full datasheet.
            </p>
          )}
          {product.datasheetUrl && (
            <a
              href={product.datasheetUrl}
              className="mt-6 inline-flex text-sm font-semibold text-brand"
            >
              View datasheet -&gt;
            </a>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="card card-static p-6">
          <p className="text-xs uppercase tracking-wide text-brand-dark">
            {product.brand.name}
          </p>
          <h1 className="mt-2 text-3xl font-heading font-semibold text-zinc-900">
            {product.name}
          </h1>
          <p className="mt-3 text-sm text-zinc-600">{product.summary}</p>
          <p className="mt-3 text-sm text-zinc-600">{product.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <RatingStars rating={rating} />
            <span className="font-medium text-zinc-900">
              {rating.toFixed(1)} / 5
            </span>
            <span>({reviewCount} reviews)</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold",
                isAvailable
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700",
              )}
            >
              {isAvailable ? "In stock" : "Out of stock"}
            </span>
            <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500">
              SKU {product.sku}
            </span>
            <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500">
              MOQ {product.minOrderQty}
            </span>
          </div>

          {product.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-6">
            <p className="text-sm font-semibold text-zinc-900">Key specs</p>
            {highlightSpecs.length ? (
              <ol className="mt-3 space-y-2 text-sm text-zinc-600">
                {highlightSpecs.map(([label, value], index) => (
                  <li key={label} className="flex gap-3">
                    <span className="font-semibold text-brand-dark">
                      {index + 1}.
                    </span>
                    <span>
                      <span className="font-medium text-zinc-900">
                        {label}:
                      </span>{" "}
                      {value}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-sm text-zinc-500">
                Specs are being validated. Contact us for details.
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">Price</p>
                <p className="text-3xl font-bold text-zinc-900">
                  {formatCurrency(product.price)}
                </p>
                <p className="text-xs text-zinc-500">
                  Taxes and shipping calculated at checkout.
                </p>
              </div>
              <div className="text-sm text-zinc-500">
                <p className="font-semibold text-zinc-900">
                  {product.inStock} available
                </p>
                <p>Ships fast from Robocoz inventory</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className={cn(
                  "w-full rounded-full px-6 py-3 font-semibold text-white transition",
                  isAvailable
                    ? "bg-brand hover:bg-brand-dark"
                    : "cursor-not-allowed bg-zinc-300 text-zinc-500",
                )}
                onClick={handleAdd}
                disabled={!isAvailable}
              >
                Add to cart
              </button>
              <button
                type="button"
                className="w-full rounded-full border border-zinc-200 px-6 py-3 font-semibold text-zinc-700 transition hover:border-brand/40 hover:text-brand-dark"
              >
                Add to wishlist
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card card-static p-6">
            <p className="text-sm font-semibold text-zinc-900">
              Volume discounts
            </p>
            {product.volumePricing?.length ? (
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                {product.volumePricing.map((tier) => (
                  <li key={tier.minQty} className="flex justify-between">
                    <span>
                      {tier.minQty}
                      {tier.maxQty ? `-${tier.maxQty}` : "+"} pcs
                    </span>
                    <span className="font-semibold text-zinc-900">
                      {formatCurrency(tier.price)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-zinc-500">
                Contact sales for custom volume pricing and contracts.
              </p>
            )}
          </div>
          <div className="card card-static p-6">
            <p className="text-sm font-semibold text-zinc-900">
              Need custom PCB or enclosure?
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Bundle this component with PCB fabrication or 3D printed fixtures
              for a single delivery.
            </p>
            <div className="mt-4 space-y-2 text-sm font-semibold text-brand-dark">
              <a href="/services/pcb-manufacturing">Add PCB manufacturing -&gt;</a>
              <a href="/services/3d-printing">Add 3D printing -&gt;</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
