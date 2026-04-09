import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { customer_id, year, make, model, plate } = body;

  if (!customer_id || !make || !model) {
    return NextResponse.json(
      { error: "customer_id, make, and model are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("vehicles")
    .insert({ customer_id, year: year || null, make, model, plate: plate || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
