"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/financing", label: "Financing" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-brand-dark/95 backdrop-blur-md text-white sticky top-0 z-50 shadow-lg border-b border-brand-red/25">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-black tracking-tight">
            TIRES<span className="text-brand-red">+</span>
          </span>
          <span className="hidden sm:block text-xs text-brand-muted uppercase tracking-widest">
            Complete Auto Service
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-semibold uppercase tracking-wide transition-colors hover:text-white ${
                pathname === href ? "text-white" : "text-brand-muted"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-brand-red hover:bg-brand-red-hover transition-colors text-white text-sm font-bold px-6 py-2 rounded-full"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-brand-muted hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-brand-blue border-t border-white/10 px-4 pb-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 text-sm font-semibold uppercase tracking-wide border-b border-white/10 transition-colors hover:text-white ${
                pathname === href ? "text-white" : "text-brand-muted"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="block mt-4 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-bold px-6 py-2.5 rounded-full text-center transition-colors"
          >
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
