// In-memory mock Supabase client for local dev preview (no external services needed)
// This file is only used when SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are missing.

import { randomUUID } from "crypto";

// --------------- In-memory store ---------------

const store: Record<string, Record<string, unknown>[]> = {
  customers: [
    { id: "c1", name: "Maria Garcia", email: "maria@email.com", phone: "530-555-0101", address: "123 Main St, Chico, CA", freshbooks_id: null, created_at: "2026-03-15T10:00:00Z" },
    { id: "c2", name: "James Wilson", email: "jwilson@email.com", phone: "530-555-0202", address: "456 Oak Ave, Chico, CA", freshbooks_id: null, created_at: "2026-03-20T14:30:00Z" },
    { id: "c3", name: "Sarah Chen", email: "sarah.chen@email.com", phone: "530-555-0303", address: "789 Elm Dr, Chico, CA", freshbooks_id: null, created_at: "2026-03-28T09:15:00Z" },
  ],
  vehicles: [
    { id: "v1", customer_id: "c1", year: 2019, make: "Toyota", model: "Camry", plate: "7ABC123", created_at: "2026-03-15T10:00:00Z" },
    { id: "v2", customer_id: "c2", year: 2021, make: "Ford", model: "F-150", plate: "8XYZ789", created_at: "2026-03-20T14:30:00Z" },
    { id: "v3", customer_id: "c3", year: 2017, make: "Honda", model: "Civic", plate: "6DEF456", created_at: "2026-03-28T09:15:00Z" },
    { id: "v4", customer_id: "c1", year: 2022, make: "Honda", model: "CR-V", plate: "9GHI012", created_at: "2026-03-18T11:00:00Z" },
  ],
  jobs: [
    { id: "j1", vehicle_id: "v1", customer_id: "c1", status: "in_progress", services: ["Tire Rotation", "Brake Service"], notes: "Customer mentioned squeaking", notified_at: "2026-04-01T11:00:00Z", completed_at: null, review_sent_at: null, freshbooks_invoice_id: null, created_at: "2026-04-01T09:00:00Z" },
    { id: "j2", vehicle_id: "v2", customer_id: "c2", status: "intake", services: ["Oil Change", "Multi-Point Inspection"], notes: null, notified_at: null, completed_at: null, review_sent_at: null, freshbooks_invoice_id: null, created_at: "2026-04-02T08:30:00Z" },
    { id: "j3", vehicle_id: "v3", customer_id: "c3", status: "ready", services: ["Tire Installation", "Wheel Alignment"], notes: "4 new tires — Michelin Defender", notified_at: "2026-04-02T14:00:00Z", completed_at: "2026-04-02T16:00:00Z", review_sent_at: null, freshbooks_invoice_id: null, created_at: "2026-03-30T10:00:00Z" },
  ],
  inspection_items: [
    { id: "ii1", job_id: "j1", name: "Front brake pads", status: "red", note: "3mm remaining — needs replacement", sort_order: 0, created_at: "2026-04-01T10:00:00Z" },
    { id: "ii2", job_id: "j1", name: "Rear brake pads", status: "yellow", note: "5mm — ok for now, monitor", sort_order: 1, created_at: "2026-04-01T10:00:00Z" },
    { id: "ii3", job_id: "j1", name: "Tire tread - LF", status: "green", note: null, sort_order: 2, created_at: "2026-04-01T10:00:00Z" },
    { id: "ii4", job_id: "j1", name: "Tire tread - RF", status: "green", note: null, sort_order: 3, created_at: "2026-04-01T10:00:00Z" },
    { id: "ii5", job_id: "j1", name: "Oil level", status: "yellow", note: "Slightly low", sort_order: 4, created_at: "2026-04-01T10:00:00Z" },
    { id: "ii6", job_id: "j1", name: "Battery health", status: "green", note: null, sort_order: 5, created_at: "2026-04-01T10:00:00Z" },
    { id: "ii7", job_id: "j3", name: "Tire tread - LF", status: "green", note: "New tire", sort_order: 0, created_at: "2026-04-02T13:00:00Z" },
    { id: "ii8", job_id: "j3", name: "Tire tread - RF", status: "green", note: "New tire", sort_order: 1, created_at: "2026-04-02T13:00:00Z" },
    { id: "ii9", job_id: "j3", name: "Tire tread - LR", status: "green", note: "New tire", sort_order: 2, created_at: "2026-04-02T13:00:00Z" },
    { id: "ii10", job_id: "j3", name: "Tire tread - RR", status: "green", note: "New tire", sort_order: 3, created_at: "2026-04-02T13:00:00Z" },
    { id: "ii11", job_id: "j3", name: "Alignment", status: "green", note: "Aligned to spec", sort_order: 4, created_at: "2026-04-02T13:00:00Z" },
  ],
  notification_log: [],
  shop_users: [
    { id: "su1", email: "tirespluschico@gmail.com", name: "Tires+ Owner", role: "owner", created_at: "2026-01-01T00:00:00Z" },
  ],
};

