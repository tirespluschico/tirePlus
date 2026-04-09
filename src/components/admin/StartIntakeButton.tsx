"use client";

import { useState } from "react";

export default function StartIntakeButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Customer" }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        window.location.href = `/intake/${data.id}`;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`bg-brand-blue hover:bg-brand-blue-light disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${className || ""}`}
    >
      {loading ? "Setting up..." : "Customer Intake"}
    </button>
  );
}
