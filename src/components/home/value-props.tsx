const reasons = [
  {
    title: "Engineering-first support",
    description:
      "Application engineers ready to review BOMs, recommend alternates and advise on DFM.",
  },
  {
    title: "Integrated fulfillment",
    description:
      "Single checkout covers components, 3D printed fixtures and PCB builds with unified tracking.",
  },
  {
    title: "Quality baked-in",
    description:
      "IPC-compliant fabrication partners, incoming inspection and serialized lot tracking.",
  },
];

export const WhyChooseUs = () => (
  <section className="section-container py-16">
    <div className="rounded-3xl bg-gradient-to-tr bg-blue-200 px-8 py-12 text-white">
      <h2 className="text-3xl font-heading font-semibold">
        Built for hardware teams who can’t compromise on quality.
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className="card card-static relative overflow-hidden p-6 !bg-blue-400/70 !border-blue-400 text-white transition-colors hover:!bg-blue-400"
          >
            <div className="relative z-10">
              <p className="text-lg font-semibold">{reason.title}</p>
              <p className="mt-2 text-sm text-white/80">
                {reason.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

