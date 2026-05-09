import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { logJobEvent } from "@/lib/jobEvents";
import { sendInspectionNotification } from "@/lib/notifications";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await params;

  const result = await sendInspectionNotification(jobId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await supabase
    .from("jobs")
    .update({ notified_at: new Date().toISOString() })
    .eq("id", jobId);

  await logJobEvent(
    jobId,
    "notify",
    `Inspection report sent (${result.itemCount ?? 0} items)`
  );

  return NextResponse.json({ success: true });
}
