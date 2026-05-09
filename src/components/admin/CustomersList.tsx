"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type CustomerRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  vehicles: { id: string }[];
  jobs: { id: string }[];
};

export default function CustomersList({
  initialCustomers,
}: {
  initialCustomers: CustomerRow[];
}) {
  const router = useRouter();
  const [confirmCustomer, setConfirmCustomer] = useState<{
    id: string;
    name: string;
    vehicleCount: number;
    jobCount: number;
  } | null>(null);
  const [typedName, setTypedName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function openConfirm(c: CustomerRow) {
    setConfirmCustomer({
      id: c.id,
      name: c.name.trim(),
      vehicleCount: c.vehicles.length,
      jobCount: c.jobs.length,
    });
    setTypedName("");
  }

  function close() {
    if (deletingId) return;
    setConfirmCustomer(null);
    setTypedName("");
  }

  const matchOk =
    !!confirmCustomer &&
    (confirmCustomer.name.length === 0 ||
      typedName.trim() === confirmCustomer.name);

  async function confirmDelete() {
    if (!confirmCustomer || !matchOk) return;
    const id = confirmCustomer.id;
    setDeletingId(id);
    const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
    if (res.ok) {
      setConfirmCustomer(null);
      setTypedName("");
      setDeletingId(null);
      router.refresh();
      return;
    }
    const data = await res.json().catch(() => ({}));
    setErrorMsg(data?.error || "Failed to delete customer.");
    setDeletingId(null);
  }

  if (initialCustomers.length === 0) {
    return (
      <div className="border border-white/10 rounded p-12 text-center">
        <p className="text-brand-muted text-sm">No customers yet.</p>
      </div>
    );
  }

  return (
    <>
      {confirmCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="bg-brand-dark border border-white/10 rounded-md shadow-2xl w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white">
                Delete customer?
              </h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-brand-muted">
                This permanently removes{" "}
                <span className="text-white font-medium">
                  {confirmCustomer.name || "this customer"}
                </span>{" "}
                along with{" "}
                <span className="text-white">
                  {confirmCustomer.vehicleCount} vehicle
                  {confirmCustomer.vehicleCount === 1 ? "" : "s"}
                </span>{" "}
                and{" "}
                <span className="text-white">
                  {confirmCustomer.jobCount} job
                  {confirmCustomer.jobCount === 1 ? "" : "s"}
                </span>{" "}
                (including all inspection history). This cannot be undone.
              </p>
              {confirmCustomer.name.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-brand-muted">
                    To confirm, type the customer&apos;s name:{" "}
                    <span className="text-white font-medium">
                      {confirmCustomer.name}
                    </span>
                  </p>
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && matchOk && !deletingId) {
                        e.preventDefault();
                        confirmDelete();
                      }
                    }}
                    autoFocus
                    placeholder="Customer name"
                    className="w-full bg-black/30 border border-white/10 focus:border-white/30 focus:outline-none rounded px-3 py-2 text-sm text-white placeholder:text-brand-muted/40"
                  />
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                disabled={!!deletingId}
                className="text-sm text-brand-muted hover:text-white px-3 py-1.5 rounded transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={!matchOk || !!deletingId}
                className="bg-brand-red hover:bg-brand-red-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
              >
                {deletingId ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setErrorMsg(null)}
        >
          <div
            className="bg-brand-dark border border-white/10 rounded-md shadow-2xl w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white">Error</h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-brand-muted">{errorMsg}</p>
            </div>
            <div className="px-5 py-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="bg-brand-red hover:bg-brand-red-hover text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-white/10 rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-left text-xs text-brand-muted">
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Phone</th>
              <th className="px-4 py-2 font-medium text-right">
                Customer since
              </th>
              <th className="px-2 py-2 font-medium text-right w-10"></th>
            </tr>
          </thead>
          <tbody>
            {initialCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-white/10 hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-2.5">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="text-white hover:text-brand-red font-medium"
                  >
                    {customer.name}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-brand-muted">
                  {customer.email || "—"}
                </td>
                <td className="px-4 py-2.5 text-brand-muted">
                  {customer.phone || "—"}
                </td>
                <td className="px-4 py-2.5 text-brand-muted text-right whitespace-nowrap">
                  {new Date(customer.created_at).toLocaleDateString()}
                </td>
                <td className="px-2 py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => openConfirm(customer)}
                    disabled={deletingId === customer.id}
                    className="text-brand-muted hover:text-red-400 disabled:opacity-40 text-xs px-2 py-1 rounded transition-colors"
                    title="Delete customer"
                  >
                    {deletingId === customer.id ? "…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
