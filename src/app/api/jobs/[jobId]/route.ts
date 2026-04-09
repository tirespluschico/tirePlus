import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

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
      "*, customer:customers(*), vehicle:vehicles(*), inspection_items(*)"
    )
    .eq("id", jobId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  // Sort inspection items by sort_order
  if (job.inspection_items) {
    job.inspection_items.sort(
      (a: { sort_order: number }, b: { sort_order: number }) =>
        a.sort_order - b.sort_order
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

  const { data, error } = await supabase
    .from("jobs")
    .update(body)
    .eq("id", jobId)
    .select(
      "*, customer:customers(*), vehicle:vehicles(*), inspection_items(*)"
    )
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
