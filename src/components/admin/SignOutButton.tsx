"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton({ className = "" }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className={`text-xs text-brand-muted hover:text-white transition-colors ${className}`}
    >
      Sign out
    </button>
  );
}
