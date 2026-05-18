-- Allow signups with email, wallet, or both.

alter table public.waitlist_signups
  alter column email drop not null;

alter table public.waitlist_signups
  drop constraint if exists waitlist_signups_email_unique;

create unique index if not exists waitlist_signups_email_unique_idx
  on public.waitlist_signups (email)
  where email is not null;

drop index if exists public.waitlist_signups_wallet_idx;
create unique index if not exists waitlist_signups_wallet_unique_idx
  on public.waitlist_signups (lower(wallet_address))
  where wallet_address is not null;

alter table public.waitlist_signups
  drop constraint if exists waitlist_signups_email_or_wallet;
alter table public.waitlist_signups
  add constraint waitlist_signups_email_or_wallet
  check (email is not null or wallet_address is not null);

create or replace function public.join_waitlist(
  p_email          citext default null,
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
  if p_email is null and p_wallet_address is null then
    raise exception using errcode = '22023', message = 'email_or_wallet_required';
  end if;

  if p_ip_hash is not null then
    select count(*) into recent_count
      from public.waitlist_signups
     where ip_hash = p_ip_hash
       and created_at > now() - rate_window;
    if recent_count >= rate_max then
      raise exception using errcode = 'P0001', message = 'rate_limit_exceeded';
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
      (select count(*) from public.waitlist_signups w where w.created_at <= ws.created_at)::bigint as queue_position
    from public.waitlist_signups ws
    where ws.id = inserted_id;
end;
$$;
