-- 0003_unique_index_consolidation.sql
-- Idempotent cleanup of the email / wallet uniqueness story.
--
-- WHY
--   `0001` created `waitlist_signups_email_unique` as a UNIQUE CONSTRAINT,
--   which is backed by an index with the same name.  `0002` drops the
--   constraint and creates new partial-unique indexes (`*_unique_idx`).
--
--   On a fresh DB this works, but on databases that had `0001` applied
--   *before* `0002` we have observed two failure modes:
--     (a) The constraint name collides with the partial-index name if the
--         user ever renamed the index manually.
--     (b) Some `pg_dump`/restore cycles leave behind the old index even
--         after the constraint was dropped, blocking the new partial index.
--
--   This migration is purely defensive: drop any stale relations by the
--   old name, then re-assert the partial indexes and the check constraint.
--   Safe to run on any environment, including those that already have the
--   target schema — all statements are `if (not) exists` guarded.

begin;

-- Drop legacy constraint + backing index if either still exists.
alter table public.waitlist_signups
  drop constraint if exists waitlist_signups_email_unique;

drop index if exists public.waitlist_signups_email_unique;
drop index if exists public.waitlist_signups_wallet_idx;

-- Re-assert partial unique indexes from 0002 idempotently.
create unique index if not exists waitlist_signups_email_unique_idx
  on public.waitlist_signups (email)
  where email is not null;

create unique index if not exists waitlist_signups_wallet_unique_idx
  on public.waitlist_signups (lower(wallet_address))
  where wallet_address is not null;

-- Ensure the "at least one identifier present" check still holds.
alter table public.waitlist_signups
  drop constraint if exists waitlist_signups_email_or_wallet;
alter table public.waitlist_signups
  add constraint waitlist_signups_email_or_wallet
  check (email is not null or wallet_address is not null);

commit;
