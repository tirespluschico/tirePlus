import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { logJobEvent } from "@/lib/jobEvents";
import { sendReadyNotification } from "@/lib/notifications";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await params;

  const { data: job, error } = await supabase
    .from("jobs")
    .select(
      "*, customer:customers(*), vehicle:vehicles(*), inspection_items(*), events:job_events(*), parts:job_parts(*)"
    )
    .eq("id", jobId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  if (job.inspection_items) {
    job.inspection_items.sort(
      (a: { sort_order: number }, b: { sort_order: number }) =>
        a.sort_order - b.sort_order
    );
  }

  if (job.events) {
    job.events.sort(
      (a: { created_at: string }, b: { created_at: string }) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  if (job.parts) {
    job.parts.sort(
      (a: { created_at: string }, b: { created_at: string }) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }

  return NextResponse.json(job);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await params;
  const body = await req.json();

  // If the status is changing, capture the old value so we can log it
  let oldStatus: string | null = null;
  if (typeof body.status === "string") {
    const { data: current } = await supabase
      .from("jobs")
      .select("status")
      .eq("id", jobId)
      .single();
    oldStatus = current?.status ?? null;
  }

  const { data, error } = await supabase
    .from("jobs")
    .update(body)
    .eq("id", jobId)
    .select(
      "*, customer:customers(*), vehicle:vehicles(*), inspection_items(*)"
    )
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (oldStatus && body.status && oldStatus !== body.status) {
    await logJobEvent(jobId, "status_change", `${oldStatus} → ${body.status}`);

    if (body.status === "ready") {
      const result = await sendReadyNotification(jobId);
      if (result.ok) {
        await logJobEvent(jobId, "notify", "Ready-for-pickup notification sent");
      }
    }
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await params;

  const { error } = await supabase.from("jobs").delete().eq("id", jobId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
