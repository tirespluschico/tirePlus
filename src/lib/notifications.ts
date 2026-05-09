import { supabase, DEV_MODE } from "@/lib/supabase/client";
import { SHOP_INFO } from "@/lib/constants";

const GOOGLE_REVIEW_URL =
  process.env.GOOGLE_REVIEW_URL || "https://g.page/r/CfcUNQaqg69kEBM/review";

function buildEmailHeader() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const logoUrl = siteUrl ? `${siteUrl}/images/tireplus.png` : "";
  return `<div style="background:#1a1a1a;padding:24px;text-align:center;">
    ${logoUrl ? `<img src="${logoUrl}" alt="Tires+" style="max-height:48px;height:48px;width:auto;display:block;margin:0 auto 12px auto;" />` : ""}
    <h1 style="color:#fff;margin:0;font-size:18px;font-weight:600;">Tires+ Complete Auto Service</h1>
  </div>`;
}

type SendResult = { ok: boolean; error?: string; itemCount?: number };

async function alreadySent(
  jobId: string,
  type: "ready" | "review" | "inspection",
  channel: "email" | "sms"
): Promise<boolean> {
  const { data } = await supabase
    .from("notification_log")
    .select("id")
    .eq("job_id", jobId)
    .eq("type", type)
    .eq("channel", channel)
    .eq("status", "sent")
    .limit(1);
  return (data?.length ?? 0) > 0;
}

