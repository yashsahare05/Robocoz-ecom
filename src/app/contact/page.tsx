export default function ContactPage() {
  return (
    <section className="section-container space-y-8 py-12">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
          Contact
        </p>
        <h1 className="text-3xl font-heading font-semibold text-zinc-900">
          Let’s build something together
        </h1>
        <p className="text-sm text-zinc-600">
          Reach out for quotes, sourcing help, technical questions or partnership
          opportunities.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <form className="card card-static space-y-4 p-6">
          <div>
            <label className="text-sm font-medium text-zinc-700">
              Name
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                placeholder="Your name"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-zinc-700">
              Email
              <input
                type="email"
                className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
                placeholder="you@company.com"
              />
            </label>
            <label className="text-sm font-medium text-zinc-700">
              Company
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
              />
            </label>
          </div>
          <label className="text-sm font-medium text-zinc-700">
            Message
            <textarea
              rows={4}
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
            />
          </label>
          <button className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white">
            Submit
          </button>
        </form>
        <div className="card card-static space-y-4 p-6 text-sm text-zinc-600">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Sales & Support
            </p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">
              hello@electropartsfab.com
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              HQ
            </p>
            <p className="mt-1 text-base font-semibold text-zinc-900">
              456 Innovation Way, San Jose, CA
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Support hours
            </p>
            <p className="mt-1 text-base font-semibold text-zinc-900">
              Monday - Friday, 8am to 7pm PT
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

