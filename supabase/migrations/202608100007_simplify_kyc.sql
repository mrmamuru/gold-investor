-- Simplified KYC requested by the operator: identity images and NID are not collected.
alter table public.kyc_submissions drop constraint if exists kyc_submissions_nid_number_check;
alter table public.kyc_submissions alter column nid_number drop not null;
alter table public.kyc_submissions alter column permanent_address drop not null;
alter table public.kyc_submissions alter column source_of_funds drop not null;
alter table public.kyc_submissions alter column nominee_phone drop not null;
alter table public.kyc_submissions alter column nid_front_path drop not null;
alter table public.kyc_submissions alter column nid_back_path drop not null;
alter table public.kyc_submissions alter column selfie_path drop not null;
comment on table public.kyc_submissions is 'Basic customer verification; NID and biometric images are not collected.';
