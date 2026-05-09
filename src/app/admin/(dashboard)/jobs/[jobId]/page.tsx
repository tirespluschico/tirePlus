"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import InspectionEditor from "@/components/admin/InspectionEditor";
import InspectionView from "@/components/admin/InspectionView";
import PartsSection, { type JobPart } from "@/components/admin/PartsSection";
import { SERVICES } from "@/lib/constants";
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
    id: string;
    name: string;
    status: InspectionStatus;
    note: string | null;
  }[];
  events?: {
    id: string;
    type: string;
    detail: string | null;
    user_email: string;
    user_name: string | null;
    created_at: string;
  }[];
  parts?: JobPart[];
}

const statusConfig: Record<JobStatus, { label: string; dot: string; text: string }> = {
  intake: { label: "Awaiting inspection", dot: "bg-amber-400", text: "text-amber-300" },
  in_progress: { label: "In progress", dot: "bg-blue-400", text: "text-blue-300" },
  ready: { label: "Ready", dot: "bg-green-500", text: "text-green-300" },
  completed: { label: "Completed", dot: "bg-brand-muted", text: "text-brand-muted" },
  picked_up: { label: "Picked up", dot: "bg-brand-muted", text: "text-brand-muted" },
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
  const [editServices, setEditServices] = useState(false);
  const [draftServices, setDraftServices] = useState<string[]>([]);
  const [customService, setCustomService] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadJob = useCallback(async () => {
    const res = await fetch(`/api/jobs/${jobId}`);
    if (res.ok) {
      const data = (await res.json()) as JobData;
      setJob(data);
      if (
        data.status === "intake" &&
        (data.inspection_items || []).length === 0
      ) {
        setEditInspection(true);
      }
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

  function startEditServices() {
    setDraftServices(job?.services || []);
    setCustomService("");
    setEditServices(true);
  }

  function toggleService(service: string) {
    setDraftServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  }

  function addCustomService() {
    const trimmed = customService.trim();
    if (!trimmed) return;
    if (!draftServices.includes(trimmed)) {
      setDraftServices((prev) => [...prev, trimmed]);
    }
    setCustomService("");
  }

  async function saveServices() {
    setActionLoading("services");
    await fetch(`/api/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ services: draftServices }),
    });
    await loadJob();
    setEditServices(false);
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

  async function deleteInspectionItem(itemId: string) {
    await fetch(`/api/jobs/${jobId}/inspection/${itemId}`, { method: "DELETE" });
    await loadJob();
  }

  if (loading) {
    return <p className="text-brand-muted text-sm">Loading…</p>;
  }

  if (!job) {
    return (
      <div>
        <p className="text-brand-muted text-sm">Job not found.</p>
        <Link
          href="/admin/jobs"
          className="text-brand-red text-sm mt-2 inline-block hover:underline"
        >
          ← Back to jobs
        </Link>
      </div>
    );
  }

  const currentStatusIndex = statusFlow.indexOf(job.status);
  const nextStatus = statusFlow[currentStatusIndex + 1] || null;
  const config = statusConfig[job.status];
  const inspectionCount = (job.inspection_items || []).length;
  const awaitingTech = job.status === "intake" && inspectionCount === 0;

  const btnPrimary =
    "bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors";
  const btnSecondary =
    "bg-transparent border border-white/15 hover:border-white/30 hover:bg-white/5 disabled:opacity-50 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors";
  const btnSuccess =
    "bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors";

  return (
    <div>
      {/* Breadcrumb */}
      <button
        onClick={() => router.back()}
        className="text-brand-muted text-xs hover:text-white mb-3 inline-block transition-colors"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-1">
        <h1 className="text-xl font-semibold text-white">{job.customer.name}</h1>
        <span className={`inline-flex items-center gap-1.5 text-sm ${config.text} shrink-0 mt-1`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      </div>
      <p className="text-brand-muted text-sm mb-5">
        {job.vehicle
          ? `${job.vehicle.year || ""} ${job.vehicle.make} ${job.vehicle.model}`.trim()
          : "No vehicle"}
        {job.vehicle?.plate && ` · ${job.vehicle.plate}`}
        <span className="mx-2 text-brand-muted/40">|</span>
        Opened {new Date(job.created_at).toLocaleDateString()}
      </p>

      {awaitingTech && (
        <div className="mb-5 bg-amber-400/10 border-l-2 border-amber-400 px-3 py-2 rounded-r">
          <p className="text-sm text-white">
            Customer info complete — needs inspection.
          </p>
          <p className="text-xs text-brand-muted mt-0.5">
            Mark each item{" "}
            <span className="text-green-300">good</span>,{" "}
            <span className="text-amber-300">soon</span>, or{" "}
            <span className="text-red-300">now</span>, then notify the customer.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: info + inspection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer + Services side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-white/10 rounded p-3">
              <p className="text-xs text-brand-muted mb-1.5">Customer</p>
              <Link
                href={`/admin/customers/${job.customer.id}`}
                className="text-white text-sm hover:text-brand-red"
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

            <div className="border border-white/10 rounded p-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-brand-muted">Services</p>
                {!editServices && (
                  <button
                    onClick={startEditServices}
                    className="text-brand-red text-xs hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editServices ? (
                <>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {[
                      ...SERVICES,
                      ...draftServices.filter((s) => !SERVICES.includes(s)),
                    ].map((s) => {
                      const selected = draftServices.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleService(s)}
                          className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                            selected
                              ? "bg-brand-red/80 border-brand-red text-white"
                              : "bg-transparent border-white/15 text-brand-muted hover:text-white hover:border-white/30"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    <input
                      type="text"
                      value={customService}
                      onChange={(e) => setCustomService(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomService();
                        }
                      }}
                      placeholder="Add custom service…"
                      className="flex-1 bg-brand-ink border border-white/10 rounded px-2 py-1 text-xs text-white placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-red"
                    />
                    <button
                      type="button"
                      onClick={addCustomService}
                      disabled={!customService.trim()}
                      className="bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-xs px-2 py-1 rounded transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveServices}
                      disabled={actionLoading === "services"}
                      className="bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 text-white text-xs font-medium px-3 py-1 rounded transition-colors"
                    >
                      {actionLoading === "services" ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => setEditServices(false)}
                      className="text-brand-muted hover:text-white text-xs px-2 py-1 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : job.services.length > 0 ? (
                <ul className="text-sm text-white space-y-0.5">
                  {job.services.map((s) => (
                    <li key={s}>· {s}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-brand-muted text-xs">None specified</p>
              )}
            </div>
          </div>

          {job.notes && (
            <div className="border border-white/10 rounded p-3">
              <p className="text-xs text-brand-muted mb-1.5">Notes from customer</p>
              <p className="text-white text-sm whitespace-pre-wrap">{job.notes}</p>
            </div>
          )}

          {/* Inspection */}
          <div className={`border rounded p-4 ${awaitingTech ? "border-amber-400/40" : "border-white/10"}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-white">Inspection</h2>
                {inspectionCount > 0 && !editInspection && (
                  <p className="text-brand-muted text-xs mt-0.5">
                    {inspectionCount} item{inspectionCount === 1 ? "" : "s"} recorded
                  </p>
                )}
              </div>
              <button
                onClick={() => setEditInspection(!editInspection)}
                className="text-brand-red text-xs hover:underline"
              >
                {editInspection ? "Done" : "Edit"}
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
              <InspectionView
                items={job.inspection_items || []}
                onDelete={deleteInspectionItem}
              />
            )}
          </div>

          {/* Parts */}
          <PartsSection
            jobId={job.id}
            initialParts={job.parts || []}
            onChange={loadJob}
          />

          {/* Activity timeline */}
          {job.events && job.events.length > 0 && (
            <div className="border border-white/10 rounded p-4">
              <h2 className="text-sm font-semibold text-white mb-3">Activity</h2>
              <ol className="space-y-2.5">
                {job.events.map((ev) => (
                  <li key={ev.id} className="flex gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white">
                        {ev.detail || ev.type}
                      </p>
                      <p className="text-brand-muted text-xs mt-0.5">
                        {ev.user_name || ev.user_email}
                        <span className="mx-1.5 text-brand-muted/40">·</span>
                        {new Date(ev.created_at).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Right column: actions */}
        <div className="lg:col-span-1">
          <div className="border border-white/10 rounded p-3 lg:sticky lg:top-4">
            <p className="text-xs text-brand-muted mb-3">Actions</p>
            <div className="flex flex-col gap-2">
              {nextStatus && job.status !== "ready" && (
                <button
                  onClick={() => updateStatus(nextStatus)}
                  disabled={!!actionLoading}
                  className={btnSecondary}
                >
                  {actionLoading === "status"
                    ? "Updating…"
                    : `Move to ${statusConfig[nextStatus].label}`}
                </button>
              )}

              {(job.inspection_items || []).length > 0 &&
                job.status !== "picked_up" && (
                  <button
                    onClick={sendNotification}
                    disabled={!!actionLoading}
                    className={btnSecondary}
                  >
                    {actionLoading === "notify"
                      ? "Sending…"
                      : job.notified_at
                        ? "Re-send inspection"
                        : "Notify customer"}
                  </button>
                )}

              {(job.status === "in_progress" || job.status === "intake") && (
                <button
                  onClick={markComplete}
                  disabled={!!actionLoading}
                  className={btnSuccess}
                >
                  {actionLoading === "complete" ? "Completing…" : "Mark complete & notify"}
                </button>
              )}

              {job.status === "ready" && (
                <button
                  onClick={() => updateStatus("picked_up")}
                  disabled={!!actionLoading}
                  className={btnSuccess}
                >
                  {actionLoading === "status" ? "Updating…" : "Mark picked up"}
                </button>
              )}

              {job.status === "picked_up" && (
                <button
                  onClick={sendReview}
                  disabled={!!actionLoading || !!job.review_sent_at}
                  className={btnPrimary}
                >
                  {job.review_sent_at
                    ? "Review sent ✓"
                    : actionLoading === "review"
                      ? "Sending…"
                      : "Send review request"}
                </button>
              )}
            </div>

            {(job.notified_at || job.review_sent_at) && (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                {job.notified_at && (
                  <p className="text-brand-muted text-xs">
                    Inspection sent {new Date(job.notified_at).toLocaleString()}
                  </p>
                )}
                {job.review_sent_at && (
                  <p className="text-brand-muted text-xs">
                    Review sent {new Date(job.review_sent_at).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
