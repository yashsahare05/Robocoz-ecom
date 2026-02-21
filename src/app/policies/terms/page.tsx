export default function TermsPage() {
  return (
    <section className="section-container space-y-6 py-12">
      <h1 className="text-3xl font-heading font-semibold text-zinc-900">
        Terms &amp; Conditions
      </h1>
      <p className="text-sm text-zinc-600">
        These terms govern your use of Robocoz services, including purchasing
        components, requesting fabrication work and accessing your account
        portal.
      </p>
      <div className="space-y-4 text-sm text-zinc-600">
        <div className="card p-5">
          <p className="text-lg font-semibold text-zinc-900">Orders</p>
          <p className="mt-2">
            Purchase orders, online checkout and service agreements constitute a
            binding contract. Lead times are estimates; we notify customers of
            material shortages or revisions.
          </p>
        </div>
        <div className="card p-5">
          <p className="text-lg font-semibold text-zinc-900">Liability</p>
          <p className="mt-2">
            Our liability is limited to the amount paid for the services or
            products supplied. Customers remain responsible for final product
            validation and compliance.
          </p>
        </div>
      </div>
    </section>
  );
}

