import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import StartIntakeButton from "@/components/admin/StartIntakeButton";
import CustomersList from "@/components/admin/CustomersList";

export default async function CustomersPage() {
  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, email, phone, created_at, vehicles(id), jobs(id)")
    .order("created_at", { ascending: false });

  const allCustomers = (customers || []).map((c) => ({
    ...c,
    vehicles: c.vehicles || [],
    jobs: c.jobs || [],
  }));

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-lg font-semibold text-white">Customers</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            {allCustomers.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StartIntakeButton />
          <Link
            href="/admin/jobs/new"
            className="bg-brand-red hover:bg-brand-red-hover text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
          >
            New job
          </Link>
        </div>
      </div>

      <CustomersList initialCustomers={allCustomers} />
    </div>
  );
}
