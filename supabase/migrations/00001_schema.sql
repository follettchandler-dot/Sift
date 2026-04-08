-- ============================================================
-- Sift — Core Schema
-- Migration: 00001_schema.sql
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS (extends auth.users)
-- ============================================================
CREATE TABLE public.users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ORGANIZATIONS (enterprise accounts)
-- ============================================================
CREATE TABLE public.organizations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  logo_url        TEXT,
  stripe_customer_id TEXT UNIQUE,
  subscription_tier TEXT NOT NULL DEFAULT 'enterprise'
    CHECK (subscription_tier IN ('enterprise')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ORG_MEMBERS (links users to orgs with roles)
-- ============================================================
CREATE TABLE public.org_members (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role            TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id)
);

-- ============================================================
-- CONNECTED_ACCOUNTS (OAuth tokens: Gmail, Plaid, etc.)
-- ============================================================
CREATE TABLE public.connected_accounts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider        TEXT NOT NULL
    CHECK (provider IN ('gmail', 'plaid', 'stripe', 'quickbooks', 'other')),
  provider_account_id TEXT,
  access_token    TEXT,
  refresh_token   TEXT,
  token_expires_at TIMESTAMPTZ,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider, provider_account_id)
);

-- ============================================================
-- RECEIPT_INBOXES (dedicated receipt email per user)
-- ============================================================
CREATE TABLE public.receipt_inboxes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  email_address   TEXT NOT NULL UNIQUE,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CATEGORIES (hierarchical, self-referencing)
-- ============================================================
CREATE TABLE public.categories (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id       UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL,
  icon            TEXT,                        -- Lucide icon name
  type            TEXT NOT NULL DEFAULT 'consumer'
    CHECK (type IN ('consumer', 'tax')),
  level           INT NOT NULL DEFAULT 0
    CHECK (level >= 0),
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (slug, type)
);

-- ============================================================
-- RECEIPTS
-- ============================================================
CREATE TABLE public.receipts (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  org_id                UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  merchant_name         TEXT,
  merchant_logo_url     TEXT,
  total                 NUMERIC(12, 2),
  currency              TEXT NOT NULL DEFAULT 'USD',
  transaction_date      DATE,
  source                TEXT NOT NULL DEFAULT 'manual'
    CHECK (source IN ('gmail', 'plaid', 'manual', 'inbox', 'upload')),
  processing_status     TEXT NOT NULL DEFAULT 'pending'
    CHECK (processing_status IN ('pending', 'processing', 'complete', 'failed')),
  plaid_transaction_id  TEXT UNIQUE,
  raw_email_id          TEXT,
  receipt_image_url     TEXT,
  notes                 TEXT,
  metadata              JSONB DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- RECEIPT_ITEMS (line items)
-- ============================================================
CREATE TABLE public.receipt_items (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_id       UUID NOT NULL REFERENCES public.receipts(id) ON DELETE CASCADE,
  category_id      UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  description      TEXT,
  quantity         NUMERIC(10, 4) DEFAULT 1,
  unit_price       NUMERIC(12, 2),
  total_price      NUMERIC(12, 2),
  confidence_score NUMERIC(4, 3) CHECK (confidence_score BETWEEN 0 AND 1),
  is_tax_deductible BOOLEAN DEFAULT false,
  metadata         JSONB DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- BUDGETS (per-user, per-category spending limits)
-- ============================================================
CREATE TABLE public.budgets (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id     UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  amount          NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  period          TEXT NOT NULL DEFAULT 'monthly'
    CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  start_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date        DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, category_id, period)
);

-- ============================================================
-- SPEND_POLICIES (enterprise rules)
-- ============================================================
CREATE TABLE public.spend_policies (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  category_id     UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  max_amount      NUMERIC(12, 2),
  requires_receipt BOOLEAN NOT NULL DEFAULT true,
  requires_approval BOOLEAN NOT NULL DEFAULT false,
  applies_to_role TEXT DEFAULT 'member'
    CHECK (applies_to_role IN ('owner', 'admin', 'member', 'viewer', NULL)),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- POLICY_VIOLATIONS (flagged items)
-- ============================================================
CREATE TABLE public.policy_violations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  policy_id       UUID NOT NULL REFERENCES public.spend_policies(id) ON DELETE CASCADE,
  receipt_id      UUID REFERENCES public.receipts(id) ON DELETE SET NULL,
  receipt_item_id UUID REFERENCES public.receipt_items(id) ON DELETE SET NULL,
  status          TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'acknowledged', 'resolved', 'dismissed')),
  notes           TEXT,
  resolved_at     TIMESTAMPTZ,
  resolved_by     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CATEGORY_OVERRIDES (user corrections for AI training)
