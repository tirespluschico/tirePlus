"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "adas-popup-seen";
const DELAY_MS = 5000;

export default function AdasPopup() {
  const [open, setOpen] = useState(false);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Private browsing or blocked storage — it just shows again next visit.
    }
  }, []);

  useEffect(() => {
    // ?adas=1 forces the bar to show again, for previewing after it's been dismissed.
    const forced = new URLSearchParams(window.location.search).get("adas") === "1";

    let seen = false;
    try {
      seen = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen && !forced) return;

    const timer = window.setTimeout(() => setOpen(true), forced ? 300 : DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <aside
      aria-label="New service announcement"
      className="fixed z-50 bottom-0 inset-x-0 border-t border-brand-red/50 bg-brand-ink/95 backdrop-blur-sm shadow-[0_-8px_24px_rgba(18,23,34,0.35)] animate-[slideUp_280ms_cubic-bezier(0.16,1,0.3,1)]"
    >
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3 sm:gap-4">
        <span className="hidden sm:inline-flex shrink-0 items-center gap-1.5 bg-brand-red text-white text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full">
          <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
          New
        </span>

        <p className="flex-1 min-w-0 text-sm leading-snug text-brand-muted">
          <span className="font-bold text-white">ADAS calibration is here.</span>{" "}
          <span className="hidden sm:inline">
            Lane keep, blind spot, and automatic braking — recalibrated in-house, no dealership
            trip.
          </span>
          <span className="sm:hidden">Done in-house — skip the dealership.</span>
        </p>

        <Link
          href="/services/adas"
          onClick={dismiss}
          className="shrink-0 bg-brand-red hover:bg-brand-red-hover transition-colors text-white font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wide"
        >
          Learn More
        </Link>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 h-7 w-7 grid place-items-center rounded-full text-brand-muted hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
        >
          &times;
        </button>
      </div>
    </aside>
  );
}
