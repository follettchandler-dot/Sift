-- Plaid items (one per connected bank/institution)
create table public.plaid_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users on delete cascade,
  plaid_item_id text not null unique,
  plaid_access_token text not null,
  institution_id text,
  institution_name text,
  cursor text,
  status text not null default 'active' check (status in ('active', 'error', 'requires_update')),
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_plaid_items_user on public.plaid_items(user_id);

-- Bank accounts (one Plaid item can have multiple accounts)
create table public.plaid_accounts (
  id uuid primary key default uuid_generate_v4(),
  plaid_item_id uuid not null references public.plaid_items on delete cascade,
  user_id uuid not null references public.users on delete cascade,
  plaid_account_id text not null unique,
  name text not null,
  official_name text,
  type text,
  subtype text,
  mask text,
  current_balance numeric(12, 2),
  available_balance numeric(12, 2),
  iso_currency_code text default 'USD',
  created_at timestamptz not null default now()
);

create index idx_plaid_accounts_user on public.plaid_accounts(user_id);

-- Transactions pulled from Plaid
create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users on delete cascade,
  plaid_account_id uuid references public.plaid_accounts on delete cascade,
  plaid_transaction_id text unique,
  receipt_id uuid references public.receipts on delete set null,
  merchant_name text,
  merchant_logo_url text,
  amount numeric(12, 2) not null,
  iso_currency_code text default 'USD',
  date date not null,
  authorized_date date,
  pending boolean default false,
  payment_channel text,
  category_primary text,
  category_detailed text,
  location_city text,
  location_region text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_transactions_user_date on public.transactions(user_id, date desc);
create index idx_transactions_receipt on public.transactions(receipt_id) where receipt_id is not null;
create index idx_transactions_unmatched on public.transactions(user_id, date desc) where receipt_id is null;

-- RLS
alter table public.plaid_items enable row level security;
alter table public.plaid_accounts enable row level security;
alter table public.transactions enable row level security;

create policy "Users can view own plaid items" on public.plaid_items for select using (auth.uid() = user_id);
create policy "Users can manage own plaid items" on public.plaid_items for all using (auth.uid() = user_id);

create policy "Users can view own plaid accounts" on public.plaid_accounts for select using (auth.uid() = user_id);

create policy "Users can view own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can update own transactions" on public.transactions for update using (auth.uid() = user_id);
