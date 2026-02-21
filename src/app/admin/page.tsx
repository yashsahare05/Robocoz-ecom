import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminGuard } from "@/components/admin/admin-guard";
import { getCatalogData } from "@/lib/supabase/catalog";

export default async function AdminPage() {
  const { categories, brands, products } = await getCatalogData();
  return (
    <AdminGuard>
      <section className="section-container space-y-6 py-12">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-dark">
            Admin
          </p>
          <h1 className="text-3xl font-heading font-semibold text-zinc-900">
            Operations overview
          </h1>
          <p className="text-sm text-zinc-600">
            Restricted to admin users. Manage products, service orders, customers
            and CMS content.
          </p>
        </div>
        <AdminDashboard
          categories={categories}
          brands={brands}
          products={products}
        />
      </section>
    </AdminGuard>
  );
}

