import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { logJobEvent } from "@/lib/jobEvents";

const VALID_STATUSES = ["needed", "ordered", "in_stock"];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await params;
  const body = await req.json();
  const name = body.name?.trim();
  const quantity = parseInt(body.quantity) || 1;
  const status = VALID_STATUSES.includes(body.status) ? body.status : "needed";
  const notes = body.notes?.trim() || null;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("job_parts")
    .insert({ job_id: jobId, name, quantity, status, notes })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logJobEvent(jobId, "part_added", `${name} (${status.replace("_", " ")})`);

  return NextResponse.json(data, { status: 201 });
}
