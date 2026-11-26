-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- to create the database tables for your GST Tax Invoice Designer.

create table if not exists items (
  id text primary key,
  name text not null,
  hsn text not null default '',
  uom text not null default '',
  rate numeric not null default 0,
  cgst numeric not null default 9,
  sgst numeric not null default 9,
  igst numeric not null default 18,
  created_at timestamptz not null default now()
);

create table if not exists parties (
  id text primary key,
  name text not null,
  address text not null default '',
  gstin text not null default '',
  state text not null default 'AP',
  state_code text not null default '37',
  created_at timestamptz not null default now()
);

create table if not exists business_settings (
  id text primary key,
  name text not null,
  phone text not null default '',
  address text not null default '',
  gstin text not null default '',
  state text not null default 'Andhra Pradesh',
  state_code text not null default '37',
  bank_name text not null default '',
  bank_branch text not null default '',
  bank_acc text not null default '',
  bank_ifsc text not null default '',
  email text not null default '',
  terms jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists invoices (
  id text primary key,
  invoice_no text not null default '',
  invoice_date text not null default '',
  bill_name text not null default '',
  total_amount numeric not null default 0,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS) with open policies for single-shop usage.
-- For multi-user or public deployments, restrict these policies with Supabase Auth.
alter table items enable row level security;
alter table parties enable row level security;
alter table business_settings enable row level security;
alter table invoices enable row level security;

create policy "Allow all items" on items for all using (true) with check (true);
create policy "Allow all parties" on parties for all using (true) with check (true);
create policy "Allow all business_settings" on business_settings for all using (true) with check (true);
create policy "Allow all invoices" on invoices for all using (true) with check (true);