// --------------- Foreign key map for joins ---------------

const FK_MAP: Record<string, Record<string, { table: string; fk: string }>> = {
  jobs: {
    customer: { table: "customers", fk: "customer_id" },
    customers: { table: "customers", fk: "customer_id" },
    vehicle: { table: "vehicles", fk: "vehicle_id" },
    vehicles: { table: "vehicles", fk: "vehicle_id" },
  },
  vehicles: {
    customer: { table: "customers", fk: "customer_id" },
    customers: { table: "customers", fk: "customer_id" },
  },
};

// Reverse FKs — child tables that reference the parent row by job_id, customer_id, etc.
const REVERSE_FK_MAP: Record<string, Record<string, { table: string; fk: string }>> = {
  jobs: {
    inspection_items: { table: "inspection_items", fk: "job_id" },
  },
};

// --------------- Query builder ---------------

type Op = "select" | "insert" | "update" | "delete";

interface QueryState {
  table: string;
  op: Op;
  selectStr: string;
  selectOpts: { count?: string; head?: boolean };
  insertData: Record<string, unknown> | Record<string, unknown>[];
  updateData: Record<string, unknown>;
  filters: { type: string; col: string; val: unknown }[];
  orderCol: string | null;
  orderAsc: boolean;
  isSingle: boolean;
}

function resolveJoins(table: string, selectStr: string, row: Record<string, unknown>): Record<string, unknown> {
  const result = { ...row };

  // Parse "alias:table(cols)" or "table(cols)" patterns
  const joinRegex = /(\w+):(\w+)\(([^)]*)\)|(\w+)\(([^)]*)\)/g;
  let match;

  while ((match = joinRegex.exec(selectStr)) !== null) {
    const alias = match[1] || match[4];
    const joinTable = match[2] || match[4];
    const colStr = match[3] || match[5];

    // Check forward FK (e.g., jobs.customer_id → customers.id)
    const fkInfo = FK_MAP[table]?.[alias] || FK_MAP[table]?.[joinTable];
    if (fkInfo) {
      const fkVal = row[fkInfo.fk];
      if (fkVal) {
        const related = store[fkInfo.table]?.find((r) => r.id === fkVal);
        if (related) {
          result[alias] = colStr === "*" ? { ...related } : pickCols(related, colStr);
        } else {
          result[alias] = null;
        }
      } else {
        result[alias] = null;
      }
      continue;
    }

    // Check reverse FK (e.g., jobs → inspection_items where job_id = jobs.id)
    const revInfo = REVERSE_FK_MAP[table]?.[alias] || REVERSE_FK_MAP[table]?.[joinTable];
    if (revInfo) {
      const children = store[revInfo.table]?.filter((r) => r[revInfo.fk] === row.id) || [];
      result[alias] = colStr === "*"
        ? children.map((c) => ({ ...c }))
        : children.map((c) => pickCols(c, colStr));
      continue;
    }
  }

  return result;
}

function pickCols(row: Record<string, unknown>, colStr: string): Record<string, unknown> {
  if (colStr === "*") return { ...row };
  const cols = colStr.split(",").map((c) => c.trim());
  const result: Record<string, unknown> = {};
  for (const col of cols) {
    if (col in row) result[col] = row[col];
  }
  return result;
}

function applyFilter(rows: Record<string, unknown>[], filter: { type: string; col: string; val: unknown }): Record<string, unknown>[] {
  switch (filter.type) {
    case "eq":
      return rows.filter((r) => r[filter.col] === filter.val);
    case "neq":
      return rows.filter((r) => r[filter.col] !== filter.val);
    case "in":
      return rows.filter((r) => (filter.val as unknown[]).includes(r[filter.col]));
    case "or": {
      // Parse "col.op.val,col.op.val" format
      const conditions = (filter.val as string).split(",");
      return rows.filter((r) =>
        conditions.some((cond) => {
          const parts = cond.trim().split(".");
          const col = parts[0];
          const op = parts[1];
          const val = parts.slice(2).join(".");
          if (op === "ilike") {
            const pattern = val.replace(/%/g, "").toLowerCase();
            const fieldVal = r[col];
            return typeof fieldVal === "string" && fieldVal.toLowerCase().includes(pattern);
          }
          return false;
        })
      );
    }
    default:
      return rows;
  }
}

