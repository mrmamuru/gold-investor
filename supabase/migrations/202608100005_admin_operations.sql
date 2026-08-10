-- Admin operations: KYC, compliance, market-based profit declarations and ledger.
create table if not exists public.compliance_holds (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check(length(trim(reason)) >= 5), active boolean not null default true,
  created_by uuid not null references public.profiles(id), released_by uuid references public.profiles(id),
  released_at timestamptz, created_at timestamptz not null default now()
);
create unique index if not exists one_active_hold_per_user on public.compliance_holds(user_id) where active;

create table if not exists public.profit_declarations (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  investment_id uuid references public.investments(id) on delete set null,
  amount numeric(14,2) not null check(amount <> 0), basis text not null check(length(trim(basis)) >= 5),
  period_start date, period_end date, declared_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.transaction_ledger (
  id bigint generated always as identity primary key, user_id uuid not null references public.profiles(id) on delete cascade,
  entry_type text not null, reference_type text not null, reference_id text not null,
  amount numeric(14,2) not null default 0, gold_grams numeric(14,6) not null default 0,
  description text not null, created_by uuid references public.profiles(id), created_at timestamptz not null default now()
);
create unique index if not exists ledger_reference_unique on public.transaction_ledger(entry_type,reference_type,reference_id);

alter table public.compliance_holds enable row level security;
alter table public.profit_declarations enable row level security;
alter table public.transaction_ledger enable row level security;
create policy "holds admin manage" on public.compliance_holds for all using(public.is_admin()) with check(public.is_admin());
create policy "holds own read" on public.compliance_holds for select using(user_id=auth.uid());
create policy "profits admin manage" on public.profit_declarations for all using(public.is_admin()) with check(public.is_admin());
create policy "profits own read" on public.profit_declarations for select using(user_id=auth.uid());
create policy "ledger admin read" on public.transaction_ledger for select using(public.is_admin());
create policy "ledger own read" on public.transaction_ledger for select using(user_id=auth.uid());
create policy "ledger admin insert" on public.transaction_ledger for insert with check(public.is_admin());
create policy "profiles admin update" on public.profiles for update using(public.is_admin()) with check(public.is_admin());

create or replace function public.set_kyc_status(p_user_id uuid,p_status public.review_status,p_note text default null)
returns void language plpgsql security definer set search_path=public as $$ begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  update public.profiles set kyc_status=p_status,updated_at=now() where id=p_user_id;
  insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,metadata) values(auth.uid(),'kyc_'||p_status::text,'profile',p_user_id::text,jsonb_build_object('note',p_note));
end $$;

create or replace function public.set_compliance_hold(p_user_id uuid,p_active boolean,p_reason text)
returns void language plpgsql security definer set search_path=public as $$ begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if length(trim(coalesce(p_reason,'')))<5 then raise exception 'A clear reason is required'; end if;
  if p_active then insert into public.compliance_holds(user_id,reason,created_by) values(p_user_id,p_reason,auth.uid()) on conflict(user_id) where active do update set reason=excluded.reason;
  else update public.compliance_holds set active=false,released_by=auth.uid(),released_at=now() where user_id=p_user_id and active; end if;
  insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,metadata) values(auth.uid(),case when p_active then 'compliance_hold' else 'compliance_release' end,'profile',p_user_id::text,jsonb_build_object('reason',p_reason));
end $$;

create or replace function public.declare_profit(p_user_id uuid,p_investment_id uuid,p_amount numeric,p_basis text,p_period_start date default null,p_period_end date default null)
returns uuid language plpgsql security definer set search_path=public as $$ declare v_id uuid; begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if p_amount=0 or length(trim(coalesce(p_basis,'')))<5 then raise exception 'Amount and calculation basis are required'; end if;
  if p_investment_id is not null and not exists(select 1 from public.investments where id=p_investment_id and user_id=p_user_id) then raise exception 'Investment does not belong to customer'; end if;
  insert into public.profit_declarations(user_id,investment_id,amount,basis,period_start,period_end,declared_by) values(p_user_id,p_investment_id,p_amount,p_basis,p_period_start,p_period_end,auth.uid()) returning id into v_id;
  insert into public.transaction_ledger(user_id,entry_type,reference_type,reference_id,amount,description,created_by) values(p_user_id,'profit','profit_declaration',v_id::text,p_amount,p_basis,auth.uid());
  insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,metadata) values(auth.uid(),'profit_declared','profit_declaration',v_id::text,jsonb_build_object('user_id',p_user_id,'amount',p_amount,'basis',p_basis)); return v_id;
end $$;

insert into public.transaction_ledger(user_id,entry_type,reference_type,reference_id,amount,gold_grams,description,created_at)
select user_id,'gold_purchase','investment',id::text,-principal,gold_grams,plan_name,purchased_at from public.investments
on conflict(entry_type,reference_type,reference_id) do nothing;
grant execute on function public.set_kyc_status(uuid,public.review_status,text) to authenticated;
grant execute on function public.set_compliance_hold(uuid,boolean,text) to authenticated;
grant execute on function public.declare_profit(uuid,uuid,numeric,text,date,date) to authenticated;