export async function sendReadyNotification(jobId: string): Promise<SendResult> {
  const { data: job } = await supabase
    .from("jobs")
    .select("*, customer:customers(*), vehicle:vehicles(*)")
    .eq("id", jobId)
    .single();

  if (!job) return { ok: false, error: "Job not found" };

  const customer = job.customer;
  const vehicle = job.vehicle;
  if (!customer) return { ok: false, error: "No customer" };

  const vehicleLabel = vehicle
    ? `${vehicle.year || ""} ${vehicle.make} ${vehicle.model}`.trim()
    : "your vehicle";

  if (DEV_MODE) {
    console.log("\n========== VEHICLE READY NOTIFICATION ==========");
    console.log(
      `To: ${customer.name} (${customer.email || "no email"} / ${customer.phone || "no phone"})`
    );
    console.log(`Vehicle: ${vehicleLabel}`);
    console.log(`Message: Your ${vehicleLabel} is ready for pickup at Tires+!`);
    console.log("================================================\n");
    return { ok: true };
  }

  const { Resend } = await import("resend");
  const twilio = (await import("twilio")).default;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  if (customer.email && !(await alreadySent(jobId, "ready", "email"))) {
    try {
      await resend.emails.send({
        from: `Tires+ <${process.env.RESEND_FROM_EMAIL || "notifications@tiresplus.com"}>`,
        to: customer.email,
        subject: `Your ${vehicleLabel} is Ready for Pickup!`,
        html: buildReadyEmail({ customerName: customer.name, vehicleLabel }),
      });
      await supabase.from("notification_log").insert({
        job_id: jobId,
        channel: "email",
        type: "ready",
        status: "sent",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Email failed";
      await supabase.from("notification_log").insert({
        job_id: jobId,
        channel: "email",
        type: "ready",
        status: "failed",
        error: msg,
      });
    }
  }

  if (customer.phone && !(await alreadySent(jobId, "ready", "sms"))) {
    try {
      await twilioClient.messages.create({
        body: `Hi ${customer.name}, your ${vehicleLabel} is ready for pickup at Tires+! Mon-Fri 8:30AM-5PM, Sat 9AM-1PM. Questions? ${SHOP_INFO.phone}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: customer.phone,
      });
      await supabase.from("notification_log").insert({
        job_id: jobId,
        channel: "sms",
        type: "ready",
        status: "sent",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "SMS failed";
      await supabase.from("notification_log").insert({
        job_id: jobId,
        channel: "sms",
        type: "ready",
        status: "failed",
        error: msg,
      });
    }
  }

  return { ok: true };
}

export async function sendReviewRequest(jobId: string): Promise<SendResult> {
  const { data: job } = await supabase
    .from("jobs")
    .select("*, customer:customers(*), vehicle:vehicles(*)")
    .eq("id", jobId)
    .single();

  if (!job) return { ok: false, error: "Job not found" };

  const customer = job.customer;
  const vehicle = job.vehicle;
  if (!customer) return { ok: false, error: "No customer" };

  const vehicleLabel = vehicle
    ? `${vehicle.year || ""} ${vehicle.make} ${vehicle.model}`.trim()
    : "your vehicle";

  if (DEV_MODE) {
    console.log("\n========== REVIEW REQUEST ==========");
    console.log(`To: ${customer.name} (${customer.email || "no email"})`);
    console.log(`Vehicle: ${vehicleLabel}`);
    console.log(`Review link: ${GOOGLE_REVIEW_URL}`);
    console.log("====================================\n");
    await supabase
      .from("jobs")
      .update({ review_sent_at: new Date().toISOString() })
      .eq("id", jobId);
    return { ok: true };
  }

  if (!customer.email) return { ok: false, error: "Customer has no email address" };
  if (await alreadySent(jobId, "review", "email")) return { ok: true };

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: `Tires+ <${process.env.RESEND_FROM_EMAIL || "notifications@tiresplus.com"}>`,
      to: customer.email,
      subject: `How was your experience at Tires+?`,
      html: buildReviewEmail({ customerName: customer.name, vehicleLabel }),
    });
    await supabase.from("notification_log").insert({
      job_id: jobId,
      channel: "email",
      type: "review",
      status: "sent",
    });
    await supabase
      .from("jobs")
      .update({ review_sent_at: new Date().toISOString() })
      .eq("id", jobId);
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Email failed";
    await supabase.from("notification_log").insert({
      job_id: jobId,
      channel: "email",
      type: "review",
      status: "failed",
      error: msg,
    });
    return { ok: false, error: msg };
  }
}

export async function sendInspectionNotification(
  jobId: string
): Promise<SendResult> {
  const { data: job } = await supabase
    .from("jobs")
    .select("*, customer:customers(*), vehicle:vehicles(*), inspection_items(*)")
    .eq("id", jobId)
    .single();

  if (!job) return { ok: false, error: "Job not found" };

  const customer = job.customer;
  const vehicle = job.vehicle;
  if (!customer) return { ok: false, error: "No customer" };

  const items = (job.inspection_items || []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) =>
      a.sort_order - b.sort_order
  );
  const redItems = items.filter(
    (i: { status: string }) => i.status === "red"
  );
  const yellowItems = items.filter(
    (i: { status: string }) => i.status === "yellow"
  );
  const greenItems = items.filter(
    (i: { status: string }) => i.status === "green"
  );

  const vehicleLabel = vehicle
    ? `${vehicle.year || ""} ${vehicle.make} ${vehicle.model}`.trim()
    : "your vehicle";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const inspectionUrl = `${siteUrl}/status/${jobId}`;

  if (DEV_MODE) {
    console.log("\n========== INSPECTION NOTIFICATION ==========");
    console.log(
      `To: ${customer.name} (${customer.email || "no email"} / ${customer.phone || "no phone"})`
    );
    console.log(`Vehicle: ${vehicleLabel}`);
    console.log(`View report: ${inspectionUrl}`);
    console.log(`🔴 Needs attention (${redItems.length}):`);
    redItems.forEach((i: { name: string; note: string | null }) =>
      console.log(`   - ${i.name}${i.note ? ` (${i.note})` : ""}`)
    );
    console.log(`🟡 Monitor (${yellowItems.length}):`);
    yellowItems.forEach((i: { name: string; note: string | null }) =>
      console.log(`   - ${i.name}${i.note ? ` (${i.note})` : ""}`)
    );
    console.log(`🟢 Good (${greenItems.length}):`);
    greenItems.forEach((i: { name: string; note: string | null }) =>
      console.log(`   - ${i.name}${i.note ? ` (${i.note})` : ""}`)
    );
    console.log("==============================================\n");
    return { ok: true, itemCount: items.length };
  }

  const { Resend } = await import("resend");
  const twilio = (await import("twilio")).default;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  if (customer.email && !(await alreadySent(jobId, "inspection", "email"))) {
    try {
      await resend.emails.send({
        from: `Tires+ <${process.env.RESEND_FROM_EMAIL || "notifications@tiresplus.com"}>`,
        to: customer.email,
        subject: `Vehicle Inspection Report — ${vehicleLabel}`,
        html: buildInspectionEmail({
          customerName: customer.name,
          vehicleLabel,
          redItems,
          yellowItems,
          greenItems,
          inspectionUrl,
        }),
      });
      await supabase.from("notification_log").insert({
        job_id: jobId,
        channel: "email",
        type: "inspection",
        status: "sent",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Email send failed";
      await supabase.from("notification_log").insert({
        job_id: jobId,
        channel: "email",
        type: "inspection",
        status: "failed",
        error: msg,
      });
    }
  }

  if (customer.phone && !(await alreadySent(jobId, "inspection", "sms"))) {
    try {
      const parts = [];
      if (redItems.length > 0)
        parts.push(`🔴 ${redItems.length} need attention`);
      if (yellowItems.length > 0)
        parts.push(`🟡 ${yellowItems.length} monitor`);
      if (greenItems.length > 0) parts.push(`🟢 ${greenItems.length} good`);
      await twilioClient.messages.create({
        body: `Hi ${customer.name}, your inspection for ${vehicleLabel} is ready. ${parts.join(", ")}. View report: ${inspectionUrl} — Tires+ (${SHOP_INFO.phone})`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: customer.phone,
      });
      await supabase.from("notification_log").insert({
        job_id: jobId,
        channel: "sms",
        type: "inspection",
        status: "sent",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "SMS send failed";
      await supabase.from("notification_log").insert({
        job_id: jobId,
        channel: "sms",
        type: "inspection",
        status: "failed",
        error: msg,
      });
    }
  }

  return { ok: true, itemCount: items.length };
}

function buildInspectionEmail({
  customerName,
  vehicleLabel,
  redItems,
  yellowItems,
  greenItems,
  inspectionUrl,
}: {
  customerName: string;
  vehicleLabel: string;
  redItems: { name: string; note: string | null }[];
  yellowItems: { name: string; note: string | null }[];
  greenItems: { name: string; note: string | null }[];
  inspectionUrl: string;
}) {
  const renderItems = (
    items: { name: string; note: string | null }[],
    color: string,
    emoji: string
  ) =>
    items
      .map(
        (i) =>
          `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">
        <span style="color:${color};font-weight:bold;font-size:16px;">${emoji}</span>
        &nbsp; ${i.name}${i.note ? `<br/><span style="color:#888;font-size:13px;">${i.note}</span>` : ""}
      </td></tr>`
      )
      .join("");

  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
    ${buildEmailHeader()}
    <div style="padding:24px;">
      <p style="font-size:16px;color:#333;">Hi ${customerName},</p>
      <p style="font-size:15px;color:#555;">We've completed an inspection on your <strong>${vehicleLabel}</strong>. Here's what we found:</p>
      ${redItems.length > 0 ? `<h3 style="color:#dc2626;margin:20px 0 8px;">🔴 Needs Immediate Attention</h3><table style="width:100%;border-collapse:collapse;">${renderItems(redItems, "#dc2626", "🔴")}</table>` : ""}
      ${yellowItems.length > 0 ? `<h3 style="color:#d97706;margin:20px 0 8px;">🟡 Monitor / Needs Soon</h3><table style="width:100%;border-collapse:collapse;">${renderItems(yellowItems, "#d97706", "🟡")}</table>` : ""}
      ${greenItems.length > 0 ? `<h3 style="color:#16a34a;margin:20px 0 8px;">🟢 Good Condition</h3><table style="width:100%;border-collapse:collapse;">${renderItems(greenItems, "#16a34a", "🟢")}</table>` : ""}
      <div style="margin:28px 0;text-align:center;"><a href="${inspectionUrl}" style="background:#dc2626;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">View Full Report</a></div>
      <p style="font-size:14px;color:#555;">Questions? Call us at <strong>${SHOP_INFO.phone}</strong>.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
      <p style="font-size:12px;color:#999;text-align:center;">${SHOP_INFO.name} · ${SHOP_INFO.address}<br/>${SHOP_INFO.phone}</p>
    </div></div>`;
}

function buildReadyEmail({
  customerName,
  vehicleLabel,
}: {
  customerName: string;
  vehicleLabel: string;
}) {
  return `<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;">
    ${buildEmailHeader()}
    <div style="padding:24px;">
      <p style="font-size:16px;color:#333;">Hi ${customerName},</p>
      <p style="font-size:15px;color:#555;">Your <strong>${vehicleLabel}</strong> is all done and ready for pickup.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;text-align:center;">
        <p style="font-size:18px;color:#16a34a;font-weight:bold;margin:0;">Ready for Pickup</p>
      </div>
      <p style="font-size:15px;color:#555;"><strong>Hours:</strong> Mon–Fri 8:30 AM – 5 PM · Sat 9 AM – 1 PM</p>
      <p style="font-size:15px;color:#555;"><strong>Location:</strong> ${SHOP_INFO.address}</p>
      <p style="font-size:14px;color:#555;">Questions? Call <strong>${SHOP_INFO.phone}</strong>.</p>
    </div></div>`;
}

function buildReviewEmail({
  customerName,
  vehicleLabel,
}: {
  customerName: string;
  vehicleLabel: string;
}) {
  return `<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;">
    ${buildEmailHeader()}
    <div style="padding:24px;">
      <p style="font-size:16px;color:#333;">Hi ${customerName},</p>
      <p style="font-size:15px;color:#555;">Thank you for trusting us with your <strong>${vehicleLabel}</strong>! If you have a moment, we'd really appreciate a Google review.</p>
      <div style="margin:28px 0;text-align:center;"><a href="${GOOGLE_REVIEW_URL}" style="background:#dc2626;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">Leave a Review</a></div>
      <p style="font-size:14px;color:#888;">Thanks again for choosing Tires+!</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
      <p style="font-size:12px;color:#999;text-align:center;">${SHOP_INFO.name} · ${SHOP_INFO.address}<br/>${SHOP_INFO.phone}</p>
    </div></div>`;
}
