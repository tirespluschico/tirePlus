import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logJobEvent } from "@/lib/jobEvents";
import { sendReviewRequest } from "@/lib/notifications";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await params;
  const result = await sendReviewRequest(jobId);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  await logJobEvent(jobId, "review", "Google review request sent");
  return NextResponse.json({ success: true });
}
