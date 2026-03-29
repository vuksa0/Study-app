-- Enable RLS on all user-data tables.
-- The app uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS) so backend routes
-- continue to work. These policies block direct anon/public-key access.

-- ── library_items ─────────────────────────────────────────────────────────
alter table if exists library_items enable row level security;

-- No direct access via anon key; all access goes through the Next.js API
-- which uses the service role key.
drop policy if exists "deny anon access" on library_items;
create policy "deny anon access"
  on library_items
  for all
  to anon, authenticated
  using (false);

-- ── learn_progress ────────────────────────────────────────────────────────
alter table if exists learn_progress enable row level security;

drop policy if exists "deny anon access" on learn_progress;
create policy "deny anon access"
  on learn_progress
  for all
  to anon, authenticated
  using (false);

-- ── ai_usage_logs ─────────────────────────────────────────────────────────
alter table if exists ai_usage_logs enable row level security;

drop policy if exists "deny anon access" on ai_usage_logs;
create policy "deny anon access"
  on ai_usage_logs
  for all
  to anon, authenticated
  using (false);
