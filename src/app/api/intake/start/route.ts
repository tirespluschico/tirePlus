import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mint an ID but do not persist anything yet — the customer + job rows
  // are created on submit, so abandoned intake links leave no trace.
  return NextResponse.json({ customerId: randomUUID() }, { status: 201 });
}
