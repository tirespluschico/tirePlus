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

  const { data, error } = await supabase
    .from("inspection_items")
    .select("*")
    .eq("job_id", jobId)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await params;
  const { items } = await req.json();

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "items array is required" }, { status: 400 });
  }

  // Delete existing items and insert fresh
  await supabase.from("inspection_items").delete().eq("job_id", jobId);

  if (items.length > 0) {
    const rows = items.map(
      (item: { name: string; status: string; note?: string }, i: number) => ({
        job_id: jobId,
        name: item.name,
        status: item.status,
        note: item.note || null,
        sort_order: i,
      })
    );

    const { error } = await supabase.from("inspection_items").insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return the newly saved items
  const { data } = await supabase
    .from("inspection_items")
    .select("*")
    .eq("job_id", jobId)
    .order("sort_order", { ascending: true });

  return NextResponse.json(data);
}
