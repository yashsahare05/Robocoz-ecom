import { ShieldCheck, Printer, Cpu, Scissors } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Printer,
    title: "3D Printing (FDM & SLA)",
    description:
      "Production-grade polymers, rapid quoting, dimensional QA reports.",
    href: "/services/3d-printing",
  },
  {
    icon: Cpu,
    title: "Custom PCB Manufacturing",
    description: "2-12 layer builds, controlled impedance and turnkey assembly.",
    href: "/services/pcb-manufacturing",
  },
  {
    icon: Scissors,
    title: "Laser Cutting",
    description: "Precision cutting for metal and non-metal sheet materials.",
    href: "/services/laser-cutting",
  },
  {
    icon: ShieldCheck,
    title: "Supply Chain Support",
    description: "Stock assurance, lifecycle management and PCN tracking.",
    href: "/about",
  },
];

export const ServicesOverview = () => (
  <section className="section-container py-16">
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark ">
          Services
        </p>
        <h2 className="section-title mt-2">
          Fabrication partners for R&amp;D through production
        </h2>
      </div>
      <Link
        href="/services"
        className="text-sm font-semibold text-brand-dark hover:underline"
      >
        Explore services →
      </Link>
    </div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 ">
      {services.map((service) => (
        <Link
          key={service.title}
          href={service.href}
          className="group card relative overflow-hidden border-2 border-zinc-200 p-6 transition-shadow duration-300 before:absolute before:inset-0 before:opacity-0 before:transition before:duration-300 before:content-[''] before:bg-gradient-to-br before:from-blue-400/30 before:via-blue-400/10 before:to-blue-400/60 hover:before:opacity-100"
        >
          <div className="relative z-10">
            <service.icon className="h-10 w-10 text-brand-dark " />
            <h3 className="mt-4 text-xl font-semibold text-zinc-900">
              {service.title}
            </h3>
            <p className="mt-3 text-sm text-zinc-600">{service.description}</p>
            <span className="mt-4 inline-flex text-sm font-semibold text-brand-dark">
              Learn more →
            </span>
          </div>
        </Link>
      ))}
    </div>
  </section>
);







