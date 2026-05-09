"use client";

// TODO: Re-enable session usage before deploying
// import { signOut, useSession } from "next-auth/react";

export default function AdminHeader() {
  // const { data: session } = useSession();

  return (
    <header className="h-16 bg-brand-dark/50 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-brand-muted">Dev Mode</span>
      </div>
    </header>
  );
}
