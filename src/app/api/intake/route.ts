import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email, address, year, make, model, plate, description } = body;

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  // Create customer
  const { data: customer, error: customerErr } = await supabase
    .from("customers")
    .insert({
      name,
      phone,
      email: email || null,
      address: address || null,
    })
    .select()
    .single();

  if (customerErr || !customer) {
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }

  // Create vehicle if make/model provided
  let vehicleId = null;
  if (make && model) {
    const { data: vehicle } = await supabase
      .from("vehicles")
      .insert({
        customer_id: customer.id,
        year: year ? parseInt(year) : null,
        make,
        model,
        plate: plate || null,
      })
      .select()
      .single();

    if (vehicle) vehicleId = vehicle.id;
  }

  // Create job in intake status
  const { data: job, error: jobErr } = await supabase
    .from("jobs")
    .insert({
      customer_id: customer.id,
      vehicle_id: vehicleId,
      services: [],
      notes: description || null,
      status: "intake",
    })
    .select()
    .single();

  if (jobErr || !job) {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }

  return NextResponse.json({ success: true, jobId: job.id }, { status: 201 });
}
