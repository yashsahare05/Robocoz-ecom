import { type Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

type Props = {
  product: Product;
  returnTo?: string;
};

export const ProductCard = ({ product, returnTo }: Props) => {
  const href = returnTo
    ? { pathname: `/shop/${product.slug}`, query: { returnTo } }
    : `/shop/${product.slug}`;

  return (
    <Link
      href={href}
      className="card flex h-full flex-col border-2 border-zinc-200 p-5 hover:translate-y-0"
    >
      {product.images?.[0] ? (
        <div className="-mx-5 -mt-5 mb-5 overflow-hidden rounded-t-2xl bg-zinc-50">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-40 w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          {product.brand.name}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-zinc-900">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-zinc-600">{product.summary}</p>
        <dl className="mt-4 space-y-1 text-xs text-zinc-500">
          <div className="flex justify-between">
            <dt>SKU</dt>
            <dd>{product.sku}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Stock</dt>
            <dd>{product.inStock} pcs</dd>
          </div>
          <div className="flex justify-between">
            <dt>MOQ</dt>
            <dd>{product.minOrderQty}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-zinc-900">
          {formatCurrency(product.price)}
        </span>
        <span className="text-sm font-semibold text-brand-dark">View -&gt;</span>
      </div>
    </Link>
  );
};
