"use client";

import { useState, FormEvent } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const services = [
  "Tire Installation", "Tire Rotation", "Flat Tire Repair", "Wheel Alignment",
  "Brake Service", "Oil Change", "Battery Replacement", "Tune Up",
  "Timing Belt", "Struts & Shocks", "AC Service", "Other",
];

const inputClass =
  "border border-brand-dark/20 rounded-xl px-3 py-2.5 text-sm text-brand-ink placeholder:text-brand-dark/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/60 focus:border-transparent transition-colors bg-brand-panel/75";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center rounded-2xl border border-brand-blue/15 bg-brand-panel/35">
        <span className="text-5xl">✅</span>
        <h3 className="text-xl font-bold text-brand-ink">Message Received!</h3>
        <p className="text-brand-dark/75 text-sm">
          Thanks, {form.name}! We&apos;ll be in touch within one business day.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", service: "", message: "" }); }}
          className="text-brand-red text-sm font-semibold hover:underline mt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-brand-dark/70 uppercase tracking-wide">
            Full Name <span className="text-brand-red">*</span>
          </label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="John Doe" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-brand-dark/70 uppercase tracking-wide">
            Email <span className="text-brand-red">*</span>
          </label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="john@example.com" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-xs font-semibold text-brand-dark/70 uppercase tracking-wide">Phone</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(555) 000-0000" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="service" className="text-xs font-semibold text-brand-dark/70 uppercase tracking-wide">Service Needed</label>
          <select id="service" name="service" value={form.service} onChange={handleChange} className={inputClass}>
            <option value="">Select a service</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-semibold text-brand-dark/70 uppercase tracking-wide">
          Message <span className="text-brand-red">*</span>
        </label>
        <textarea id="message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Tell us about your vehicle and what you need..." className={`${inputClass} resize-none`} />
      </div>

      <button type="submit" className="bg-brand-red hover:bg-brand-red-hover transition-colors text-white font-bold py-3 rounded-full text-sm uppercase tracking-wide shadow">
        Send Message
      </button>
    </form>
  );
}
