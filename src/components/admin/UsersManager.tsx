"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ShopUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
};

export default function UsersManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: ShopUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<ShopUser[]>(initialUsers);
  const [form, setForm] = useState({ email: "", name: "", role: "tech" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const res = await fetch("/api/shop-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Failed to add user");
      return;
    }
    setUsers((prev) => [...prev, data]);
    setForm({ email: "", name: "", role: "tech" });
    router.refresh();
  }

  async function removeUser(id: string) {
    if (!confirm("Remove this user? They won't be able to sign in anymore.")) return;
    const res = await fetch(`/api/shop-users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to remove user");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    router.refresh();
  }

  const inputClass =
    "bg-brand-ink border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-red";

  return (
    <div>
      {/* Add user form */}
      <form
        onSubmit={addUser}
        className="border border-white/10 rounded p-4 mb-6 flex flex-wrap gap-2 items-end"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-brand-muted">Email</label>
          <input
            type="email"
            placeholder="staff@gmail.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`${inputClass} w-64`}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-brand-muted">Name (optional)</label>
          <input
            type="text"
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`${inputClass} w-44`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-brand-muted">Role</label>
          <div className="inline-flex border border-white/15 rounded overflow-hidden text-sm h-[34px]">
            {(["tech", "owner"] as const).map((r) => {
              const active = form.role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={`px-3 capitalize transition-colors border-r border-white/15 last:border-r-0 ${
                    active
                      ? "bg-brand-red/20 text-brand-red font-medium"
                      : "text-brand-muted hover:text-white hover:bg-white/5"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
        <button
          type="submit"
          disabled={saving || !form.email}
          className="bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 text-white text-sm font-medium px-3 py-2 rounded transition-colors"
        >
          {saving ? "Adding…" : "Add user"}
        </button>
      </form>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-3 py-2 rounded">
          {error}
        </div>
      )}

      {/* Users table */}
      {users.length === 0 ? (
        <div className="border border-white/10 rounded p-8 text-center text-brand-muted text-sm">
          No users yet.
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/10 rounded">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-left text-xs text-brand-muted">
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Role</th>
                <th className="px-4 py-2 font-medium">Added</th>
                <th className="px-4 py-2 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-2.5 text-white">{u.name || "—"}</td>
                  <td className="px-4 py-2.5 text-brand-muted">{u.email}</td>
                  <td className="px-4 py-2.5 capitalize text-brand-muted">
                    {u.role}
                  </td>
                  <td className="px-4 py-2.5 text-brand-muted">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {u.id === currentUserId ? (
                      <span className="text-xs text-brand-muted">You</span>
                    ) : (
                      <button
                        onClick={() => removeUser(u.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
