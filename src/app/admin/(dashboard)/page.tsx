import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { JobStatus } from "@/lib/supabase/types";
import ActiveJobsList from "@/components/admin/ActiveJobsList";
import StartIntakeButton from "@/components/admin/StartIntakeButton";

export default async function AdminDashboard() {
  const { data: jobs } = await supabase
    .from("jobs")
    .select(
      "id, status, created_at, services, customer:customers(name), vehicle:vehicles(year, make, model), parts:job_parts(status)"
    )
    .neq("status", "picked_up")
    .order("created_at", { ascending: false });

  const activeJobs = jobs || [];

  const counts = activeJobs.reduce(
    (acc, job) => {
      const status = job.status as JobStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const summary = [
    counts.intake ? `${counts.intake} awaiting inspection` : null,
    counts.in_progress ? `${counts.in_progress} in progress` : null,
    counts.ready ? `${counts.ready} ready` : null,
    counts.completed ? `${counts.completed} completed` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-lg font-semibold text-white">Active jobs</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            {activeJobs.length} total{summary ? ` · ${summary}` : ""}
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

      <ActiveJobsList
        initialJobs={activeJobs.map((job) => ({
          id: job.id,
          status: job.status,
          created_at: job.created_at,
          services: job.services,
          customer: job.customer as unknown as { name: string } | null,
          vehicle: job.vehicle as unknown as {
            year: number;
            make: string;
            model: string;
          } | null,
          parts: (job.parts as unknown as { status: string }[]) || [],
        }))}
      />
    </div>
  );
}
