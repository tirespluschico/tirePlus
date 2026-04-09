"use client";

import { useState } from "react";
import { INSPECTION_PRESETS } from "@/lib/constants";
import type { InspectionStatus } from "@/lib/supabase/types";

interface InspectionItem {
  name: string;
  status: InspectionStatus;
  note: string;
}

interface InspectionEditorProps {
  jobId: string;
  initialItems: InspectionItem[];
  onSaved?: () => void;
}

const statusColors: Record<InspectionStatus, { bg: string; ring: string; label: string }> = {
  green: { bg: "bg-green-500", ring: "ring-green-500/50", label: "Good" },
  yellow: { bg: "bg-yellow-400", ring: "ring-yellow-400/50", label: "Soon" },
  red: { bg: "bg-red-500", ring: "ring-red-500/50", label: "Now" },
};

export default function InspectionEditor({
  jobId,
  initialItems,
  onSaved,
}: InspectionEditorProps) {
  const [items, setItems] = useState<InspectionItem[]>(
    initialItems.length > 0
      ? initialItems
      : []
  );
  const [saving, setSaving] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  function addItem(name = "") {
    setItems([...items, { name, status: "green", note: "" }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, updates: Partial<InspectionItem>) {
    setItems(items.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  }

  function addPresets(presets: string[]) {
    const existingNames = new Set(items.map((i) => i.name.toLowerCase()));
    const newItems = presets
      .filter((p) => !existingNames.has(p.toLowerCase()))
      .map((name) => ({ name, status: "green" as InspectionStatus, note: "" }));
    setItems([...items, ...newItems]);
    setShowPresets(false);
  }

  async function save() {
    setSaving(true);
    await fetch(`/api/jobs/${jobId}/inspection`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    setSaving(false);
    onSaved?.();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Inspection Items</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="text-brand-blue-light text-xs hover:text-white transition-colors"
          >
            {showPresets ? "Hide Presets" : "+ Add Presets"}
          </button>
          <button
            onClick={() => addItem()}
            className="text-brand-blue-light text-xs hover:text-white transition-colors"
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Presets dropdown */}
      {showPresets && (
        <div className="bg-brand-dark rounded-xl border border-white/10 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-brand-muted text-xs uppercase tracking-wide">
              Quick Add
            </p>
            <button
              onClick={() => addPresets(INSPECTION_PRESETS)}
              className="text-brand-red text-xs font-semibold hover:text-brand-red-hover transition-colors"
            >
              Add All
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {INSPECTION_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => addPresets([preset])}
                className="text-xs bg-white/5 text-brand-muted hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-brand-dark rounded-xl border border-white/10 p-3 flex gap-3 items-start"
          >
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(index, { name: e.target.value })}
                placeholder="Item name"
                className="w-full bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-brand-muted/50"
              />
              <input
                type="text"
                value={item.note}
                onChange={(e) => updateItem(index, { note: e.target.value })}
                placeholder="Note (optional)"
                className="w-full bg-transparent border-none text-brand-muted text-xs focus:outline-none placeholder:text-brand-muted/30"
              />
            </div>

            {/* Status toggles */}
            <div className="flex gap-1.5 items-center">
              {(["green", "yellow", "red"] as InspectionStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => updateItem(index, { status: s })}
                  title={statusColors[s].label}
                  className={`w-7 h-7 rounded-full transition-all ${statusColors[s].bg} ${
                    item.status === s
                      ? `ring-2 ${statusColors[s].ring} scale-110`
                      : "opacity-30 hover:opacity-60"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => removeItem(index)}
              className="text-brand-muted hover:text-red-400 text-sm transition-colors mt-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="bg-brand-dark rounded-xl border border-white/10 p-8 text-center">
          <p className="text-brand-muted text-sm">
            No inspection items yet. Add items or use presets.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <button
          onClick={save}
          disabled={saving}
          className="mt-4 bg-brand-blue hover:bg-brand-blue-light disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          {saving ? "Saving..." : "Save Inspection"}
        </button>
      )}
    </div>
  );
}
