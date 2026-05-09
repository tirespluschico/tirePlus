import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { logJobEvent } from "@/lib/jobEvents";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string; itemId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId, itemId } = await params;

  const { data: item } = await supabase
    .from("inspection_items")
    .select("name")
    .eq("id", itemId)
    .single();

  const { error } = await supabase
    .from("inspection_items")
    .delete()
    .eq("id", itemId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (item) {
    await logJobEvent(jobId, "inspection_item_removed", item.name);
  }

  return NextResponse.json({ success: true });
}
