const faqs = [
  {
    question: "How fast can you turn around 3D printed parts?",
    answer:
      "Standard FDM orders ship in 2-5 business days. SLA parts typically ship within 3-7 days depending on resin type and finishing.",
  },
  {
    question: "Do you support turnkey PCB assembly?",
    answer:
      "Yes. Provide Gerbers, BOM and pick-place data. Our assembly line handles sourcing, stencil fabrication, placement and AOI/X-ray inspection.",
  },
  {
    question: "Can I use my own carrier for shipping?",
    answer:
      "Absolutely. Provide your carrier account number and preferred service level at checkout or via your account portal.",
  },
];

export default function FaqPage() {
  return (
    <section className="section-container py-12">
      <h1 className="text-3xl font-heading font-semibold text-zinc-900">
        Frequently asked questions
      </h1>
      <div className="mt-8 divide-y divide-zinc-100">
        {faqs.map((faq) => (
          <div key={faq.question} className="py-6">
            <p className="text-lg font-semibold text-zinc-900">
              {faq.question}
            </p>
            <p className="mt-2 text-sm text-zinc-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

