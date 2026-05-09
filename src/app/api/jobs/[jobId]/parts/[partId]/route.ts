import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { logJobEvent } from "@/lib/jobEvents";

const VALID_STATUSES = ["needed", "ordered", "in_stock"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string; partId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId, partId } = await params;
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  if (typeof body.name === "string") updates.name = body.name.trim();
  if (typeof body.quantity !== "undefined") {
    updates.quantity = parseInt(body.quantity) || 1;
  }
  if (typeof body.notes !== "undefined") {
    updates.notes = body.notes?.trim() || null;
  }
  if (typeof body.status === "string" && VALID_STATUSES.includes(body.status)) {
    updates.status = body.status;
  }

  // Capture old part for event logging
  const { data: oldPart } = await supabase
    .from("job_parts")
    .select("name, status")
    .eq("id", partId)
    .single();

  const { data, error } = await supabase
    .from("job_parts")
    .update(updates)
    .eq("id", partId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (oldPart && updates.status && oldPart.status !== updates.status) {
    await logJobEvent(
      jobId,
      "part_status_change",
      `${oldPart.name}: ${String(oldPart.status).replace("_", " ")} → ${String(updates.status).replace("_", " ")}`
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string; partId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId, partId } = await params;

  const { data: part } = await supabase
    .from("job_parts")
    .select("name")
    .eq("id", partId)
    .single();

  const { error } = await supabase.from("job_parts").delete().eq("id", partId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (part) {
    await logJobEvent(jobId, "part_removed", part.name);
  }

  return NextResponse.json({ success: true });
}
