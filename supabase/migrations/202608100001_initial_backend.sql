-- Gold Investor: production data model and access rules.
-- Run this file once from Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

-- Safe reset for a new project if a previous first run stopped halfway.
drop trigger if exists on_auth_user_created on auth.users;
drop table if exists public.admin_audit_logs cascade;
drop table if exists public.withdrawal_requests cascade;
drop table if exists public.investments cascade;
drop table if exists public.payment_requests cascade;
drop table if exists public.profiles cascade;
drop type if exists public.withdrawal_status cascade;
drop type if exists public.review_status cascade;
drop type if exists public.user_role cascade;

create type public.user_role as enum ('customer', 'admin');
create type public.review_status as enum ('pending', 'approved', 'rejected');
create type public.withdrawal_status as enum ('pending', 'approved', 'rejected', 'paid');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text unique,
  role public.user_role not null default 'customer',
  kyc_status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  method text not null,
  transaction_id text not null,
  amount numeric(14,2) not null check (amount >= 5000),
  proof_path text not null,
  status public.review_status not null default 'pending',
  admin_note text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(method, transaction_id)
);

create table public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  payment_request_id uuid unique references public.payment_requests(id),
  plan_name text not null,
  principal numeric(14,2) not null check (principal >= 5000),
  gold_grams numeric(14,6) not null check (gold_grams > 0),
  gold_price_per_bhori numeric(14,2) not null check (gold_price_per_bhori > 0),
  purchased_at timestamptz not null default now(),
  withdrawal_available_at timestamptz not null default (now() + interval '7 days'),
  active boolean not null default true
);

create table public.withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  investment_id uuid not null references public.investments(id),
  amount numeric(14,2) not null check (amount > 0),
  status public.withdrawal_status not null default 'pending',
  admin_note text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.admin_audit_logs (
  id bigint generated always as identity primary key,
  admin_id uuid not null references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  insert into public.profiles(id, full_name, phone)
  values(new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.phone);
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.payment_requests enable row level security;
alter table public.investments enable row level security;
alter table public.withdrawal_requests enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "profiles own read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles own update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = 'customer');
create policy "payments own create" on public.payment_requests for insert with check (user_id = auth.uid());
create policy "payments own read" on public.payment_requests for select using (user_id = auth.uid() or public.is_admin());
create policy "payments admin update" on public.payment_requests for update using (public.is_admin()) with check (public.is_admin());
create policy "investments own read" on public.investments for select using (user_id = auth.uid() or public.is_admin());
create policy "investments admin write" on public.investments for all using (public.is_admin()) with check (public.is_admin());
create policy "withdrawals own read" on public.withdrawal_requests for select using (user_id = auth.uid() or public.is_admin());
create policy "withdrawals eligible create" on public.withdrawal_requests for insert with check (
  user_id = auth.uid() and exists (
    select 1 from public.investments i
    where i.id = investment_id and i.user_id = auth.uid() and i.active
      and now() >= i.withdrawal_available_at and amount <= i.principal
  )
);
create policy "withdrawals admin update" on public.withdrawal_requests for update using (public.is_admin()) with check (public.is_admin());
create policy "audit admin only" on public.admin_audit_logs for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('payment-proofs', 'payment-proofs', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "proof owner upload" on storage.objects for insert to authenticated
with check (bucket_id = 'payment-proofs' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "proof owner read" on storage.objects for select to authenticated
using (bucket_id = 'payment-proofs' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
create policy "proof admin update" on storage.objects for update to authenticated
using (bucket_id = 'payment-proofs' and public.is_admin());

-- After your own account is created, promote it from the SQL editor once:
-- update public.profiles set role = 'admin' where phone = 'YOUR_OWN_PHONE';
