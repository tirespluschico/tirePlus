"use client";

import { useState } from "react";
import { SHOP_INFO } from "@/lib/constants";

const inputClass =
  "w-full border border-white/10 rounded-xl px-4 py-3.5 text-base text-white placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-red/60 focus:border-transparent transition-colors bg-brand-dark";

export default function IntakePage() {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    year: "",
    make: "",
    model: "",
    plate: "",
    description: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSaving(true);

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
        // Reset after 8 seconds for next customer
        setTimeout(() => {
          setSubmitted(false);
          setForm({
            name: "",
            phone: "",
            email: "",
            address: "",
            year: "",
            make: "",
            model: "",
            plate: "",
            description: "",
          });
        }, 8000);
      }
    } catch {
      // silently fail in dev
    }

    setSaving(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-ink flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Thank You!
          </h1>
          <p className="text-brand-muted text-lg mb-2">
            We&apos;ve got your info. Please hand the tablet back to our team.
          </p>
          <p className="text-brand-muted text-sm">
            We&apos;ll take a look at your vehicle and keep you updated.
          </p>
          <div className="mt-8 text-brand-muted/50 text-xs">
            {SHOP_INFO.name} · {SHOP_INFO.phone}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ink">
      {/* Header */}
      <div className="bg-brand-dark/50 border-b border-white/10 px-6 py-5 text-center">
        <h1 className="text-xl font-bold text-white">
          {SHOP_INFO.name}
        </h1>
        <p className="text-brand-muted text-sm mt-1">
          Please fill out your information below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-6 py-8">
        {/* Your Info */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wide mb-4">
            Your Information
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name *"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
              required
              autoFocus
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass}
              required
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Address (optional)"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wide mb-4">
            Vehicle Information
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Year"
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Make"
                value={form.make}
                onChange={(e) => update("make", e.target.value)}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Model"
                value={form.model}
                onChange={(e) => update("model", e.target.value)}
                className={inputClass}
              />
            </div>
            <input
              type="text"
              placeholder="License Plate (optional)"
              value={form.plate}
              onChange={(e) => update("plate", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* What they need */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wide mb-4">
            How Can We Help?
          </h2>
          <textarea
            placeholder="Tell us what you need — e.g. new tires, brake noise, oil change..."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className={inputClass}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!form.name || !form.phone || saving}
          className="w-full bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 text-white text-lg font-bold py-4 rounded-xl transition-colors"
        >
          {saving ? "Submitting..." : "Submit"}
        </button>

        <p className="text-center text-brand-muted/50 text-xs mt-6">
          {SHOP_INFO.address} · {SHOP_INFO.phone}
        </p>
      </form>
    </div>
  );
}
