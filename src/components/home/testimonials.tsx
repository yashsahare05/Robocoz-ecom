import { testimonials } from "@/data/sample-data";

export const Testimonials = () => (
  <section className="section-container py-16">
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
        Why teams choose us
      </p>
    </div>
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      {testimonials.map((testimonial) => (
        <div key={testimonial.company} className="card p-6 border-2 border-zinc-200">
          <p className="text-lg text-zinc-700">“{testimonial.feedback}”</p>
          <div className="mt-4 text-sm text-zinc-500">
            <p className="font-semibold text-zinc-900">{testimonial.name}</p>
            <p>
              {testimonial.role}, {testimonial.company}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

