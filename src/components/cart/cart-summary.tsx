"use client";

import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export const CartSummary = () => {
  const { items, removeItem, updateQuantity } = useCartStore();
  const subtotal = items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const taxes = subtotal * 0.08;
  const total = subtotal + taxes + 15;

  if (!items.length) {
    return (
      <div className="card p-8 text-center text-sm text-zinc-500">
        Your cart is currently empty.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        {items.map((item) => {
          const safeQuantity =
            Number.isFinite(item.quantity) && item.quantity > 0
              ? item.quantity
              : 1;
          return (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-base font-semibold text-zinc-900">
                {item.name}
              </p>
              <p className="text-sm text-zinc-500 capitalize">{item.type}</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={safeQuantity}
                onChange={(event) =>
                  updateQuantity(item.id, Number(event.target.value))
                }
                className="w-20 rounded-full border border-zinc-200 px-3 py-1 text-center text-sm"
              />
              <p className="text-sm font-semibold text-zinc-900">
                {formatCurrency(item.unitPrice * safeQuantity)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        );
        })}
      </div>
      <div className="card space-y-4 p-6">
        <h2 className="text-lg font-semibold text-zinc-900">
          Order summary
        </h2>
        <div className="space-y-3 text-sm text-zinc-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated taxes</span>
            <span>{formatCurrency(taxes)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>$15.00</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-zinc-100 pt-4 text-base font-semibold text-zinc-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
};

