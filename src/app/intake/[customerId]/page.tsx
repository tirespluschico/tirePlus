"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SHOP_INFO } from "@/lib/constants";

const inputClass =
  "w-full border border-white/10 rounded-xl px-4 py-3.5 text-base text-white placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-red/60 focus:border-transparent transition-colors bg-brand-dark";

export default function CustomerIntakePage() {
  const params = useParams();
  const customerId = params.customerId as string;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/intake/${customerId}`);
        if (!res.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setForm({
          name: data.name === "New Customer" ? "" : data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
        });
      } catch {
        setNotFound(true);
      }
      setLoading(false);
    }
    load();
  }, [customerId]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/intake/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // silently fail in dev
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ink flex items-center justify-center">
        <p className="text-brand-muted">Loading...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-brand-ink flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Link Not Valid
          </h1>
          <p className="text-brand-muted">
            This intake link is no longer active. Please ask our team for help.
          </p>
          <div className="mt-8 text-brand-muted/50 text-xs">
            {SHOP_INFO.name} · {SHOP_INFO.phone}
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-ink flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold text-white mb-3">Thank You!</h1>
          <p className="text-brand-muted text-lg mb-2">
            We&apos;ve got your info. Please hand the tablet back to our team.
          </p>
          <p className="text-brand-muted text-sm">
            We&apos;ll take a look at your vehicle and keep you updated.
          </p>

          {/* Customer summary for admin */}
          <div className="mt-8 bg-brand-dark rounded-2xl border border-white/10 p-5 text-left">
            <p className="text-brand-muted text-xs uppercase tracking-wide mb-3">
              Customer Info
            </p>
            <p className="text-white font-semibold">{form.name}</p>
            <p className="text-brand-muted text-sm">{form.phone}</p>
            {form.email && (
              <p className="text-brand-muted text-sm">{form.email}</p>
            )}
            {form.address && (
              <p className="text-brand-muted text-sm">{form.address}</p>
            )}
          </div>

          <a
            href={`/admin/jobs/new?customerId=${customerId}`}
            className="inline-block mt-6 w-full bg-brand-red hover:bg-brand-red-hover text-white text-sm font-bold py-3 rounded-xl transition-colors"
          >
            Continue — Add Vehicle &amp; Services
          </a>

          <div className="mt-6 text-brand-muted/50 text-xs">
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
        <h1 className="text-xl font-bold text-white">{SHOP_INFO.name}</h1>
        <p className="text-brand-muted text-sm mt-1">
          Please fill out your information below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-6 py-8">
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
