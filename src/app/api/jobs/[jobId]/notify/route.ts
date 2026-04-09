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
    .select("*, customer:customers(*), vehicle:vehicles(*), inspection_items(*)")
    .eq("id", jobId)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const customer = job.customer;
  const vehicle = job.vehicle;
  const items = (job.inspection_items || []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  );

  const redItems = items.filter((i: { status: string }) => i.status === "red");
  const yellowItems = items.filter((i: { status: string }) => i.status === "yellow");
  const greenItems = items.filter((i: { status: string }) => i.status === "green");

  const vehicleLabel = vehicle
    ? `${vehicle.year || ""} ${vehicle.make} ${vehicle.model}`.trim()
    : "your vehicle";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const inspectionUrl = `${siteUrl}/status/${jobId}`;

  if (DEV_MODE) {
    console.log("\n========== INSPECTION NOTIFICATION ==========");
    console.log(`To: ${customer.name} (${customer.email || "no email"} / ${customer.phone || "no phone"})`);
    console.log(`Vehicle: ${vehicleLabel}`);
    console.log(`View report: ${inspectionUrl}`);
    console.log(`🔴 Needs attention (${redItems.length}):`);
    redItems.forEach((i: { name: string; note: string | null }) => console.log(`   - ${i.name}${i.note ? ` (${i.note})` : ""}`));
    console.log(`🟡 Monitor (${yellowItems.length}):`);
    yellowItems.forEach((i: { name: string; note: string | null }) => console.log(`   - ${i.name}${i.note ? ` (${i.note})` : ""}`));
    console.log(`🟢 Good (${greenItems.length}):`);
    greenItems.forEach((i: { name: string; note: string | null }) => console.log(`   - ${i.name}${i.note ? ` (${i.note})` : ""}`));
    console.log("==============================================\n");
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
          subject: `Vehicle Inspection Report — ${vehicleLabel}`,
          html: buildInspectionEmail({ customerName: customer.name, vehicleLabel, redItems, yellowItems, greenItems, inspectionUrl }),
        });
        await supabase.from("notification_log").insert({ job_id: jobId, channel: "email", type: "inspection", status: "sent" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Email send failed";
        await supabase.from("notification_log").insert({ job_id: jobId, channel: "email", type: "inspection", status: "failed", error: msg });
      }
    }

    if (customer.phone) {
      try {
        const parts = [];
        if (redItems.length > 0) parts.push(`🔴 ${redItems.length} need attention`);
        if (yellowItems.length > 0) parts.push(`🟡 ${yellowItems.length} monitor`);
        if (greenItems.length > 0) parts.push(`🟢 ${greenItems.length} good`);
        await twilioClient.messages.create({
          body: `Hi ${customer.name}, your inspection for ${vehicleLabel} is ready. ${parts.join(", ")}. View report: ${inspectionUrl} — Tires+ (${SHOP_INFO.phone})`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: customer.phone,
        });
        await supabase.from("notification_log").insert({ job_id: jobId, channel: "sms", type: "inspection", status: "sent" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "SMS send failed";
        await supabase.from("notification_log").insert({ job_id: jobId, channel: "sms", type: "inspection", status: "failed", error: msg });
      }
    }
  }

  await supabase
    .from("jobs")
    .update({ notified_at: new Date().toISOString() })
    .eq("id", jobId);

  return NextResponse.json({ success: true });
}

function buildInspectionEmail({ customerName, vehicleLabel, redItems, yellowItems, greenItems, inspectionUrl }: {
  customerName: string; vehicleLabel: string;
  redItems: { name: string; note: string | null }[];
  yellowItems: { name: string; note: string | null }[];
  greenItems: { name: string; note: string | null }[];
  inspectionUrl: string;
}) {
  const renderItems = (items: { name: string; note: string | null }[], color: string, emoji: string) =>
    items.map((i) =>
      `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">
        <span style="color:${color};font-weight:bold;font-size:16px;">${emoji}</span>
        &nbsp; ${i.name}${i.note ? `<br/><span style="color:#888;font-size:13px;">${i.note}</span>` : ""}
      </td></tr>`
    ).join("");

  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
    <div style="background:#1a1a1a;padding:24px;text-align:center;"><h1 style="color:#fff;margin:0;font-size:22px;">Tires+ Complete Auto Service</h1></div>
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
