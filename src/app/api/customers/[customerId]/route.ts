import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { customerId } = await params;

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, vehicle:vehicles(year, make, model)")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  return NextResponse.json({ ...customer, vehicles: vehicles || [], jobs: jobs || [] });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { customerId } = await params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("customers")
    .update(body)
    .eq("id", customerId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { customerId } = await params;

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
