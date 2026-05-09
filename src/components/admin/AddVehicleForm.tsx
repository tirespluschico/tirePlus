"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddVehicleForm({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ year: "", make: "", model: "", plate: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.make || !form.model) return;
    setSaving(true);
    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: customerId,
        year: form.year ? parseInt(form.year) : null,
        make: form.make.trim(),
        model: form.model.trim(),
        plate: form.plate.trim() || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setForm({ year: "", make: "", model: "", plate: "" });
      setOpen(false);
      router.refresh();
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-brand-red text-xs hover:underline"
      >
        + Add vehicle
      </button>
    );
  }

  const inputClass =
    "bg-brand-ink border border-white/10 rounded px-2 py-1 text-sm text-white placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-red";

  return (
    <form onSubmit={submit} className="border border-white/10 rounded p-3 mt-2 flex flex-wrap gap-2 items-end">
      <input
        type="number"
        placeholder="Year"
        value={form.year}
        onChange={(e) => setForm({ ...form, year: e.target.value })}
        className={`${inputClass} w-20`}
      />
      <input
        type="text"
        placeholder="Make *"
        value={form.make}
        onChange={(e) => setForm({ ...form, make: e.target.value })}
        className={`${inputClass} w-28`}
        required
      />
      <input
        type="text"
        placeholder="Model *"
        value={form.model}
        onChange={(e) => setForm({ ...form, model: e.target.value })}
        className={`${inputClass} w-32`}
        required
      />
      <input
        type="text"
        placeholder="Plate"
        value={form.plate}
        onChange={(e) => setForm({ ...form, plate: e.target.value })}
        className={`${inputClass} w-24`}
      />
      <button
        type="submit"
        disabled={!form.make || !form.model || saving}
        className="bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
      >
        {saving ? "Saving…" : "Save"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-brand-muted hover:text-white text-xs px-2 py-1 transition-colors"
      >
        Cancel
      </button>
    </form>
  );
}
