-- Add LemonSqueezy columns to subscriptions table
-- (create table if it doesn't exist yet)
create table if not exists subscriptions (
  id                  uuid        primary key default gen_random_uuid(),
  user_id             text        not null unique,
  plan                text        not null default 'free',
  status              text,
  current_period_end  timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table subscriptions add column if not exists ls_customer_id     text;
alter table subscriptions add column if not exists ls_subscription_id text;
-- Keep stripe columns for backwards compat
alter table subscriptions add column if not exists stripe_customer_id     text;
alter table subscriptions add column if not exists stripe_subscription_id text;

-- Enable RLS
alter table subscriptions enable row level security;
drop policy if exists "deny anon access" on subscriptions;
create policy "deny anon access" on subscriptions for all to anon, authenticated using (false);
