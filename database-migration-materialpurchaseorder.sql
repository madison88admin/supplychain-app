-- Migration: Material Purchase Order (MPO) table and JSON schema alignment
-- Safe to run multiple times (idempotent where possible)

-- Extensions (for gen_random_uuid)
create extension if not exists pgcrypto;

-- 1) Create table if not exists
create table if not exists public.materialpurchaseorder (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid null,
  product_id uuid null,
  quantity numeric default 0,
  unit_price numeric default 0,
  received_quantity numeric default 0,
  notes text null,
  additional_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Add missing columns if table already existed
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'materialpurchaseorder' and column_name = 'additional_data'
  ) then
    alter table public.materialpurchaseorder add column additional_data jsonb not null default '{}'::jsonb;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'materialpurchaseorder' and column_name = 'created_at'
  ) then
    alter table public.materialpurchaseorder add column created_at timestamptz not null default now();
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'materialpurchaseorder' and column_name = 'updated_at'
  ) then
    alter table public.materialpurchaseorder add column updated_at timestamptz not null default now();
  end if;
end $$;

-- 3) Update trigger for updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_mpo_set_updated_at on public.materialpurchaseorder;
create trigger trg_mpo_set_updated_at
before update on public.materialpurchaseorder
for each row execute function public.set_updated_at();

-- 4) Indices
create index if not exists idx_mpo_created_at on public.materialpurchaseorder (created_at desc);
create index if not exists idx_mpo_updated_at on public.materialpurchaseorder (updated_at desc);
create index if not exists idx_mpo_additional_data_gin on public.materialpurchaseorder using gin (additional_data);

-- 5) JSON key migrations to align with new MPO schema
-- 5a) Rename 'Order References' -> 'Order Reference'
update public.materialpurchaseorder
set additional_data = (
  (additional_data - 'Order References') ||
  case when (additional_data ? 'Order Reference') then '{}'::jsonb
       else jsonb_build_object('Order Reference', additional_data->>'Order References') end
)
where additional_data ? 'Order References';

-- 5b) Normalize 'Deliver to' -> 'Deliver To'
update public.materialpurchaseorder
set additional_data = (
  (additional_data - 'Deliver to') ||
  case when (additional_data ? 'Deliver To') then '{}'::jsonb
       else jsonb_build_object('Deliver To', additional_data->>'Deliver to') end
)
where additional_data ? 'Deliver to';

-- 5c) Migrate grouped milestone 'Ex-Factory Date' -> 'Ex-Factory' (preserve object)
update public.materialpurchaseorder
set additional_data = (
  (additional_data - 'Ex-Factory Date') ||
  jsonb_build_object('Ex-Factory', coalesce(additional_data->'Ex-Factory Date', '{}'::jsonb))
)
where additional_data ? 'Ex-Factory Date' and not (additional_data ? 'Ex-Factory');

-- 6) Optional: Seed grouped milestone keys if you want them always present (kept commented; UI handles missing)
-- update public.materialpurchaseorder set additional_data = additional_data || jsonb_build_object(
--   'Trim Order', jsonb_build_object('Target Date','', 'Completed Date',''),
--   'Ex-Factory', coalesce(additional_data->'Ex-Factory','{}'::jsonb) || jsonb_build_object('Target Date', coalesce(additional_data->'Ex-Factory'->>'Target Date',''), 'Completed Date', coalesce(additional_data->'Ex-Factory'->>'Completed Date','')),
--   'Trims Received', jsonb_build_object('Target Date','', 'Completed Date',''),
--   'MPO Issue Date', jsonb_build_object('Target Date','', 'Completed Date',''),
--   'Main Material Order', jsonb_build_object('Target Date','', 'Completed Date',''),
--   'Main Material received', jsonb_build_object('Target Date','', 'Completed Date','')
-- );

-- 7) Row Level Security (RLS)
-- Uncomment one of the following blocks depending on your security model.

-- A) Disable RLS (easiest for dev; not recommended for production)
-- alter table public.materialpurchaseorder disable row level security;

-- B) Enable RLS with permissive policies for authenticated users
-- alter table public.materialpurchaseorder enable row level security;
-- do $$ begin
--   if not exists (select 1 from pg_policies where polname = 'mpo_select') then
--     create policy mpo_select on public.materialpurchaseorder for select
--       to authenticated using (true);
--   end if;
--   if not exists (select 1 from pg_policies where polname = 'mpo_insert') then
--     create policy mpo_insert on public.materialpurchaseorder for insert
--       to authenticated with check (true);
--   end if;
--   if not exists (select 1 from pg_policies where polname = 'mpo_update') then
--     create policy mpo_update on public.materialpurchaseorder for update
--       to authenticated using (true) with check (true);
--   end if;
-- end $$;

-- Done


