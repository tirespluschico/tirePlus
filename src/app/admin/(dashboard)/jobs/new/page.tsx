"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SERVICES } from "@/lib/constants";

interface CustomerResult {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

interface VehicleResult {
  id: string;
  year: number | null;
  make: string;
  model: string;
  plate: string | null;
}

type Step = "customer" | "vehicle" | "services";

const inputClass =
  "w-full border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/60 focus:border-transparent transition-colors bg-brand-dark";

export default function NewJobPage() {
  return (
    <Suspense>
      <NewJobContent />
    </Suspense>
  );
}

function NewJobContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("customer");
  const [saving, setSaving] = useState(false);

  // Customer state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CustomerResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResult | null>(null);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Vehicle state
  const [existingVehicles, setExistingVehicles] = useState<VehicleResult[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleResult | null>(null);
  const [showNewVehicle, setShowNewVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    year: "",
    make: "",
    model: "",
    plate: "",
  });

  // Services state
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // Auto-select customer from query param (e.g. from tablet intake)
  useEffect(() => {
    const customerId = searchParams.get("customerId");
    if (!customerId) return;

    async function loadCustomer() {
      try {
        const res = await fetch(`/api/customers/${customerId}`);
        if (!res.ok) return;
        const data = await res.json();
        const customer: CustomerResult = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
        };
        setSelectedCustomer(customer);
        setExistingVehicles(data.vehicles || []);
        setStep("vehicle");
      } catch {
        // fall through to manual customer selection
      }
    }
    loadCustomer();
  }, [searchParams]);

  async function searchCustomers(q: string) {
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/customers?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  }

  async function createCustomer() {
    if (!newCustomer.name) return;
    setSaving(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });
      const data = await res.json();
      if (!res.ok || !data.id) {
        alert("Failed to create customer: " + (data.error || "Unknown error"));
        setSaving(false);
        return;
      }
      setSelectedCustomer(data);
      setShowNewCustomer(false);
      setSaving(false);
      await loadVehicles(data.id);
      setStep("vehicle");
    } catch (err) {
      alert("Error creating customer: " + (err instanceof Error ? err.message : "Unknown"));
      setSaving(false);
    }
  }

  function selectCustomer(customer: CustomerResult) {
    setSelectedCustomer(customer);
    loadVehicles(customer.id);
    setStep("vehicle");
  }

  async function loadVehicles(customerId: string) {
    const res = await fetch(`/api/customers/${customerId}`);
    const data = await res.json();
    setExistingVehicles(data.vehicles || []);
  }

  async function createVehicle() {
    if (!newVehicle.make || !newVehicle.model || !selectedCustomer) return;
    setSaving(true);
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: selectedCustomer.id,
          year: newVehicle.year ? parseInt(newVehicle.year) : null,
          make: newVehicle.make,
          model: newVehicle.model,
          plate: newVehicle.plate,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.id) {
        alert("Failed to add vehicle: " + (data.error || "Unknown error"));
        setSaving(false);
        return;
      }
      setSelectedVehicle(data);
      setShowNewVehicle(false);
      setSaving(false);
      setStep("services");
    } catch (err) {
      alert("Error adding vehicle: " + (err instanceof Error ? err.message : "Unknown"));
      setSaving(false);
    }
  }

  function selectVehicle(vehicle: VehicleResult) {
    setSelectedVehicle(vehicle);
    setStep("services");
  }

  function toggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  }

  async function createJob() {
    if (!selectedCustomer) return;
    setSaving(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: selectedCustomer.id,
          vehicle_id: selectedVehicle?.id || null,
          services: selectedServices,
          notes: notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.id) {
        alert("Failed to create job: " + (data.error || "Unknown error"));
        setSaving(false);
        return;
      }
      setSaving(false);
      router.push(`/admin/jobs/${data.id}`);
    } catch (err) {
      alert("Error creating job: " + (err instanceof Error ? err.message : "Unknown"));
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">New Job</h1>

      {/* Step indicator */}
      <div className="flex gap-2 mb-8">
        {(["customer", "vehicle", "services"] as Step[]).map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              step === s
                ? "bg-brand-red"
                : (s === "vehicle" && step === "services") ||
                    (s === "customer" && (step === "vehicle" || step === "services"))
                  ? "bg-brand-blue"
                  : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Customer */}
      {step === "customer" && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            1. Select or Create Customer
          </h2>

          {!showNewCustomer ? (
            <>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => searchCustomers(e.target.value)}
                className={inputClass}
                autoFocus
              />

              {searching && (
                <p className="text-brand-muted text-sm mt-2">Searching...</p>
              )}

              {searchResults.length > 0 && (
                <div className="mt-3 space-y-2">
                  {searchResults.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => selectCustomer(c)}
                      className="w-full text-left bg-brand-dark rounded-xl border border-white/10 p-4 hover:border-brand-red/30 transition-all"
                    >
                      <p className="text-white font-semibold">{c.name}</p>
                      <p className="text-brand-muted text-sm">
                        {[c.email, c.phone].filter(Boolean).join(" · ")}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowNewCustomer(true)}
                className="mt-4 text-brand-blue-light text-sm hover:text-white transition-colors"
              >
                + Create New Customer
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full name *"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
                className={inputClass}
                autoFocus
              />
              <input
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
                className={inputClass}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Address"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
                className={inputClass}
              />
              <div className="flex gap-3">
                <button
                  onClick={createCustomer}
                  disabled={!newCustomer.name || saving}
                  className="bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
                >
                  {saving ? "Creating..." : "Create Customer"}
                </button>
                <button
                  onClick={() => setShowNewCustomer(false)}
                  className="text-brand-muted text-sm hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Vehicle */}
      {step === "vehicle" && (
        <div>
          <div className="mb-4">
            <p className="text-brand-muted text-xs uppercase tracking-wide">
              Customer
            </p>
            <p className="text-white font-semibold">{selectedCustomer?.name}</p>
          </div>

          <h2 className="text-lg font-semibold text-white mb-4">
            2. Select or Add Vehicle
          </h2>

          {existingVehicles.length > 0 && !showNewVehicle && (
            <div className="space-y-2 mb-4">
              {existingVehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => selectVehicle(v)}
                  className="w-full text-left bg-brand-dark rounded-xl border border-white/10 p-4 hover:border-brand-red/30 transition-all"
                >
                  <p className="text-white font-semibold">
                    {v.year || ""} {v.make} {v.model}
                  </p>
                  {v.plate && (
                    <p className="text-brand-muted text-sm">Plate: {v.plate}</p>
                  )}
                </button>
              ))}
            </div>
          )}

          {!showNewVehicle ? (
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewVehicle(true)}
                className="text-brand-blue-light text-sm hover:text-white transition-colors"
              >
                + Add New Vehicle
              </button>
              <button
                onClick={() => setStep("services")}
                className="text-brand-muted text-sm hover:text-white transition-colors"
              >
                Skip (no vehicle)
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Year"
                  value={newVehicle.year}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, year: e.target.value })
                  }
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Make *"
                  value={newVehicle.make}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, make: e.target.value })
                  }
                  className={inputClass}
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Model *"
                  value={newVehicle.model}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, model: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <input
                type="text"
                placeholder="License plate"
                value={newVehicle.plate}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, plate: e.target.value })
                }
                className={inputClass}
              />
              <div className="flex gap-3">
                <button
                  onClick={createVehicle}
                  disabled={!newVehicle.make || !newVehicle.model || saving}
                  className="bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
                >
                  {saving ? "Adding..." : "Add Vehicle"}
                </button>
                <button
                  onClick={() => setShowNewVehicle(false)}
                  className="text-brand-muted text-sm hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setStep("customer")}
            className="mt-6 text-brand-muted text-xs hover:text-white transition-colors"
          >
            ← Back to customer
          </button>
        </div>
      )}

      {/* Step 3: Services */}
      {step === "services" && (
        <div>
          <div className="mb-4 flex gap-6">
            <div>
              <p className="text-brand-muted text-xs uppercase tracking-wide">
                Customer
              </p>
              <p className="text-white font-semibold text-sm">
                {selectedCustomer?.name}
              </p>
            </div>
            {selectedVehicle && (
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-wide">
                  Vehicle
                </p>
                <p className="text-white font-semibold text-sm">
                  {selectedVehicle.year || ""} {selectedVehicle.make}{" "}
                  {selectedVehicle.model}
                </p>
              </div>
            )}
          </div>

          <h2 className="text-lg font-semibold text-white mb-4">
            3. Select Services
          </h2>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {SERVICES.map((service) => (
              <button
                key={service}
                onClick={() => toggleService(service)}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  selectedServices.includes(service)
                    ? "bg-brand-red/20 border-brand-red/40 text-white"
                    : "bg-brand-dark border-white/10 text-brand-muted hover:text-white hover:border-white/20"
                }`}
              >
                {service}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={inputClass}
          />

          <div className="flex gap-3 mt-6">
            <button
              onClick={createJob}
              disabled={saving}
              className="bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 text-white text-sm font-bold px-8 py-3 rounded-xl transition-colors"
            >
              {saving ? "Creating..." : "Create Job"}
            </button>
            <button
              onClick={() => setStep("vehicle")}
              className="text-brand-muted text-sm hover:text-white transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
