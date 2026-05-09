import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status");

  let query = supabase
    .from("jobs")
    .select(
      "*, customer:customers(id, name, email, phone), vehicle:vehicles(id, year, make, model, plate)"
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { customer_id, vehicle_id, services, notes } = body;

  if (!customer_id) {
    return NextResponse.json({ error: "customer_id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      customer_id,
      vehicle_id: vehicle_id || null,
      services: services || [],
      notes: notes || null,
      status: "intake",
    })
    .select(
      "*, customer:customers(id, name, email, phone), vehicle:vehicles(id, year, make, model, plate)"
    )
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
