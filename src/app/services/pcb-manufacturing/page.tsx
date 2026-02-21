import { PcbQuoteForm } from "@/components/forms/pcb-form";
import {
  pcbFinishes,
  solderMaskColors,
  silkscreenColors,
} from "@/lib/constants";

export default function PcbManufacturingPage() {
  return (
    <section className="section-container space-y-10 py-12">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
          Custom PCB Manufacturing
        </p>
        <h1 className="text-3xl font-heading font-semibold text-zinc-900">
          Stack-ups engineered for production
        </h1>
        <p className="text-sm text-zinc-600">
          Specify board geometry, layer counts, copper weight, solder mask,
          finish, lead time and assembly needs. Upload Gerbers or zipped design
          packages to receive rapid DFM feedback and pricing.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.25fr,0.75fr]">
        <PcbQuoteForm />
        <div className="space-y-6">
          <div className="card card-static p-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              Capability snapshot
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              <li>• 2-12 layer standard builds (higher on request)</li>
              <li>• Controlled impedance & stack-up documentation</li>
              <li>• ENIG, HASL, immersion tin, OSP finishes</li>
              <li>• Lead-free assembly with X-ray inspection</li>
            </ul>
          </div>
          <div className="card card-static p-6 space-y-4 text-sm text-zinc-600">
            <div>
              <p className="font-semibold text-zinc-900">Finishes</p>
              <p>{pcbFinishes.map((finish) => finish.label).join(", ")}</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-900">Solder mask colors</p>
              <p>{solderMaskColors.join(", ")}</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-900">Silkscreen colors</p>
              <p>{silkscreenColors.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

