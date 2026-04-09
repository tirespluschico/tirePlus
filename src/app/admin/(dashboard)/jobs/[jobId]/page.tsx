"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import InspectionEditor from "@/components/admin/InspectionEditor";
import InspectionView from "@/components/admin/InspectionView";
import type { JobStatus, InspectionStatus } from "@/lib/supabase/types";

interface JobData {
  id: string;
  status: JobStatus;
  services: string[];
  notes: string | null;
  notified_at: string | null;
  completed_at: string | null;
  review_sent_at: string | null;
  created_at: string;
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
  vehicle: {
    id: string;
    year: number | null;
    make: string;
    model: string;
    plate: string | null;
  } | null;
  inspection_items: {
    name: string;
    status: InspectionStatus;
    note: string | null;
  }[];
}

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
  ready: { label: "Ready for Pickup", color: "text-green-400", bg: "bg-green-400/10" },
  completed: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  picked_up: { label: "Picked Up", color: "text-brand-muted", bg: "bg-brand-muted/10" },
};

const statusFlow: JobStatus[] = [
  "intake",
  "in_progress",
  "ready",
  "completed",
  "picked_up",
];

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editInspection, setEditInspection] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadJob = useCallback(async () => {
    const res = await fetch(`/api/jobs/${jobId}`);
    if (res.ok) {
      setJob(await res.json());
    }
    setLoading(false);
  }, [jobId]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  async function updateStatus(newStatus: JobStatus) {
    setActionLoading("status");
    await fetch(`/api/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        ...(newStatus === "completed" ? { completed_at: new Date().toISOString() } : {}),
      }),
    });
    await loadJob();
    setActionLoading(null);
  }

  async function sendNotification() {
    setActionLoading("notify");
    await fetch(`/api/jobs/${jobId}/notify`, { method: "POST" });
    await loadJob();
    setActionLoading(null);
  }

  async function markComplete() {
    setActionLoading("complete");
    await fetch(`/api/jobs/${jobId}/complete`, { method: "POST" });
    await loadJob();
    setActionLoading(null);
  }

  async function sendReview() {
    setActionLoading("review");
    await fetch(`/api/jobs/${jobId}/review`, { method: "POST" });
    await loadJob();
    setActionLoading(null);
  }

  if (loading) {
    return <p className="text-brand-muted">Loading...</p>;
  }

  if (!job) {
    return (
      <div>
        <p className="text-brand-muted">Job not found.</p>
        <Link href="/admin/jobs" className="text-brand-blue-light text-sm mt-2 inline-block">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  const currentStatusIndex = statusFlow.indexOf(job.status);
  const nextStatus = statusFlow[currentStatusIndex + 1] || null;
  const config = statusConfig[job.status];

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button
            onClick={() => router.back()}
            className="text-brand-muted text-xs hover:text-white transition-colors mb-2 inline-block"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">
            {job.customer.name}
          </h1>
          <p className="text-brand-muted text-sm">
            {job.vehicle
              ? `${job.vehicle.year || ""} ${job.vehicle.make} ${job.vehicle.model}`
              : "No vehicle"}
            {job.vehicle?.plate && ` · ${job.vehicle.plate}`}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full ${config.bg} ${config.color}`}
        >
          {config.label}
        </span>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-brand-dark rounded-xl border border-white/10 p-4">
          <p className="text-brand-muted text-xs uppercase tracking-wide mb-2">
            Customer
          </p>
          <Link
            href={`/admin/customers/${job.customer.id}`}
            className="text-white font-semibold text-sm hover:text-brand-blue-light transition-colors"
          >
            {job.customer.name}
          </Link>
          {job.customer.email && (
            <p className="text-brand-muted text-xs mt-1">{job.customer.email}</p>
          )}
          {job.customer.phone && (
            <p className="text-brand-muted text-xs">{job.customer.phone}</p>
          )}
        </div>

        <div className="bg-brand-dark rounded-xl border border-white/10 p-4">
          <p className="text-brand-muted text-xs uppercase tracking-wide mb-2">
            Services
          </p>
          {job.services.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {job.services.map((s) => (
                <span
                  key={s}
                  className="text-xs bg-brand-blue/20 text-brand-blue-light px-2 py-1 rounded-lg"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-brand-muted text-xs">No services specified</p>
          )}
        </div>
      </div>

      {job.notes && (
        <div className="bg-brand-dark rounded-xl border border-white/10 p-4 mb-6">
          <p className="text-brand-muted text-xs uppercase tracking-wide mb-2">
            Notes
          </p>
          <p className="text-white text-sm">{job.notes}</p>
        </div>
      )}

      {/* Inspection */}
      <div className="bg-brand-dark rounded-xl border border-white/10 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-brand-muted text-xs uppercase tracking-wide">
            Inspection
          </p>
          <button
            onClick={() => setEditInspection(!editInspection)}
            className="text-brand-blue-light text-xs hover:text-white transition-colors"
          >
            {editInspection ? "View Mode" : "Edit Inspection"}
          </button>
        </div>

        {editInspection ? (
          <InspectionEditor
            jobId={job.id}
            initialItems={(job.inspection_items || []).map((i) => ({
              name: i.name,
              status: i.status,
              note: i.note || "",
            }))}
            onSaved={() => {
              setEditInspection(false);
              loadJob();
            }}
          />
        ) : (
          <InspectionView items={job.inspection_items || []} />
        )}
      </div>

      {/* Actions */}
      <div className="bg-brand-dark rounded-xl border border-white/10 p-4">
        <p className="text-brand-muted text-xs uppercase tracking-wide mb-3">
          Actions
        </p>
        <div className="flex flex-wrap gap-3">
          {/* Status progression */}
          {nextStatus && job.status !== "ready" && (
            <button
              onClick={() => updateStatus(nextStatus)}
              disabled={!!actionLoading}
              className="bg-brand-blue hover:bg-brand-blue-light disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              {actionLoading === "status"
                ? "Updating..."
                : `Move to ${statusConfig[nextStatus].label}`}
            </button>
          )}

          {/* Send inspection notification */}
          {(job.inspection_items || []).length > 0 && job.status !== "picked_up" && (
            <button
              onClick={sendNotification}
              disabled={!!actionLoading}
              className="bg-brand-blue hover:bg-brand-blue-light disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              {actionLoading === "notify"
                ? "Sending..."
                : job.notified_at
                  ? "Re-send Inspection"
                  : "Notify Customer"}
            </button>
          )}

          {/* Mark complete / ready */}
          {(job.status === "in_progress" || job.status === "intake") && (
            <button
              onClick={markComplete}
              disabled={!!actionLoading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              {actionLoading === "complete"
                ? "Completing..."
                : "Mark Complete & Notify"}
            </button>
          )}

          {/* Mark picked up */}
          {job.status === "ready" && (
            <button
              onClick={() => updateStatus("picked_up")}
              disabled={!!actionLoading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              {actionLoading === "status" ? "Updating..." : "Mark Picked Up"}
            </button>
          )}

          {/* Send review request */}
          {job.status === "picked_up" && (
            <button
              onClick={sendReview}
              disabled={!!actionLoading || !!job.review_sent_at}
              className="bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              {job.review_sent_at
                ? "Review Sent ✓"
                : actionLoading === "review"
                  ? "Sending..."
                  : "Send Review Request"}
            </button>
          )}
        </div>

        {/* Notification status */}
        {job.notified_at && (
          <p className="text-brand-muted text-xs mt-3">
            Inspection sent: {new Date(job.notified_at).toLocaleString()}
          </p>
        )}
        {job.review_sent_at && (
          <p className="text-brand-muted text-xs mt-1">
            Review request sent: {new Date(job.review_sent_at).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
