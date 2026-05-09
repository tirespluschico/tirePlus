import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await params;

  const { data: customer } = await supabase
    .from("customers")
    .select("id, name, phone, email, address")
    .eq("id", customerId)
    .single();

  // If the customer does not exist yet (admin opened the link but
  // nothing has been submitted), return an empty stub so the form renders.
  if (!customer) {
    return NextResponse.json({
      id: customerId,
      name: "",
      phone: "",
      email: "",
      address: null,
    });
  }

  return NextResponse.json(customer);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await params;
  const body = await req.json();
  const { name, phone, email, year, make, model, plate, description } = body;

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone are required" },
      { status: 400 }
    );
  }

  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("id", customerId)
    .single();

  if (!existingCustomer) {
    // First submit on this intake link — create the customer row using the
    // pre-minted ID from /api/intake/start.
    const { error: customerErr } = await supabase
      .from("customers")
      .insert({
        id: customerId,
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
      });

    if (customerErr) {
      return NextResponse.json({ error: customerErr.message }, { status: 500 });
    }
  } else {
    const { error: customerErr } = await supabase
      .from("customers")
      .update({
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
      })
      .eq("id", customerId);

    if (customerErr) {
      return NextResponse.json({ error: customerErr.message }, { status: 500 });
    }
  }

  let vehicleId: string | null = null;
  if (make && model) {
    const { data: vehicle, error: vehicleErr } = await supabase
      .from("vehicles")
      .insert({
        customer_id: customerId,
        year: year ? parseInt(year) : null,
        make: make.trim(),
        model: model.trim(),
        plate: plate?.trim() || null,
      })
      .select("id")
      .single();

    if (vehicleErr) {
      return NextResponse.json({ error: vehicleErr.message }, { status: 500 });
    }
    vehicleId = vehicle?.id || null;
  }

  const { data: existingJob } = await supabase
    .from("jobs")
    .select("id")
    .eq("customer_id", customerId)
    .eq("status", "intake")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existingJob) {
    const { error: jobErr } = await supabase
      .from("jobs")
      .update({
        vehicle_id: vehicleId,
        notes: description?.trim() || null,
      })
      .eq("id", existingJob.id);

    if (jobErr) {
      return NextResponse.json({ error: jobErr.message }, { status: 500 });
    }
  } else {
    const { error: jobErr } = await supabase.from("jobs").insert({
      customer_id: customerId,
      vehicle_id: vehicleId,
      services: [],
      status: "intake",
      notes: description?.trim() || null,
    });

    if (jobErr) {
      return NextResponse.json({ error: jobErr.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
