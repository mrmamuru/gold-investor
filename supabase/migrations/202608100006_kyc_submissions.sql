-- Private KYC applications and identity document storage.
create table if not exists public.kyc_submissions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.profiles(id) on delete cascade,
  nid_number text not null check(nid_number ~ '^[0-9]{10,17}$'), date_of_birth date not null,
  present_address text not null, permanent_address text not null, occupation text not null,
  source_of_funds text not null, nominee_name text not null, nominee_relation text not null, nominee_phone text not null,
  nid_front_path text not null, nid_back_path text not null, selfie_path text not null,
  consent_at timestamptz not null, status public.review_status not null default 'pending',
  admin_note text, reviewed_by uuid references public.profiles(id), reviewed_at timestamptz,
  submitted_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.kyc_submissions enable row level security;
create policy "kyc own read" on public.kyc_submissions for select using(user_id=auth.uid() or public.is_admin());
create policy "kyc own submit" on public.kyc_submissions for insert with check(user_id=auth.uid() and status='pending');
create policy "kyc own resubmit" on public.kyc_submissions for update using(user_id=auth.uid() and status<>'approved') with check(user_id=auth.uid() and status='pending');
create policy "kyc admin update" on public.kyc_submissions for update using(public.is_admin()) with check(public.is_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('kyc-documents','kyc-documents',false,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy "kyc document owner upload" on storage.objects for insert to authenticated
with check(bucket_id='kyc-documents' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "kyc document owner read" on storage.objects for select to authenticated
using(bucket_id='kyc-documents' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()));

create or replace function public.review_kyc(p_submission_id uuid,p_status public.review_status,p_note text default null)
returns void language plpgsql security definer set search_path=public as $$ declare v_user uuid; begin
 if not public.is_admin() then raise exception 'Admin access required'; end if;
 if p_status='pending' then raise exception 'Review must approve or reject'; end if;
 update public.kyc_submissions set status=p_status,admin_note=p_note,reviewed_by=auth.uid(),reviewed_at=now(),updated_at=now() where id=p_submission_id returning user_id into v_user;
 if v_user is null then raise exception 'KYC application not found'; end if;
 update public.profiles set kyc_status=p_status,updated_at=now() where id=v_user;
 insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,metadata) values(auth.uid(),'kyc_'||p_status::text,'kyc_submission',p_submission_id::text,jsonb_build_object('user_id',v_user,'note',p_note));
end $$;
grant execute on function public.review_kyc(uuid,public.review_status,text) to authenticated;
