export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  freshbooks_id: string | null;
  created_at: string;
}

export interface Vehicle {
  id: string;
  customer_id: string;
  year: number | null;
  make: string;
  model: string;
  plate: string | null;
  created_at: string;
}

export type JobStatus =
  | "intake"
  | "in_progress"
  | "ready"
  | "completed"
  | "picked_up";

export interface Job {
  id: string;
  vehicle_id: string;
  customer_id: string;
  status: JobStatus;
  services: string[];
  notes: string | null;
  notified_at: string | null;
  completed_at: string | null;
  review_sent_at: string | null;
  freshbooks_invoice_id: string | null;
  created_at: string;
}

export interface JobWithDetails extends Job {
  customer: Customer;
  vehicle: Vehicle;
  inspection_items?: InspectionItem[];
}

export type InspectionStatus = "green" | "yellow" | "red";

export interface InspectionItem {
  id: string;
  job_id: string;
  name: string;
  status: InspectionStatus;
  note: string | null;
  sort_order: number;
  created_at: string;
}

export interface NotificationLog {
  id: string;
  job_id: string;
  channel: "email" | "sms";
  type: "inspection" | "ready" | "review";
  sent_at: string;
  status: "sent" | "failed";
  error: string | null;
}

export interface ShopUser {
  id: string;
  email: string;
  name: string | null;
  role: "owner" | "tech";
  created_at: string;
}
