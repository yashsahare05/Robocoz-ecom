import Link from "next/link";

const services = [
  {
    title: "3D Printing (FDM & SLA)",
    description: "Industrial-grade polymers, instant quoting, QA reporting.",
    href: "/services/3d-printing",
  },
  {
    title: "Custom PCB Manufacturing",
    description: "2-12 layers, controlled impedance, turnkey assembly.",
    href: "/services/pcb-manufacturing",
  },
  {
    title: "Laser Cutting",
    description: "Metal and non-metal cutting, fast turnaround, clean edges.",
    href: "/services/laser-cutting",
  },
  {
    title: "Supply Chain Programs",
    description: "BOM lifecycle monitoring, bonded inventory and forecasting.",
    href: "/contact",
  },
];

export default function ServicesPage() {
  return (
    <section className="section-container py-12">
      <p className="text-sm uppercase tracking-wide text-brand-dark">Services</p>
      <h1 className="text-3xl font-heading font-semibold text-zinc-900">
        Integrated fabrication & supply chain support
      </h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <Link key={service.title} href={service.href} className="card p-6">
            <h2 className="text-xl font-semibold text-zinc-900">
              {service.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-600">{service.description}</p>
            <span className="mt-4 inline-flex text-sm font-semibold text-brand-dark">
              Learn more →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

