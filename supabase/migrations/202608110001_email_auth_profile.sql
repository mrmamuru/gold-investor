-- Keep customer profile details when authentication uses email + password.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, full_name, phone)
  values(
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    nullif(coalesce(new.phone, new.raw_user_meta_data->>'phone'), '')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    phone = coalesce(excluded.phone, public.profiles.phone),
    updated_at = now();
  return new;
end
$$;

