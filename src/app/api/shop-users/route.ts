import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

async function requireOwner() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const { data } = await supabase
    .from("shop_users")
    .select("role")
    .eq("email", session.user.email)
    .maybeSingle();
  if (data?.role !== "owner") return null;
  return session;
}

export async function GET() {
  const session = await requireOwner();
  if (!session) {
    return NextResponse.json({ error: "Owner only" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("shop_users")
    .select("id, email, name, role, created_at")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await requireOwner();
  if (!session) {
    return NextResponse.json({ error: "Owner only" }, { status: 403 });
  }

  const body = await req.json();
  const email = body.email?.toLowerCase().trim();
  const name = body.name?.trim() || null;
  const role = body.role === "owner" ? "owner" : "tech";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("shop_users")
    .insert({ email, name, role })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Email already added" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
