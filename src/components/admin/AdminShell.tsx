"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SignOutButton from "@/components/admin/SignOutButton";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-brand-ink text-white">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-brand-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-6">
          <Link href="/admin" className="relative block h-7 w-[130px] shrink-0">
            <Image
              src="/images/tireplus.png"
              alt="Tires+"
              fill
              priority
              className="object-contain object-left"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-sm transition-colors ${
                  isActive(item.href)
                    ? "text-white"
                    : "text-brand-muted hover:text-white"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute left-3 right-3 -bottom-[15px] h-[2px] bg-brand-red" />
                )}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              className="hidden md:inline-block text-xs text-brand-muted hover:text-white transition-colors"
            >
              ← Back to site
            </Link>
            <SignOutButton className="hidden md:inline-block" />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="md:hidden p-2 -mr-2 text-brand-muted hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden border-t border-white/10 bg-brand-dark">
            <nav className="px-4 py-2 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-2 py-2.5 text-sm transition-colors ${
                    isActive(item.href)
                      ? "text-white"
                      : "text-brand-muted hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-white/10 mt-1 pt-2 flex flex-col">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="px-2 py-2 text-xs text-brand-muted hover:text-white transition-colors"
                >
                  ← Back to public site
                </Link>
                <SignOutButton className="px-2 py-2 text-left" />
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
