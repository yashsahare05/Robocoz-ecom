export default function NotificationSettingsPage() {
  return (
    <section className="section-container space-y-6 py-12">
      <h1 className="text-3xl font-heading font-semibold text-zinc-900">
        Notifications
      </h1>
      <div className="card p-6 space-y-4">
        {[
          { label: "Order updates", description: "Shipping, delivery, delays" },
          { label: "Quote status", description: "3D print & PCB quote updates" },
          { label: "Marketing", description: "Product launches and offers" },
        ].map((item) => (
          <label
            key={item.label}
            className="flex items-center justify-between gap-4 text-sm text-zinc-600"
          >
            <div>
              <p className="font-semibold text-zinc-900">{item.label}</p>
              <p>{item.description}</p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-zinc-300 text-brand focus:ring-brand"
            />
          </label>
        ))}
      </div>
    </section>
  );
}