-- ============================================================
CREATE TABLE public.category_overrides (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receipt_item_id      UUID NOT NULL REFERENCES public.receipt_items(id) ON DELETE CASCADE,
  original_category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  override_category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, receipt_item_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_receipts_user_date     ON public.receipts (user_id, transaction_date);
CREATE INDEX idx_receipts_org_date      ON public.receipts (org_id, transaction_date);
CREATE INDEX idx_receipts_plaid_txn     ON public.receipts (plaid_transaction_id);
CREATE INDEX idx_receipt_items_receipt  ON public.receipt_items (receipt_id);
CREATE INDEX idx_receipt_items_cat_date ON public.receipt_items (category_id, created_at);
CREATE INDEX idx_violations_org_status  ON public.policy_violations (org_id, status);
CREATE INDEX idx_violations_user_status ON public.policy_violations (user_id, status);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_inboxes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spend_policies    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_overrides ENABLE ROW LEVEL SECURITY;

-- users: own row only
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- organizations: members can see their org
CREATE POLICY "orgs_select_member" ON public.organizations
  FOR SELECT USING (
    id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

-- org_members: see own memberships
CREATE POLICY "org_members_select_own" ON public.org_members
  FOR SELECT USING (user_id = auth.uid());

-- connected_accounts: own rows only
CREATE POLICY "connected_accounts_select_own" ON public.connected_accounts
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "connected_accounts_insert_own" ON public.connected_accounts
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "connected_accounts_update_own" ON public.connected_accounts
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "connected_accounts_delete_own" ON public.connected_accounts
  FOR DELETE USING (user_id = auth.uid());

-- receipt_inboxes: own row only
CREATE POLICY "receipt_inboxes_select_own" ON public.receipt_inboxes
  FOR SELECT USING (user_id = auth.uid());

-- categories: visible to all authenticated users
CREATE POLICY "categories_select_all" ON public.categories
  FOR SELECT USING (auth.role() = 'authenticated');

-- receipts: own rows + org members
CREATE POLICY "receipts_select_own" ON public.receipts
  FOR SELECT USING (
    user_id = auth.uid()
    OR org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );
CREATE POLICY "receipts_insert_own" ON public.receipts
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "receipts_update_own" ON public.receipts
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "receipts_delete_own" ON public.receipts
  FOR DELETE USING (user_id = auth.uid());

-- receipt_items: accessible through receipt ownership
CREATE POLICY "receipt_items_select_own" ON public.receipt_items
  FOR SELECT USING (
    receipt_id IN (
      SELECT id FROM public.receipts WHERE user_id = auth.uid()
      UNION
      SELECT r.id FROM public.receipts r
        JOIN public.org_members om ON om.org_id = r.org_id AND om.user_id = auth.uid()
    )
  );
CREATE POLICY "receipt_items_insert_own" ON public.receipt_items
  FOR INSERT WITH CHECK (
    receipt_id IN (SELECT id FROM public.receipts WHERE user_id = auth.uid())
  );
CREATE POLICY "receipt_items_update_own" ON public.receipt_items
  FOR UPDATE USING (
    receipt_id IN (SELECT id FROM public.receipts WHERE user_id = auth.uid())
  );
CREATE POLICY "receipt_items_delete_own" ON public.receipt_items
  FOR DELETE USING (
    receipt_id IN (SELECT id FROM public.receipts WHERE user_id = auth.uid())
  );

-- budgets: own rows only
CREATE POLICY "budgets_select_own" ON public.budgets
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "budgets_insert_own" ON public.budgets
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "budgets_update_own" ON public.budgets
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "budgets_delete_own" ON public.budgets
  FOR DELETE USING (user_id = auth.uid());

-- spend_policies: org members can view
CREATE POLICY "spend_policies_select_org" ON public.spend_policies
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

-- policy_violations: own or org admin
CREATE POLICY "violations_select_own" ON public.policy_violations
  FOR SELECT USING (
    user_id = auth.uid()
    OR org_id IN (
      SELECT org_id FROM public.org_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- category_overrides: own rows only
CREATE POLICY "overrides_select_own" ON public.category_overrides
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "overrides_insert_own" ON public.category_overrides
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "overrides_update_own" ON public.category_overrides
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "overrides_delete_own" ON public.category_overrides
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create user profile when auth.users row is inserted
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on users table
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER connected_accounts_updated_at
  BEFORE UPDATE ON public.connected_accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER receipts_updated_at
  BEFORE UPDATE ON public.receipts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER spend_policies_updated_at
  BEFORE UPDATE ON public.spend_policies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER policy_violations_updated_at
  BEFORE UPDATE ON public.policy_violations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
