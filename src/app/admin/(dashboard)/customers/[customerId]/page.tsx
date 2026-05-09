import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import type { JobStatus } from "@/lib/supabase/types";
import AddVehicleForm from "@/components/admin/AddVehicleForm";

const statusConfig: Record<JobStatus, { label: string; dot: string; text: string }> = {
  intake: { label: "Awaiting inspection", dot: "bg-amber-400", text: "text-amber-300" },
  in_progress: { label: "In progress", dot: "bg-blue-400", text: "text-blue-300" },
  ready: { label: "Ready", dot: "bg-green-500", text: "text-green-300" },
  completed: { label: "Completed", dot: "bg-brand-muted", text: "text-brand-muted" },
  picked_up: { label: "Picked up", dot: "bg-brand-muted", text: "text-brand-muted" },
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
    <div>
      <Link
        href="/admin/customers"
        className="text-brand-muted text-xs hover:text-white transition-colors mb-3 inline-block"
      >
        ← Back to customers
      </Link>

      <div className="flex items-center justify-between gap-4 mb-1">
        <h1 className="text-xl font-semibold text-white">{customer.name}</h1>
        <Link
          href={`/admin/jobs/new?customerId=${customer.id}`}
          className="bg-brand-red hover:bg-brand-red-hover text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
        >
          New job
        </Link>
      </div>
      <p className="text-brand-muted text-sm mb-5">
        Customer since {new Date(customer.created_at).toLocaleDateString()}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="border border-white/10 rounded p-3">
          <p className="text-xs text-brand-muted mb-1">Email</p>
          <p className="text-white text-sm">{customer.email || "—"}</p>
        </div>
        <div className="border border-white/10 rounded p-3">
          <p className="text-xs text-brand-muted mb-1">Phone</p>
          <p className="text-white text-sm">{customer.phone || "—"}</p>
        </div>
        <div className="border border-white/10 rounded p-3">
          <p className="text-xs text-brand-muted mb-1">Address</p>
          <p className="text-white text-sm">{customer.address || "—"}</p>
        </div>
      </div>

      {/* Vehicles */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-white">
            Vehicles ({allVehicles.length})
          </h2>
          <AddVehicleForm customerId={customer.id} />
        </div>
        {allVehicles.length === 0 ? (
          <div className="border border-white/10 rounded p-4 text-brand-muted text-sm">
            No vehicles on file.
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-xs text-brand-muted">
                  <th className="px-4 py-2 font-medium">Vehicle</th>
                  <th className="px-4 py-2 font-medium text-right">Plate</th>
                </tr>
              </thead>
              <tbody>
                {allVehicles.map((v) => (
                  <tr key={v.id} className="border-t border-white/10">
                    <td className="px-4 py-2.5 text-white">
                      {v.year || ""} {v.make} {v.model}
                    </td>
                    <td className="px-4 py-2.5 text-brand-muted text-right">
                      {v.plate || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Job history */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-2">
          Job history ({allJobs.length})
        </h2>
        {allJobs.length === 0 ? (
          <div className="border border-white/10 rounded p-4 text-brand-muted text-sm">
            No jobs yet.
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-xs text-brand-muted">
                  <th className="px-4 py-2 font-medium">Vehicle</th>
                  <th className="px-4 py-2 font-medium">Services</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {allJobs.map((job) => {
                  const config =
                    statusConfig[job.status as JobStatus] || statusConfig.intake;
                  const services = (job.services as string[]) || [];
                  return (
                    <tr
                      key={job.id}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-2.5">
                        <Link
                          href={`/admin/jobs/${job.id}`}
                          className="text-white hover:text-brand-red"
                        >
                          {job.vehicle
                            ? `${job.vehicle.year || ""} ${job.vehicle.make} ${job.vehicle.model}`
                            : "No vehicle"}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-brand-muted max-w-xs truncate">
                        {services.length > 0 ? services.join(", ") : "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1.5 ${config.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-brand-muted text-right whitespace-nowrap">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
