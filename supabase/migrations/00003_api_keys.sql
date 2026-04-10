-- ============================================================
-- Sift — Public API Infrastructure
-- Migration: 00003_api_keys.sql
-- ============================================================

-- API consumers (companies/devs that integrate the Sift API)
create table public.api_consumers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade,
  name text not null,
  company_name text,
  email text not null,
  website text,
  use_case text,
  monthly_volume_estimate text,
  status text not null default 'active' check (status in ('active', 'suspended', 'revoked')),
  plan text not null default 'sandbox' check (plan in ('sandbox', 'starter', 'growth', 'scale', 'enterprise')),
  created_at timestamptz not null default now()
);

-- API keys (one consumer can have multiple keys: dev/prod)
create table public.api_keys (
  id uuid primary key default uuid_generate_v4(),
  consumer_id uuid not null references public.api_consumers on delete cascade,
  name text not null,
  key_prefix text not null,
  key_hash text not null unique,
  environment text not null default 'test' check (environment in ('test', 'live')),
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_api_keys_consumer on public.api_keys(consumer_id);
create index idx_api_keys_hash on public.api_keys(key_hash);

-- API usage tracking (for billing and rate limiting)
create table public.api_usage (
  id bigserial primary key,
  api_key_id uuid not null references public.api_keys on delete cascade,
  consumer_id uuid not null references public.api_consumers on delete cascade,
  endpoint text not null,
  status_code int not null,
  receipts_processed int default 0,
  items_processed int default 0,
  ai_tokens_used int default 0,
  created_at timestamptz not null default now()
);

create index idx_api_usage_consumer_date on public.api_usage(consumer_id, created_at desc);
create index idx_api_usage_key_date on public.api_usage(api_key_id, created_at desc);

-- Webhooks (for async events)
create table public.api_webhooks (
  id uuid primary key default uuid_generate_v4(),
  consumer_id uuid not null references public.api_consumers on delete cascade,
  url text not null,
  secret text not null,
  events text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.api_consumers enable row level security;
alter table public.api_keys enable row level security;
alter table public.api_usage enable row level security;
alter table public.api_webhooks enable row level security;

create policy "Users can view own consumers" on public.api_consumers for select using (auth.uid() = user_id);
create policy "Users can manage own consumers" on public.api_consumers for all using (auth.uid() = user_id);

create policy "Users can view own keys" on public.api_keys for select
  using (exists (select 1 from public.api_consumers where api_consumers.id = api_keys.consumer_id and api_consumers.user_id = auth.uid()));
create policy "Users can manage own keys" on public.api_keys for all
  using (exists (select 1 from public.api_consumers where api_consumers.id = api_keys.consumer_id and api_consumers.user_id = auth.uid()));

create policy "Users can view own usage" on public.api_usage for select
  using (exists (select 1 from public.api_consumers where api_consumers.id = api_usage.consumer_id and api_consumers.user_id = auth.uid()));
