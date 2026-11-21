-- Existing inquiries intentionally retain empty metadata; historical traffic is not inferred.
alter table public.contacts
  add column if not exists attribution jsonb not null default '{}'::jsonb,
  add column if not exists visitor_context jsonb not null default '{}'::jsonb;

comment on column public.contacts.attribution is
  'Sanitized first visit, latest campaign/external referral, and submission page. Advisory metadata, never authorization data.';
comment on column public.contacts.visitor_context is
  'Cloudflare approximate IP geolocation and network data, plus browser-reported timezone, device and display context. Admin-only inquiry metadata.';
