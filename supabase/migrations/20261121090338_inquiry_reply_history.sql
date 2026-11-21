create table public.contact_replies (
  id uuid primary key,
  contact_id uuid not null references public.contacts(id) on delete cascade,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  sender_admin text not null,
  from_email text not null check (from_email = 'support@hoflings.com'),
  to_email text not null,
  subject text not null check (char_length(subject) between 1 and 200),
  body text not null check (char_length(body) between 1 and 12000),
  status text not null default 'sending' check (status in ('sending', 'sent', 'failed', 'unknown')),
  provider_message_id text,
  error text
);
create index contact_replies_contact_created_idx on public.contact_replies(contact_id, created_at);
alter table public.contact_replies enable row level security;
revoke all on public.contact_replies from public, anon, authenticated;
grant select, insert, update, delete on public.contact_replies to service_role;
comment on table public.contact_replies is
  'Admin API-only outbound inquiry replies. IDs are idempotency keys; sent means accepted by SendGrid, not confirmed delivery.';
notify pgrst, 'reload schema';
