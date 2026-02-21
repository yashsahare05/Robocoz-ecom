const mockOrders = [
  {
    id: "100045",
    status: "Processing",
    total: "$1,240.00",
    items: 8,
  },
  {
    id: "100044",
    status: "Delivered",
    total: "$312.50",
    items: 3,
  },
];

export const AccountOverview = () => (
  <div className="space-y-8">
    <section className="card p-6">
      <h2 className="text-lg font-semibold text-zinc-900">Profile</h2>
      <div className="mt-4 grid gap-4 text-sm text-zinc-600 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Name</p>
          <p className="mt-1 text-base font-semibold text-zinc-900">
            Riley Thompson
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Company</p>
          <p className="mt-1 text-base font-semibold text-zinc-900">
            Volt Robotics
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Email</p>
          <p className="mt-1 text-base font-semibold text-zinc-900">
            riley@voltrobotics.com
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Phone
          </p>
          <p className="mt-1 text-base font-semibold text-zinc-900">
            +1 (555) 210-0045
          </p>
        </div>
      </div>
    </section>
    <section className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Orders</h2>
        <a className="text-sm font-semibold text-brand-dark" href="/account/orders">
          View all →
        </a>
      </div>
      <div className="mt-4 divide-y divide-zinc-100">
        {mockOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Order #{order.id}
              </p>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                {order.items} items
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-900">
                {order.total}
              </p>
              <p className="text-xs uppercase tracking-wide text-brand-dark">
                {order.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

