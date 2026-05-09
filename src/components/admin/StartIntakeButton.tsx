"use client";

import { useState } from "react";

export default function StartIntakeButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/intake/start", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.customerId) {
        window.open(`/intake/${data.customerId}`, "_blank");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`bg-transparent border border-white/15 hover:border-white/30 hover:bg-white/5 disabled:opacity-50 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors ${className || ""}`}
    >
      {loading ? "Starting…" : "Customer intake"}
    </button>
  );
}
