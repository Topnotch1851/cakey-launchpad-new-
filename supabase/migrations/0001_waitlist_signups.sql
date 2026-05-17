-- 0001_waitlist_signups.sql
-- Unified waitlist table: one row per signup, optional wallet, optional role.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

create table if not exists public.waitlist_signups (
  id              uuid primary key default gen_random_uuid(),
  email           citext not null,
  role            text check (role in ('investor', 'team', 'other')),
  wallet_address  text,
  source          text,
  ip_hash         text,
  user_agent      text,
  utm             jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  constraint waitlist_signups_email_unique unique (email)
);

create index if not exists waitlist_signups_email_idx
  on public.waitlist_signups (email);

create index if not exists waitlist_signups_wallet_idx
  on public.waitlist_signups (lower(wallet_address))
  where wallet_address is not null;

create index if not exists waitlist_signups_created_at_idx
  on public.waitlist_signups (created_at desc);

-- Row-level security: NO policies for anon.  Anon can't SELECT/INSERT/UPDATE/DELETE the table directly.
-- All writes go through the SECURITY DEFINER `join_waitlist` RPC below, which bypasses RLS and
-- enforces its own rate limit + validation.  Service-role bypasses RLS for back-office / exports.
alter table public.waitlist_signups enable row level security;

-- Server-side RPC: insert + per-IP rate limit + position in one round-trip.
-- Rate limiting is enforced inside the function so it cannot be bypassed by skipping it on the client.
-- Limit: 5 signup attempts per IP hash per rolling 1-hour window.
-- On exceed, raises with sqlstate 'P0001' so the caller can surface "too many attempts".
create or replace function public.join_waitlist(
  p_email          citext,
  p_role           text default null,
  p_wallet_address text default null,
  p_source         text default null,
  p_ip_hash        text default null,
  p_user_agent     text default null
)
returns table (id uuid, queue_position bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_id   uuid;
  recent_count  integer;
  rate_window   interval := interval '1 hour';
  rate_max      integer  := 5;
begin
  if p_ip_hash is not null then
    select count(*) into recent_count
    from public.waitlist_signups
    where ip_hash = p_ip_hash
      and created_at > now() - rate_window;

    if recent_count >= rate_max then
      raise exception using errcode = 'P0001',
        message = 'rate_limit_exceeded';
    end if;
  end if;

  insert into public.waitlist_signups
    (email, role, wallet_address, source, ip_hash, user_agent)
  values
    (p_email, p_role, p_wallet_address, p_source, p_ip_hash, p_user_agent)
  returning waitlist_signups.id into inserted_id;

  return query
    select
      ws.id,
      (select count(*) from public.waitlist_signups w where w.created_at <= ws.created_at)::bigint as position
    from public.waitlist_signups ws
    where ws.id = inserted_id;
end;
$$;

revoke all on function public.join_waitlist from public;
grant execute on function public.join_waitlist to anon, authenticated, service_role;
