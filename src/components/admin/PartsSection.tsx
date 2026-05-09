"use client";

import { useState } from "react";

type PartStatus = "needed" | "ordered" | "in_stock";

export type JobPart = {
  id: string;
  name: string;
  quantity: number;
  status: PartStatus;
  notes: string | null;
};

const STATUSES: { value: PartStatus; label: string; activeBg: string; activeText: string; dot: string }[] = [
  { value: "needed", label: "Needed", activeBg: "bg-red-500/20", activeText: "text-red-300", dot: "bg-red-500" },
  { value: "ordered", label: "Ordered", activeBg: "bg-amber-400/20", activeText: "text-amber-300", dot: "bg-amber-400" },
  { value: "in_stock", label: "In stock", activeBg: "bg-green-500/20", activeText: "text-green-300", dot: "bg-green-500" },
];

function StatusToggle({
  value,
  onChange,
  size = "sm",
}: {
  value: PartStatus;
  onChange: (v: PartStatus) => void;
  size?: "sm" | "md";
}) {
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1.5";
  return (
    <div className="inline-flex border border-white/15 rounded overflow-hidden text-xs">
      {STATUSES.map((s) => {
        const active = s.value === value;
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            className={`${padding} transition-colors border-r border-white/15 last:border-r-0 ${
              active
                ? `${s.activeBg} ${s.activeText} font-medium`
                : "text-brand-muted hover:text-white hover:bg-white/5"
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

export default function PartsSection({
  jobId,
  initialParts,
  onChange,
}: {
  jobId: string;
  initialParts: JobPart[];
  onChange?: () => void;
}) {
  const [parts, setParts] = useState<JobPart[]>(initialParts);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("1");
  const [status, setStatus] = useState<PartStatus>("needed");
  const [busy, setBusy] = useState(false);

  async function addPart(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/jobs/${jobId}/parts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, quantity: qty, status }),
    });
    setBusy(false);
    if (!res.ok) {
      alert("Failed to add part");
      return;
    }
    const newPart = await res.json();
    setParts((prev) => [...prev, newPart]);
    setName("");
    setQty("1");
    setStatus("needed");
    onChange?.();
  }

  async function updatePart(part: JobPart, updates: Partial<JobPart>) {
    setParts((prev) =>
      prev.map((p) => (p.id === part.id ? { ...p, ...updates } : p))
    );
    const res = await fetch(`/api/jobs/${jobId}/parts/${part.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      alert("Failed to update part");
    }
    onChange?.();
  }

  async function removePart(part: JobPart) {
    if (!confirm(`Remove ${part.name}?`)) return;
    setParts((prev) => prev.filter((p) => p.id !== part.id));
    const res = await fetch(`/api/jobs/${jobId}/parts/${part.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      alert("Failed to remove part");
    }
    onChange?.();
  }

  const inputClass =
    "bg-brand-ink border border-white/10 rounded px-2 py-1.5 text-sm text-white placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-red";

  const counts = parts.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="border border-white/10 rounded p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white">Parts</h2>
        {parts.length > 0 && (
          <p className="text-xs text-brand-muted">
            {[
              counts.needed && `${counts.needed} needed`,
              counts.ordered && `${counts.ordered} ordered`,
              counts.in_stock && `${counts.in_stock} in stock`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </div>

      {parts.length > 0 && (
        <div className="border border-white/10 rounded mb-3 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-left text-xs text-brand-muted">
                <th className="px-3 py-2 font-medium">Part</th>
                <th className="px-3 py-2 font-medium w-12 text-center">Qty</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium w-8"></th>
              </tr>
            </thead>
            <tbody>
              {parts.map((part) => (
                <tr key={part.id} className="border-t border-white/10">
                  <td className="px-3 py-2 text-white">{part.name}</td>
                  <td className="px-3 py-2 text-brand-muted text-center">
                    {part.quantity}
                  </td>
                  <td className="px-3 py-2">
                    <StatusToggle
                      value={part.status}
                      onChange={(v) => updatePart(part, { status: v })}
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => removePart(part)}
                      className="text-brand-muted hover:text-red-400 text-base leading-none"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add form */}
      <form onSubmit={addPart} className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Part name (e.g. Front brake pads)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inputClass} flex-1 min-w-[180px]`}
        />
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className={`${inputClass} w-16 text-center`}
        />
        <StatusToggle value={status} onChange={setStatus} />
        <button
          type="submit"
          disabled={!name.trim() || busy}
          className="bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
        >
          {busy ? "Adding…" : "Add"}
        </button>
      </form>

      {parts.length === 0 && (
        <p className="text-brand-muted text-xs mt-2">
          No parts logged yet. Add anything you need to order or have in stock.
        </p>
      )}
    </div>
  );
}
