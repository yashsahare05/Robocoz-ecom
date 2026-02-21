import { AccountOverview } from "@/components/account/account-overview";

export default function AccountPage() {
  return (
    <section className="section-container space-y-6 py-12">
      <div>
        <p className="text-sm uppercase tracking-wide text-brand-dark">
          Account
        </p>
        <h1 className="text-3xl font-heading font-semibold text-zinc-900">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-600">
          Manage orders, download fabrication files, update addresses and review
          saved quotes.
        </p>
      </div>
      <AccountOverview />
    </section>
  );
}

