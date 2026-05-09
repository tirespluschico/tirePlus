"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "��" },
  { href: "/admin/jobs", label: "Jobs", icon: "🔧" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-brand-dark min-h-screen border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="text-white font-black text-xl tracking-tight">
          Tires<span className="text-brand-red">+</span> Admin
        </Link>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-blue/30 text-white"
                  : "text-brand-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-brand-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <span>←</span>
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
