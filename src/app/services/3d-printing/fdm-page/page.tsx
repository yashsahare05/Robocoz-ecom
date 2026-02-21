import { PrintingQuoteForm } from "@/components/forms/printing-form";
import { StlViewer } from "@/components/StlViewer";
import { printingMaterials, leadTimeEstimates } from "@/lib/constants";

export default function PrintingServicesPage() {
  return (
    <section className="section-container space-y-10 py-12">
      <StlViewer />
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
          3D Printing Services
        </p>
        <h1 className="text-3xl font-heading font-semibold text-zinc-900">
          Production-grade FDM printing
        </h1>
        <p className="text-sm text-zinc-600">
          Upload STL/OBJ files, pick materials, specify performance needs and
          receive instant estimates. All parts include inspection reports,
          post-processing options and serialized tracking.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.25fr,0.75fr]">
        <PrintingQuoteForm />
        <div className="space-y-6">
          <div className="card card-static p-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              Material options
            </h2>
            <ul className="mt-4 space-y-4 text-sm text-zinc-600">
              {printingMaterials.map((material) => (
                <li key={material.id}>
                  <p className="flex items-center justify-between font-semibold text-zinc-900">
                    <span>{material.name}</span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      {material.technology}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-500">
                    Colors: {material.colorOptions.join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="card card-static p-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              Lead time guidance
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {Object.entries(leadTimeEstimates).map(([key, value]) => (
                <li key={key} className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-900">{key}</span>
                  <span className="text-zinc-500">
                    {value.min}-{value.max} business days
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
