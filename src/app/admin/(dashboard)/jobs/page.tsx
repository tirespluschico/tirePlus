import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { JobStatus } from "@/lib/supabase/types";

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

export default async function JobsPage() {
  const { data: jobs } = await supabase
    .from("jobs")
    .select(
      "id, status, created_at, services, customer:customers(name), vehicle:vehicles(year, make, model)"
    )
    .order("created_at", { ascending: false });

  const allJobs = jobs || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Jobs</h1>
          <p className="text-brand-muted text-sm mt-1">
            All jobs across every status
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="bg-brand-red hover:bg-brand-red-hover text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          + New Job
        </Link>
      </div>

      {allJobs.length === 0 ? (
        <div className="bg-brand-dark rounded-2xl border border-white/10 p-12 text-center">
          <p className="text-brand-muted">No jobs yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allJobs.map((job) => {
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
