import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase, DEV_MODE } from "@/lib/supabase/client";
import { SHOP_INFO } from "@/lib/constants";

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

  // Update job status to ready
  await supabase
    .from("jobs")
    .update({ status: "ready", completed_at: new Date().toISOString() })
    .eq("id", jobId);

  if (DEV_MODE) {
    console.log("\n========== VEHICLE READY NOTIFICATION ==========");
    console.log(`To: ${customer.name} (${customer.email || "no email"} / ${customer.phone || "no phone"})`);
    console.log(`Vehicle: ${vehicleLabel}`);
    console.log(`Message: Your ${vehicleLabel} is ready for pickup at Tires+!`);
    console.log("================================================\n");
  } else {
    const { Resend } = await import("resend");
    const twilio = (await import("twilio")).default;
    const resend = new Resend(process.env.RESEND_API_KEY);
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    if (customer.email) {
      try {
        await resend.emails.send({
          from: `Tires+ <${process.env.RESEND_FROM_EMAIL || "notifications@tiresplus.com"}>`,
          to: customer.email,
          subject: `Your ${vehicleLabel} is Ready for Pickup!`,
          html: `<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#1a1a1a;padding:24px;text-align:center;"><h1 style="color:#fff;margin:0;font-size:22px;">Tires+ Complete Auto Service</h1></div>
            <div style="padding:24px;">
              <p style="font-size:16px;color:#333;">Hi ${customer.name},</p>
              <p style="font-size:15px;color:#555;">Your <strong>${vehicleLabel}</strong> is all done and ready for pickup.</p>
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;text-align:center;">
                <p style="font-size:18px;color:#16a34a;font-weight:bold;margin:0;">✅ Ready for Pickup</p>
              </div>
              <p style="font-size:15px;color:#555;"><strong>Hours:</strong> Mon–Sat 8AM–5PM</p>
              <p style="font-size:15px;color:#555;"><strong>Location:</strong> ${SHOP_INFO.address}</p>
              <p style="font-size:14px;color:#555;">Questions? Call <strong>${SHOP_INFO.phone}</strong>.</p>
            </div></div>`,
        });
        await supabase.from("notification_log").insert({ job_id: jobId, channel: "email", type: "ready", status: "sent" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Email failed";
        await supabase.from("notification_log").insert({ job_id: jobId, channel: "email", type: "ready", status: "failed", error: msg });
      }
    }

    if (customer.phone) {
      try {
        await twilioClient.messages.create({
          body: `Hi ${customer.name}, your ${vehicleLabel} is ready for pickup at Tires+! Mon-Sat 8AM-5PM. Questions? ${SHOP_INFO.phone}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: customer.phone,
        });
        await supabase.from("notification_log").insert({ job_id: jobId, channel: "sms", type: "ready", status: "sent" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "SMS failed";
        await supabase.from("notification_log").insert({ job_id: jobId, channel: "sms", type: "ready", status: "failed", error: msg });
      }
    }
  }

  return NextResponse.json({ success: true });
}
