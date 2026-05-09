"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JobStatus } from "@/lib/supabase/types";
import { getBrowserSupabase } from "@/lib/supabase/browser";

const PLACEHOLDER_NAME = "Awaiting Intake";

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
  parts?: { status: string }[];
};

function partsSummary(parts: { status: string }[] | undefined) {
  if (!parts || parts.length === 0) {
    return { label: "N/A", text: "text-brand-muted/60", dot: null };
  }
  const needed = parts.filter((p) => p.status === "needed").length;
  const ordered = parts.filter((p) => p.status === "ordered").length;
  const inStock = parts.filter((p) => p.status === "in_stock").length;

  if (needed > 0) {
    return {
      label: `${needed} to order`,
      text: "text-red-300",
      dot: "bg-red-500",
    };
  }
  if (ordered > 0 && inStock === 0) {
    return { label: "All ordered", text: "text-amber-300", dot: "bg-amber-400" };
  }
  if (inStock > 0 && ordered === 0) {
    return { label: "All in stock", text: "text-green-300", dot: "bg-green-500" };
  }
  // mix of ordered + in stock, none needed
  return {
    label: `${ordered} ordered · ${inStock} in stock`,
    text: "text-amber-300",
    dot: "bg-amber-400",
  };
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ActiveJobsList({
  initialJobs,
}: {
  initialJobs: JobRow[];
}) {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmJob, setConfirmJob] = useState<{
    id: string;
    customerName: string;
    requireNameMatch: boolean;
  } | null>(null);
  const [typedName, setTypedName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function openConfirm(job: JobRow) {
    const customerName = job.customer?.name?.trim() || "";
    setConfirmJob({
      id: job.id,
      customerName,
      // require typed-name match for jobs that have moved past intake
      requireNameMatch: job.status === "in_progress" && customerName.length > 0,
    });
    setTypedName("");
  }

  function closeConfirm() {
    setConfirmJob(null);
    setTypedName("");
  }

  async function confirmDelete() {
    if (!confirmJob) return;
    if (
      confirmJob.requireNameMatch &&
      typedName.trim() !== confirmJob.customerName
    ) {
      return;
    }
    const jobId = confirmJob.id;
    setDeletingId(jobId);
    closeConfirm();
    const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      setErrorMsg("Failed to delete job.");
    }
    setDeletingId(null);
  }

  const deleteEnabled =
    !!confirmJob &&
    (!confirmJob.requireNameMatch ||
      typedName.trim() === confirmJob.customerName);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel("dashboard-jobs")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "jobs" },
        () => router.refresh()
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "jobs" },
        (payload) => {
          const oldRow = payload.old as { vehicle_id?: string | null };
          const newRow = payload.new as { vehicle_id?: string | null };
          router.refresh();
          if (!oldRow.vehicle_id && newRow.vehicle_id) {
            setToast("Customer just completed intake");
            setTimeout(() => setToast(null), 6000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  if (initialJobs.length === 0) {
    return (
      <div className="border border-white/10 rounded p-12 text-center">
        <p className="text-brand-muted text-sm">No active jobs.</p>
        <Link
          href="/admin/jobs/new"
          className="inline-block mt-4 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
        >
          Create first job
        </Link>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-brand-dark border border-brand-red/50 text-white px-4 py-3 rounded shadow-xl max-w-sm">
          <p className="text-sm">{toast}</p>
        </div>
      )}

      {confirmJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeConfirm}
        >
          <div
            className="bg-brand-dark border border-white/10 rounded-md shadow-2xl w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white">Delete job?</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-brand-muted">
                This permanently removes the job. This cannot be undone.
              </p>
              {confirmJob.requireNameMatch && (
                <div className="space-y-2">
                  <p className="text-xs text-brand-muted">
                    To confirm, type the customer&apos;s name:{" "}
                    <span className="text-white font-medium">
                      {confirmJob.customerName}
                    </span>
                  </p>
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && deleteEnabled) {
                        e.preventDefault();
                        confirmDelete();
                      }
                    }}
                    autoFocus
                    placeholder="Customer name"
                    className="w-full bg-black/30 border border-white/10 focus:border-white/30 focus:outline-none rounded px-3 py-2 text-sm text-white placeholder:text-brand-muted/40"
                  />
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeConfirm}
                className="text-sm text-brand-muted hover:text-white px-3 py-1.5 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={!deleteEnabled}
                className="bg-brand-red hover:bg-brand-red-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setErrorMsg(null)}
        >
          <div
            className="bg-brand-dark border border-white/10 rounded-md shadow-2xl w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white">Error</h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-brand-muted">{errorMsg}</p>
            </div>
            <div className="px-5 py-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="bg-brand-red hover:bg-brand-red-hover text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-white/10 rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-left text-xs text-brand-muted">
              <th className="px-4 py-2 font-medium">Customer</th>
              <th className="px-4 py-2 font-medium">Vehicle</th>
              <th className="px-4 py-2 font-medium">Services</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Parts</th>
              <th className="px-4 py-2 font-medium text-right">Opened</th>
              <th className="px-4 py-2 font-medium text-right w-10"></th>
            </tr>
          </thead>
          <tbody>
            {initialJobs.map((job) => {
              const config = statusConfig[job.status as JobStatus];
              const services = Array.isArray(job.services)
                ? (job.services as string[])
                : [];
              const isPlaceholder = job.customer?.name === PLACEHOLDER_NAME;

              return (
                <tr
                  key={job.id}
                  className="border-t border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/jobs/${job.id}`)}
                >
                  <td className="px-4 py-3">
                    {isPlaceholder ? (
                      <span className="text-brand-muted italic">
                        Awaiting customer info…
                      </span>
                    ) : (
                      <Link
                        href={`/admin/jobs/${job.id}`}
                        className="text-white hover:text-brand-red font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {job.customer?.name || "Unknown"}
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3 text-brand-muted">
                    {job.vehicle
                      ? `${job.vehicle.year || ""} ${job.vehicle.make} ${job.vehicle.model}`.trim()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-brand-muted max-w-xs truncate">
                    {services.length > 0 ? services.join(", ") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 ${config.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {(() => {
                      const summary = partsSummary(job.parts);
                      return (
                        <span className={`inline-flex items-center gap-1.5 ${summary.text}`}>
                          {summary.dot && (
                            <span className={`w-1.5 h-1.5 rounded-full ${summary.dot}`} />
                          )}
                          {summary.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3 text-brand-muted text-right whitespace-nowrap">
                    {relativeTime(job.created_at)}
                  </td>
                  <td className="px-2 py-3 text-right">
                    {(job.status === "intake" || job.status === "in_progress") && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openConfirm(job);
                        }}
                        disabled={deletingId === job.id}
                        className="text-brand-muted hover:text-red-400 disabled:opacity-40 text-xs px-2 py-1 rounded transition-colors"
                        title="Delete job"
                      >
                        {deletingId === job.id ? "…" : "Delete"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
