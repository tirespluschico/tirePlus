import { supabase } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { SHOP_INFO } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle Inspection Report | Tires+",
  robots: { index: false, follow: false },
};

const statusLabels: Record<string, { label: string; color: string; bg: string; border: string }> = {
  red: { label: "Needs Attention", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
  yellow: { label: "Monitor / Needs Soon", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  green: { label: "Good Condition", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
};

const statusEmoji: Record<string, string> = {
  red: "🔴",
  yellow: "🟡",
  green: "🟢",
};

export default async function PublicInspectionPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  const { data: job, error } = await supabase
    .from("jobs")
    .select(
      "id, status, customer:customers(name), vehicle:vehicles(year, make, model), inspection_items(name, status, note, sort_order)"
    )
    .eq("id", jobId)
    .single();

  if (error || !job) notFound();

  const customer = job.customer as unknown as { name: string } | null;
  const vehicle = job.vehicle as unknown as { year: number | null; make: string; model: string } | null;
  const items = ((job.inspection_items || []) as { name: string; status: string; note: string | null; sort_order: number }[])
    .sort((a, b) => a.sort_order - b.sort_order);

  const vehicleLabel = vehicle
    ? `${vehicle.year || ""} ${vehicle.make} ${vehicle.model}`.trim()
    : "Your Vehicle";

  const grouped: Record<string, typeof items> = { red: [], yellow: [], green: [] };
  for (const item of items) {
    if (grouped[item.status]) grouped[item.status].push(item);
  }

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="max-w-lg mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold">{SHOP_INFO.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{SHOP_INFO.address}</p>
          <p className="text-gray-400 text-sm">{SHOP_INFO.phone}</p>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
            Inspection Report
          </p>
          <p className="text-lg font-semibold">{vehicleLabel}</p>
          {customer && (
            <p className="text-gray-400 text-sm">for {customer.name}</p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
            <p className="text-gray-400">No inspection items yet.</p>
          </div>
        ) : (
          (["red", "yellow", "green"] as const).map((status) => {
            const group = grouped[status];
            if (group.length === 0) return null;
            const config = statusLabels[status];
            return (
              <div key={status} className="mb-5">
                <h2 className={`text-sm font-semibold ${config.color} mb-2`}>
                  {statusEmoji[status]} {config.label}
                </h2>
                <div className="space-y-2">
                  {group.map((item, i) => (
                    <div
                      key={i}
                      className={`${config.bg} border ${config.border} rounded-xl px-4 py-3`}
                    >
                      <p className="text-white text-sm font-medium">{item.name}</p>
                      {item.note && (
                        <p className="text-gray-400 text-xs mt-1">{item.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}

        <div className="text-center mt-10">
          <p className="text-gray-500 text-xs">
            Questions? Call us at{" "}
            <a href={`tel:${SHOP_INFO.phone}`} className="text-white underline">
              {SHOP_INFO.phone}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
