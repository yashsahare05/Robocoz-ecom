export default function PrivacyPage() {
  return (
    <section className="section-container space-y-6 py-12">
      <h1 className="text-3xl font-heading font-semibold text-zinc-900">
        Privacy Policy
      </h1>
      <p className="text-sm text-zinc-600">
        We collect account details, order history, uploaded design files and
        communications solely to deliver services. We never sell personal data
        and limit access to customer files to authorized staff.
      </p>
      <div className="space-y-4 text-sm text-zinc-600">
        <div className="card p-5">
          <p className="text-lg font-semibold text-zinc-900">
            Data collection
          </p>
          <p className="mt-2">
            We store contact info, addresses, payment references (via Stripe),
            uploaded fabrication files and service metadata. Files may be
            retained for reorders unless removal is requested.
          </p>
        </div>
        <div className="card p-5">
          <p className="text-lg font-semibold text-zinc-900">Security</p>
          <p className="mt-2">
            Access controls, encryption in transit and audit logging protect
            your information. Contact privacy@robocoz.com for data requests.
          </p>
        </div>
      </div>
    </section>
  );
}

