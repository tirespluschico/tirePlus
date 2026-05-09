-- Tires+ Admin Portal Database Schema
-- Run this in your Supabase SQL editor to create all tables

CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  freshbooks_id text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  year smallint,
  make text NOT NULL,
  model text NOT NULL,
  plate text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'intake'
    CHECK (status IN ('intake','in_progress','ready','completed','picked_up')),
  services text[] DEFAULT '{}',
  notes text,
  notified_at timestamptz,
  completed_at timestamptz,
  review_sent_at timestamptz,
  freshbooks_invoice_id text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE inspection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL CHECK (status IN ('green','yellow','red')),
  note text,
  sort_order smallint DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('email','sms')),
  type text NOT NULL CHECK (type IN ('inspection','ready','review')),
  sent_at timestamptz DEFAULT now(),
  status text DEFAULT 'sent',
  error text
);

CREATE TABLE job_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  name text NOT NULL,
  quantity smallint DEFAULT 1,
  status text NOT NULL DEFAULT 'needed'
    CHECK (status IN ('needed','ordered','in_stock')),
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE job_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  user_name text,
  type text NOT NULL,
  detail text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE shop_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  role text DEFAULT 'tech' CHECK (role IN ('owner','tech')),
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_vehicles_customer ON vehicles(customer_id);
CREATE INDEX idx_jobs_customer ON jobs(customer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_inspection_items_job ON inspection_items(job_id);
CREATE INDEX idx_job_events_job ON job_events(job_id, created_at DESC);
CREATE INDEX idx_job_parts_job ON job_parts(job_id);

-- Seed the shop owner (update email as needed)
INSERT INTO shop_users (email, name, role)
VALUES ('contact@tirespluschico.com', 'Tires+ Owner', 'owner');

-- Enable Realtime so the dashboard receives change events
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;
