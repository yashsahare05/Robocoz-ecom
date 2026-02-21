import Link from "next/link";

const printingOptions = [
  {
    id: "fdm",
    title: "FDM printing",
    description:
      "Best for durable prototypes, enclosures, fixtures, and production-grade thermoplastics.",
    highlights: [
      "Large build volumes for functional assemblies",
      "Engineering materials including ABS, PETG, nylon, and CF blends",
      "Ideal for jigs, fixtures, and rapid iteration",
    ],
    href: "/services/3d-printing/fdm-page",
  },
  {
    id: "sla",
    title: "SLA printing",
    description:
      "High-resolution resin printing for smooth finishes, tight tolerances, and complex geometry.",
    highlights: [
      "Fine surface finish for presentation-grade parts",
      "Ideal for small features, tooling, and enclosures",
      "Post-processing and curing included",
    ],
    href: "/services/3d-printing/sla-page",
  },
];

export default function PrintingOverviewPage() {
  return (
    <section className="section-container space-y-10 py-12">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
          3D Printing Services
        </p>
        <h1 className="text-3xl font-heading font-semibold text-zinc-900">
          FDM and SLA production with fast turnarounds
        </h1>
        <p className="text-sm text-zinc-600">
          Choose the right process for your part requirements, then dive into
          material selection and instant pricing. Each service includes QA
          inspection, post-processing, and clear lead-time guidance.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {printingOptions.map((option) => (
          <div
            key={option.id}
            id={option.id}
            className="card card-static scroll-mt-28 space-y-4 p-6"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-zinc-900">
                {option.title}
              </h2>
              <p className="text-sm text-zinc-600">{option.description}</p>
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-600">
              {option.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <Link
              href={option.href}
              className="inline-flex text-sm font-semibold text-brand-dark"
            >
              Start {option.title} quote -&gt;
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
