import Link from "next/link";

const laserCapabilities = [
  {
    id: "metal",
    title: "Metal laser cutting",
    description:
      "Precision cutting for sheet metals with tight tolerances and clean edges.",
    highlights: [
      "Stainless steel, aluminum, mild steel, and brass support",
      "Tight tolerances for brackets, panels, and chassis",
      "Deburring and finishing options available",
    ],
  },
  {
    id: "non-metal",
    title: "Non-metal laser cutting",
    description:
      "Clean, fast cutting for plastics, acrylics, wood, and composite sheets.",
    highlights: [
      "Acrylic, polycarbonate, ABS, and plywood support",
      "Engraving and etching options for branding",
      "Ideal for enclosures, prototypes, and fixtures",
    ],
  },
];

export default function LaserCuttingPage() {
  return (
    <section className="section-container space-y-10 py-12">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
          Laser Cutting
        </p>
        <h1 className="text-3xl font-heading font-semibold text-zinc-900">
          Production-grade cutting for metal and non-metal parts
        </h1>
        <p className="text-sm text-zinc-600">
          Upload your DXF or CAD files and get expert feedback on material,
          thickness, and finish options. We handle single prototypes through
          production runs with fast turnaround times.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {laserCapabilities.map((capability) => (
          <div
            key={capability.id}
            id={capability.id}
            className="card card-static scroll-mt-28 space-y-4 p-6"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-zinc-900">
                {capability.title}
              </h2>
              <p className="text-sm text-zinc-600">
                {capability.description}
              </p>
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-600">
              {capability.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="inline-flex text-sm font-semibold text-brand-dark"
            >
              Request a laser quote -&gt;
            </Link>
          </div>
        ))}
      </div>

      <div className="card card-static flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Need help selecting a material?
          </h2>
          <p className="text-sm text-zinc-600">
            Share your requirements and our engineers will recommend the right
            process, thickness, and finish.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand hover:text-white"
        >
          Talk to an expert
        </Link>
      </div>
    </section>
  );
}
