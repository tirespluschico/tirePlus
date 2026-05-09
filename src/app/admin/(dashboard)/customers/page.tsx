import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import StartIntakeButton from "@/components/admin/StartIntakeButton";

export default async function CustomersPage() {
  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, email, phone, created_at")
    .order("created_at", { ascending: false });

  const allCustomers = customers || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-brand-muted text-sm mt-1">
            {allCustomers.length} total customers
          </p>
        </div>
        <div className="flex gap-3">
          <StartIntakeButton />
          <Link
            href="/admin/jobs/new"
            className="bg-brand-red hover:bg-brand-red-hover text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            + New Job
          </Link>
        </div>
      </div>

      {allCustomers.length === 0 ? (
        <div className="bg-brand-dark rounded-2xl border border-white/10 p-12 text-center">
          <p className="text-brand-muted">No customers yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allCustomers.map((customer) => (
            <Link
              key={customer.id}
              href={`/admin/customers/${customer.id}`}
              className="block bg-brand-dark rounded-2xl border border-white/10 p-5 hover:border-brand-red/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{customer.name}</p>
                  <div className="flex gap-4 mt-1">
                    {customer.email && (
                      <p className="text-brand-muted text-sm">
                        {customer.email}
                      </p>
                    )}
                    {customer.phone && (
                      <p className="text-brand-muted text-sm">
                        {customer.phone}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-brand-muted text-xs">
                  {new Date(customer.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