function createQueryBuilder(state: QueryState) {
  const builder: Record<string, unknown> = {};

  const resolve = () => {
    let rows = [...(store[state.table] || [])];

    if (state.op === "insert") {
      const dataArr = Array.isArray(state.insertData) ? state.insertData : [state.insertData];
      const inserted: Record<string, unknown>[] = [];
      for (const item of dataArr) {
        const row = { id: randomUUID(), created_at: new Date().toISOString(), ...item };
        store[state.table] = store[state.table] || [];
        store[state.table].push(row);
        inserted.push(row);
      }
      rows = inserted;
    }

    if (state.op === "update") {
      for (const filter of state.filters) {
        rows = applyFilter(rows, filter);
      }
      for (const row of rows) {
        Object.assign(row, state.updateData);
      }
    }

    if (state.op === "delete") {
      for (const filter of state.filters) {
        rows = applyFilter(rows, filter);
      }
      const ids = new Set(rows.map((r) => r.id));
      store[state.table] = (store[state.table] || []).filter((r) => !ids.has(r.id));
      return { data: null, error: null };
    }

    if (state.op === "select" || state.selectStr) {
      // Apply filters
      for (const filter of state.filters) {
        rows = applyFilter(rows, filter);
      }

      // Apply joins
      if (state.selectStr) {
        rows = rows.map((r) => resolveJoins(state.table, state.selectStr, r));
      }

      // Apply ordering
      if (state.orderCol) {
        const col = state.orderCol;
        const asc = state.orderAsc;
        rows.sort((a, b) => {
          const av = a[col] as string || "";
          const bv = b[col] as string || "";
          return asc ? av.localeCompare(bv) : bv.localeCompare(av);
        });
      }

      // Count mode
      if (state.selectOpts.head && state.selectOpts.count === "exact") {
        return { data: null, error: null, count: rows.length };
      }
    }

    if (state.isSingle) {
      return { data: rows[0] || null, error: rows[0] ? null : { message: "Not found" } };
    }

    return { data: rows, error: null, count: rows.length };
  };

  // Make it thenable
  builder.then = (resolve2: (v: unknown) => void, reject?: (v: unknown) => void) => {
    try {
      resolve2(resolve());
    } catch (e) {
      if (reject) reject(e);
    }
  };

  // Chain methods
  builder.select = (cols?: string, opts?: { count?: string; head?: boolean }) => {
    state.selectStr = cols || "*";
    if (opts) state.selectOpts = opts;
    return builder;
  };
  builder.insert = (data: Record<string, unknown> | Record<string, unknown>[]) => {
    state.op = "insert";
    state.insertData = data;
    return builder;
  };
  builder.update = (data: Record<string, unknown>) => {
    state.op = "update";
    state.updateData = data;
    return builder;
  };
  builder.delete = () => {
    state.op = "delete";
    return builder;
  };
  builder.eq = (col: string, val: unknown) => {
    state.filters.push({ type: "eq", col, val });
    return builder;
  };
  builder.neq = (col: string, val: unknown) => {
    state.filters.push({ type: "neq", col, val });
    return builder;
  };
  builder.in = (col: string, vals: unknown[]) => {
    state.filters.push({ type: "in", col, val: vals });
    return builder;
  };
  builder.or = (expr: string) => {
    state.filters.push({ type: "or", col: "", val: expr });
    return builder;
  };
  builder.order = (col: string, opts?: { ascending?: boolean }) => {
    state.orderCol = col;
    state.orderAsc = opts?.ascending ?? true;
    return builder;
  };
  builder.single = () => {
    state.isSingle = true;
    return builder;
  };
  builder.maybeSingle = () => {
    state.isSingle = true;
    return builder;
  };
  builder.ilike = () => builder;
  builder.filter = () => builder;
  builder.limit = () => builder;
  builder.range = () => builder;
  builder.upsert = (data: Record<string, unknown>) => {
    state.op = "insert";
    state.insertData = data;
    return builder;
  };

  return builder;
}

export function createMockClient() {
  return {
    from: (table: string) => {
      const state: QueryState = {
        table,
        op: "select",
        selectStr: "*",
        selectOpts: {},
        insertData: {},
        updateData: {},
        filters: [],
        orderCol: null,
        orderAsc: true,
        isSingle: false,
      };
      return createQueryBuilder(state);
    },
  };
}
