export default function ShippingReturnsPage() {
  return (
    <section className="section-container space-y-6 py-12">
      <h1 className="text-3xl font-heading font-semibold text-zinc-900">
        Shipping & Returns
      </h1>
      <p className="text-sm text-zinc-600">
        Robocoz ships globally from our US and EU logistics hubs. Orders include
        tracking and customs documentation. Service work follows
        project-specific statements of work.
      </p>
      <div className="space-y-4 text-sm text-zinc-600">
        <div className="card p-5">
          <p className="text-lg font-semibold text-zinc-900">Shipping</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Same-day dispatch for stocked components ordered before 3pm PT</li>
            <li>Flat-rate domestic shipping, calculated international rates</li>
            <li>Customs-ready invoices and harmonized codes provided</li>
          </ul>
        </div>
        <div className="card p-5">
          <p className="text-lg font-semibold text-zinc-900">Returns</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>30-day returns for unused components in original packaging</li>
            <li>Service work covered by workmanship warranty—contact support for RMAs</li>
            <li>Custom builds evaluated case-by-case</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

