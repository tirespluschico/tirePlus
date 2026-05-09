"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/customers", label: "Customers" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-brand-dark min-h-screen border-r border-white/10 flex flex-col">
      <div className="px-5 py-6 border-b border-white/10">
        <Link href="/admin" className="relative block h-10 w-[160px]">
          <Image
            src="/images/tireplus.png"
            alt="Tires+"
            fill
            priority
            className="object-contain object-left"
          />
        </Link>
        <p className="text-brand-muted text-[10px] uppercase tracking-[0.2em] mt-2">
          Admin
        </p>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-brand-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          className="block px-3 py-2 rounded-md text-sm text-brand-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          ← Back to Site
        </Link>
      </div>
    </aside>
  );
}
