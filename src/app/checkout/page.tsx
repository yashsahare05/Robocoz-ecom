export default function CheckoutPage() {
  return (
    <section className="section-container space-y-8 py-12">
      <div>
        <p className="text-sm uppercase tracking-wide text-brand-dark">
          Checkout
        </p>
        <h1 className="text-3xl font-heading font-semibold text-zinc-900">
          Secure payment & fulfillment
        </h1>
        <p className="text-sm text-zinc-600">
          Guest checkout is available, or sign in to reuse saved addresses,
          payment methods and upload history.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold text-zinc-900">
            Shipping information
          </h2>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            placeholder="Full name"
          />
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            placeholder="Company"
          />
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            placeholder="Street address"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder="City"
            />
            <input
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder="Postal code"
            />
          </div>
        </div>
        <div className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold text-zinc-900">Payment</h2>
          <p className="text-sm text-zinc-600">
            Stripe integration-ready. Provide your publishable key in
            environment variables to enable live payments.
          </p>
          <div className="rounded-xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-500">
            Payment element placeholder
          </div>
          <button className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white">
            Place order
          </button>
        </div>
      </div>
    </section>
  );
}

