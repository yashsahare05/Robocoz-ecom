import { CartSummary } from "@/components/cart/cart-summary";

export default function CartPage() {
  return (
    <section className="section-container space-y-6 py-12">
      <h1 className="text-3xl font-heading font-semibold text-zinc-900">
        Cart
      </h1>
      <CartSummary />
    </section>
  );
}

