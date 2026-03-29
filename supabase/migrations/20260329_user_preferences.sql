create table if not exists user_preferences (
  user_id text primary key,
  subjects text[] default '{}',
  goal text,
  level text,
  study_style text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_preferences enable row level security;
drop policy if exists "deny anon access" on user_preferences;
create policy "deny anon access"
  on user_preferences for all to anon, authenticated using (false);
