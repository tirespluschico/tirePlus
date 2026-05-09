import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { logJobEvent } from "@/lib/jobEvents";
import { sendReadyNotification } from "@/lib/notifications";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await params;

  const { data: job, error } = await supabase
    .from("jobs")
    .select("id")
    .eq("id", jobId)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  await supabase
    .from("jobs")
    .update({ status: "ready", completed_at: new Date().toISOString() })
    .eq("id", jobId);

  const result = await sendReadyNotification(jobId);

  await logJobEvent(jobId, "complete", "Marked complete & customer notified");

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
