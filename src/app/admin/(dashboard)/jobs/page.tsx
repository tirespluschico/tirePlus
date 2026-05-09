import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { JobStatus } from "@/lib/supabase/types";

const statusConfig: Record<JobStatus, { label: string; dot: string; text: string }> = {
  intake: { label: "Awaiting inspection", dot: "bg-amber-400", text: "text-amber-300" },
  in_progress: { label: "In progress", dot: "bg-blue-400", text: "text-blue-300" },
  ready: { label: "Ready", dot: "bg-green-500", text: "text-green-300" },
  completed: { label: "Completed", dot: "bg-brand-muted", text: "text-brand-muted" },
  picked_up: { label: "Picked up", dot: "bg-brand-muted", text: "text-brand-muted" },
};

type JobRow = {
  id: string;
  status: string;
  created_at: string;
  services: unknown;
  customer: { name: string } | null;
  vehicle: { year: number; make: string; model: string } | null;
};

const groups: { key: string; title: string; statuses: JobStatus[] }[] = [
  { key: "intake", title: "Awaiting intake", statuses: ["intake"] },
  { key: "in_progress", title: "In progress", statuses: ["in_progress", "ready"] },
  { key: "completed", title: "Completed jobs", statuses: ["completed", "picked_up"] },
];

function JobsTable({ jobs }: { jobs: JobRow[] }) {
  return (
    <div className="overflow-x-auto border border-white/10 rounded">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5 text-left text-xs text-brand-muted">
            <th className="px-4 py-2 font-medium">Customer</th>
            <th className="px-4 py-2 font-medium">Vehicle</th>
            <th className="px-4 py-2 font-medium">Services</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium text-right">Date</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const config = statusConfig[job.status as JobStatus];
            const services = Array.isArray(job.services) ? (job.services as string[]) : [];

            return (
              <tr
                key={job.id}
                className="border-t border-white/10 hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-2.5">
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="text-white hover:text-brand-red font-medium"
                  >
                    {job.customer?.name || "Unknown"}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-brand-muted">
                  {job.vehicle
                    ? `${job.vehicle.year || ""} ${job.vehicle.make} ${job.vehicle.model}`.trim()
                    : "—"}
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
  );
}

export default async function JobsPage() {
  const { data: jobs } = await supabase
    .from("jobs")
    .select(
      "id, status, created_at, services, customer:customers(name), vehicle:vehicles(year, make, model)"
    )
    .order("created_at", { ascending: false });

  const allJobs = ((jobs as unknown as JobRow[]) || []);

  const grouped = groups.map((g) => ({
    ...g,
    jobs: allJobs.filter((j) => g.statuses.includes(j.status as JobStatus)),
  }));

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-lg font-semibold text-white">Jobs</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            {allJobs.length} total
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="bg-brand-red hover:bg-brand-red-hover text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
        >
          New job
        </Link>
      </div>

      {allJobs.length === 0 ? (
        <div className="border border-white/10 rounded p-12 text-center">
          <p className="text-brand-muted text-sm">No jobs yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map((g) => (
            <section key={g.key}>
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="text-sm font-semibold text-white">{g.title}</h2>
                <span className="text-xs text-brand-muted">{g.jobs.length}</span>
              </div>
              {g.jobs.length === 0 ? (
                <div className="border border-white/10 rounded p-6 text-center">
                  <p className="text-brand-muted text-xs">None.</p>
                </div>
              ) : (
                <JobsTable jobs={g.jobs} />
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
