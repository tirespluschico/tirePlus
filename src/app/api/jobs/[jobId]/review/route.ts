import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase, DEV_MODE } from "@/lib/supabase/client";
import { SHOP_INFO } from "@/lib/constants";

const GOOGLE_REVIEW_URL = process.env.GOOGLE_REVIEW_URL || "https://g.page/r/tirespluschico/review";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await params;

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*, customer:customers(*), vehicle:vehicles(*)")
    .eq("id", jobId)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const customer = job.customer;
  const vehicle = job.vehicle;
  const vehicleLabel = vehicle
    ? `${vehicle.year || ""} ${vehicle.make} ${vehicle.model}`.trim()
    : "your vehicle";

  if (DEV_MODE) {
    console.log("\n========== REVIEW REQUEST ==========");
    console.log(`To: ${customer.name} (${customer.email || "no email"})`);
    console.log(`Vehicle: ${vehicleLabel}`);
    console.log(`Review link: ${GOOGLE_REVIEW_URL}`);
    console.log(`Message: Thank you for trusting us with your ${vehicleLabel}! Please leave us a Google review.`);
    console.log("====================================\n");
  } else {
    if (!customer.email) {
      return NextResponse.json({ error: "Customer has no email address" }, { status: 400 });
    }

    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: `Tires+ <${process.env.RESEND_FROM_EMAIL || "notifications@tiresplus.com"}>`,
        to: customer.email,
        subject: `How was your experience at Tires+?`,
        html: `<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#1a1a1a;padding:24px;text-align:center;"><h1 style="color:#fff;margin:0;font-size:22px;">Tires+ Complete Auto Service</h1></div>
          <div style="padding:24px;">
            <p style="font-size:16px;color:#333;">Hi ${customer.name},</p>
            <p style="font-size:15px;color:#555;">Thank you for trusting us with your <strong>${vehicleLabel}</strong>! If you have a moment, we'd really appreciate a Google review.</p>
            <div style="margin:28px 0;text-align:center;"><a href="${GOOGLE_REVIEW_URL}" style="background:#dc2626;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">Leave a Review ⭐</a></div>
            <p style="font-size:14px;color:#888;">Thanks again for choosing Tires+!</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
            <p style="font-size:12px;color:#999;text-align:center;">${SHOP_INFO.name} · ${SHOP_INFO.address}<br/>${SHOP_INFO.phone}</p>
          </div></div>`,
      });
      await supabase.from("notification_log").insert({ job_id: jobId, channel: "email", type: "review", status: "sent" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Email failed";
      await supabase.from("notification_log").insert({ job_id: jobId, channel: "email", type: "review", status: "failed", error: msg });
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  await supabase
    .from("jobs")
    .update({ review_sent_at: new Date().toISOString() })
    .eq("id", jobId);

  return NextResponse.json({ success: true });
}
