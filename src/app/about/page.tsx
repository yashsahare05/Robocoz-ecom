export default function AboutPage() {
  return (
    <section className="section-container space-y-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
        Company
      </p>
      <h1 className="text-3xl font-heading font-semibold text-zinc-900">
        About Robocoz
      </h1>
      <p className="text-base text-zinc-600">
        Robocoz is a multidisciplinary team of supply chain specialists,
        hardware engineers and fabrication experts helping teams prototype and
        ship reliable electronics faster. We combine a curated component catalog
        with integrated fabrication services so product teams can consolidate
        vendors and maintain quality.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Global sourcing",
            description: "Multi-region stocking hubs and lifecycle monitoring.",
          },
          {
            title: "Fabrication partners",
            description: "IPC Class 2/3 PCB fabs and ISO-certified print farms.",
          },
          {
            title: "Engineering support",
            description: "Application engineers on standby for BOM reviews.",
          },
        ].map((item) => (
          <div key={item.title} className="card card-static p-5">
            <p className="text-lg font-semibold text-zinc-900">{item.title}</p>
            <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

