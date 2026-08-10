-- Converts approved payments into customer gold holdings.
alter table public.payment_requests add column if not exists plan_name text;
alter table public.payment_requests add column if not exists gold_price_per_bhori numeric(14,2);

update public.payment_requests set plan_name = 'Digital Gold' where plan_name is null;
update public.payment_requests set gold_price_per_bhori = 234038 where gold_price_per_bhori is null;

alter table public.payment_requests alter column plan_name set default 'Digital Gold';
alter table public.payment_requests alter column plan_name set not null;
alter table public.payment_requests alter column gold_price_per_bhori set default 234038;
alter table public.payment_requests alter column gold_price_per_bhori set not null;

create or replace function public.approve_payment(p_payment_id uuid, p_note text default null)
returns public.investments
language plpgsql security definer set search_path = public
as $$
declare p public.payment_requests; result public.investments;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  select * into p from public.payment_requests where id=p_payment_id for update;
  if not found then raise exception 'Payment not found'; end if;
  update public.payment_requests set status='approved',admin_note=p_note,reviewed_by=auth.uid(),reviewed_at=now() where id=p.id;
  insert into public.investments(user_id,payment_request_id,plan_name,principal,gold_grams,gold_price_per_bhori,purchased_at,withdrawal_available_at)
  values(p.user_id,p.id,p.plan_name,p.amount,(p.amount/p.gold_price_per_bhori)*11.664,p.gold_price_per_bhori,now(),now()+interval '7 days')
  on conflict(payment_request_id) do update set plan_name=excluded.plan_name
  returning * into result;
  insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,metadata)
  values(auth.uid(),'approved','payment',p.id::text,jsonb_build_object('amount',p.amount,'gold_grams',result.gold_grams));
  return result;
end $$;

grant execute on function public.approve_payment(uuid,text) to authenticated;

-- Backfill payments approved before this function existed.
insert into public.investments(user_id,payment_request_id,plan_name,principal,gold_grams,gold_price_per_bhori,purchased_at,withdrawal_available_at)
select p.user_id,p.id,p.plan_name,p.amount,(p.amount/p.gold_price_per_bhori)*11.664,p.gold_price_per_bhori,coalesce(p.reviewed_at,p.created_at),coalesce(p.reviewed_at,p.created_at)+interval '7 days'
from public.payment_requests p
where p.status='approved' and not exists(select 1 from public.investments i where i.payment_request_id=p.id);
