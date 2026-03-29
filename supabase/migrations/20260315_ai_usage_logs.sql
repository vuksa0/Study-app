-- AI usage tracking for rate limiting all AI generation routes
create table if not exists ai_usage_logs (
  id         uuid        primary key default gen_random_uuid(),
  user_id    text        not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_usage_logs_user_created
  on ai_usage_logs (user_id, created_at);
