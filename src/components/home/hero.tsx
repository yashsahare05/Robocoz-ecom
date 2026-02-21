import Link from "next/link";
import { BoltIcon } from "@heroicons/react/24/outline";
import { HeroSlideshow } from "./hero-slideshow";

export const Hero = () => {
  const ctas = [
    { label: "Shop Electronic Components", 
      href: "/shop", 
      image: "/images/homepage/categories/compoments.png",
    },

    { label: "Custom PCB Manufacturing", 
      href: "/services/pcb-manufacturing",
      image: "/images/homepage/categories/pcb-board.png",
     },

    {
      label: "FDM - 3D Printing Services",
      href: "/services/3d-printing#fdm",
      image: "/images/homepage/categories/printing-fdm.png",
    },
    { label: "SLA - 3D Printing Services", 
      href: "/services/3d-printing#sla" ,
      image: "/images/homepage/categories/3d-printer.png",

    },
    
    { label: "Metal Laser Cutting Services", 
      href: "/services/laser-cutting#metal",
      image: "/images/homepage/categories/laser-cutting-metal.png",
    
    },
    
    {
      label: "Non-Metal Laser Cutting Services",
      href: "/services/laser-cutting#non-metal",
      image: "/images/homepage/categories/laser-cutting-machine.png",
    },
  ];

  return (
    <section className=" section-container relative grid gap-8 overflow-hidden pt-10 pb-16 lg:grid-cols-2 lg:items-start">
      
      <div className="relative z-10 space-y-6 lg:order-2">
        <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 px-4 py-1 text-sm font-semibold text-brand-dark">
          <BoltIcon className="h-4 w-4" />
          Rapid electronics supply & fabrication
        </p>
        <h1 className="text-4xl font-heading font-bold text-zinc-900 sm:text-5xl">
          Components, 3D printing & PCB manufacturing from one trusted partner.
        </h1>
        <p className="text-lg text-zinc-600">
          Robocoz combines a curated component catalog with precision
          fabrication services so engineering teams can iterate faster and build
          with confidence.
        </p>
        <div className="grid gap-6 sm:grid-cols-3 ">
          {ctas.map((cta) => (
            <Link
              key={cta.label}
              href={cta.href}
              className="flex flex-col gap-4 overflow-hidden rounded-2xl border-2 border-zinc-200 bg-white px-4 py-4 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-brand hover:text-brand-dark"
            >
              {cta.image ? (
                <div className=" rounded-xl bg-gradient-to-br from-orange-300 via-orange-500 to-orange-300 p-2">
                  <img
                    src={cta.image}
                    alt={`${cta.label} service`}
                    className="h-full w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}
              {cta.label}
            </Link>
          ))}
        </div>
      </div>
      {/* Slideshow banner */}

      <div className="relative z-10 space-y-6 lg:order-1">
        <HeroSlideshow />
        <div className="grid gap-6 sm:grid-cols-2 ">
          <HeroSlideshow
            slides={[
              {
                eyebrow: "Lab Ready",
                title: "Prototype kits curated for fast iteration.",
                subtitle: "",
                imageSrc: "/images/hero/slideshow2/lab-ready.jpg",
                imageAlt: "Lab-ready prototyping equipment",
              },
              {
                eyebrow: "Quality",
                title: "Tested inventory with verified datasheets.",
                subtitle: "",
                imageSrc: "/images/hero/slideshow2/quality.jpg",
                imageAlt: "Quality inspection setup",
              },
              {
                eyebrow: "Support",
                title: "Engineers on call for BOM and sourcing help.",
                subtitle: "",
                imageSrc: "/images/hero/slideshow2/support.jpg",
                imageAlt: "Engineering support collaboration",
              },
            ]}
          />
          <HeroSlideshow
            slides={[
              {
                eyebrow: "Logistics",
                title: "Same-day dispatch on stocked items.",
                subtitle: "",
                imageSrc: "/images/hero/slideshow3/logistics.jpg",
                imageAlt: "Logistics and fulfillment workflow",
              },
              {
                eyebrow: "Finishes",
                title: "Surface treatments and post-processing included.",
                subtitle: "",
                imageSrc: "/images/hero/slideshow3/finishes.jpg",
                imageAlt: "Surface finishing process",
              },
              {
                eyebrow: "Assembly",
                title: "Turnkey PCB assembly with final QA.",
                subtitle: "",
                imageSrc: "/images/hero/slideshow3/assembly.jpg",
                imageAlt: "PCB assembly station",
              },
            ]}
          />
        </div>
        <div className="card bg-gradient-to-br p-8 border-2 border-zinc-300" >
          <ul className="space-y-6">
            {[
              { label: "In-stock SKUs", value: "12,800+" },
              { label: "3D print parts delivered", value: "25,000+" },
              { label: "PCB projects completed", value: "4,200+" },
            ].map((stat) => (
              <li
                key={stat.label}
                className="flex items-baseline justify-between"
              >
                <span className="text-sm uppercase tracking-wide text-zinc-700">
                  {stat.label}
                </span>
                <span className="text-3xl font-bold text-zinc-900">
                  {stat.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
