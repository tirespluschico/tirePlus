import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { notFound } from "next/navigation";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  intake: { label: "Intake", color: "text-blue-400", bg: "bg-blue-400/10" },
  in_progress: { label: "In Progress", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ready: { label: "Ready", color: "text-green-400", bg: "bg-green-400/10" },
  completed: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  picked_up: { label: "Picked Up", color: "text-brand-muted", bg: "bg-brand-muted/10" },
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .single();

  if (error || !customer) notFound();

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, vehicle:vehicles(year, make, model)")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  const allVehicles = vehicles || [];
  const allJobs = jobs || [];

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/customers"
          className="text-brand-muted text-xs hover:text-white transition-colors mb-2 inline-block"
        >
          ← Back to Customers
        </Link>
        <h1 className="text-2xl font-bold text-white">{customer.name}</h1>
      </div>

      {/* Contact info */}
      <div className="bg-brand-dark rounded-2xl border border-white/10 p-5 mb-6">
        <p className="text-brand-muted text-xs uppercase tracking-wide mb-3">
          Contact Information
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {customer.email && (
            <div>
              <p className="text-brand-muted text-xs">Email</p>
              <p className="text-white text-sm">{customer.email}</p>
            </div>
          )}
          {customer.phone && (
            <div>
              <p className="text-brand-muted text-xs">Phone</p>
              <p className="text-white text-sm">{customer.phone}</p>
            </div>
          )}
          {customer.address && (
            <div className="sm:col-span-2">
              <p className="text-brand-muted text-xs">Address</p>
              <p className="text-white text-sm">{customer.address}</p>
            </div>
          )}
        </div>
        <p className="text-brand-muted text-xs mt-4">
          Customer since {new Date(customer.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Vehicles */}
      <div className="bg-brand-dark rounded-2xl border border-white/10 p-5 mb-6">
        <p className="text-brand-muted text-xs uppercase tracking-wide mb-3">
          Vehicles ({allVehicles.length})
        </p>
        {allVehicles.length === 0 ? (
          <p className="text-brand-muted text-sm">No vehicles on file.</p>
        ) : (
          <div className="space-y-2">
            {allVehicles.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3"
              >
                <span className="text-white text-sm font-medium">
                  {v.year || ""} {v.make} {v.model}
                </span>
                {v.plate && (
                  <span className="text-brand-muted text-xs">{v.plate}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job history */}
      <div className="bg-brand-dark rounded-2xl border border-white/10 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-brand-muted text-xs uppercase tracking-wide">
            Job History ({allJobs.length})
          </p>
          <Link
            href="/admin/jobs/new"
            className="text-brand-blue-light text-xs hover:text-white transition-colors"
          >
            + New Job
          </Link>
        </div>
        {allJobs.length === 0 ? (
          <p className="text-brand-muted text-sm">No jobs yet.</p>
        ) : (
          <div className="space-y-2">
            {allJobs.map((job) => {
              const config = statusConfig[job.status] || statusConfig.intake;
              const vehicle = job.vehicle;
              return (
                <Link
                  key={job.id}
                  href={`/admin/jobs/${job.id}`}
                  className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {vehicle
                        ? `${vehicle.year || ""} ${vehicle.make} ${vehicle.model}`
                        : "No vehicle"}
                    </p>
                    {job.services && job.services.length > 0 && (
                      <p className="text-brand-muted text-xs mt-0.5">
                        {job.services.slice(0, 3).join(", ")}
                        {job.services.length > 3 && ` +${job.services.length - 3} more`}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${config.bg} ${config.color}`}
                    >
                      {config.label}
                    </span>
                    <p className="text-brand-muted text-xs mt-1">
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
