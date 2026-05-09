import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { JobStatus } from "@/lib/supabase/types";
import StartIntakeButton from "@/components/admin/StartIntakeButton";

const statusConfig: Record<
  JobStatus,
  { label: string; color: string; bg: string }
> = {
  intake: { label: "Intake", color: "text-blue-400", bg: "bg-blue-400/10" },
  in_progress: {
    label: "In Progress",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  ready: { label: "Ready", color: "text-green-400", bg: "bg-green-400/10" },
  completed: {
    label: "Completed",
    color: "text-brand-muted",
    bg: "bg-brand-muted/10",
  },
  picked_up: {
    label: "Picked Up",
    color: "text-brand-muted",
    bg: "bg-brand-muted/10",
  },
};

export default async function AdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, status, created_at, services, customer:customers(name), vehicle:vehicles(year, make, model)")
    .in("status", ["intake", "in_progress", "ready"])
    .order("created_at", { ascending: false });

  const { count: totalCustomers } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true });

  const activeJobs = jobs || [];

  const jobsByStatus = activeJobs.reduce(
    (acc, job) => {
      const status = job.status as JobStatus;
      if (!acc[status]) acc[status] = [];
      acc[status].push(job);
      return acc;
    },
    {} as Record<string, typeof activeJobs>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-brand-muted text-sm mt-1">
          Overview of active jobs and shop status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {(["intake", "in_progress", "ready"] as JobStatus[]).map((status) => {
          const config = statusConfig[status];
          const count = jobsByStatus[status]?.length || 0;
          return (
            <div
              key={status}
              className="bg-brand-dark rounded-2xl border border-white/10 p-5"
            >
              <p className="text-brand-muted text-xs font-semibold uppercase tracking-wide mb-1">
                {config.label}
              </p>
              <p className={`text-3xl font-bold ${config.color}`}>{count}</p>
            </div>
          );
        })}
        <div className="bg-brand-dark rounded-2xl border border-white/10 p-5">
          <p className="text-brand-muted text-xs font-semibold uppercase tracking-wide mb-1">
            Total Customers
          </p>
          <p className="text-3xl font-bold text-white">{totalCustomers || 0}</p>
        </div>
      </div>

      {/* Active Jobs */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Active Jobs</h2>
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

      {activeJobs.length === 0 ? (
        <div className="bg-brand-dark rounded-2xl border border-white/10 p-12 text-center">
          <p className="text-brand-muted">No active jobs yet.</p>
          <Link
            href="/admin/jobs/new"
            className="inline-block mt-4 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Create First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {activeJobs.map((job) => {
            const config = statusConfig[job.status as JobStatus];
            const customer = job.customer as unknown as { name: string } | null;
            const vehicle = job.vehicle as unknown as {
              year: number;
              make: string;
              model: string;
            } | null;

            return (
              <Link
                key={job.id}
                href={`/admin/jobs/${job.id}`}
                className="block bg-brand-dark rounded-2xl border border-white/10 p-5 hover:border-brand-red/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">
                      {customer?.name || "Unknown Customer"}
                    </p>
                    <p className="text-brand-muted text-sm">
                      {vehicle
                        ? `${vehicle.year || ""} ${vehicle.make} ${vehicle.model}`
                        : "No vehicle"}
                    </p>
                    {job.services && (job.services as string[]).length > 0 && (
                      <p className="text-brand-blue-light text-xs mt-1">
                        {(job.services as string[]).join(", ")}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${config.bg} ${config.color}`}
                  >
                    {config.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
