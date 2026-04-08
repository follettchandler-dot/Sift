# Sift — Itemized Receipt Intelligence Platform

## Overview

Sift is a dual-track SaaS platform that captures, parses, and categorizes itemized purchase data at the line-item level. No existing product does cross-merchant, item-level spend categorization. Banks and finance apps only show merchant-level charges ("Walmart $150"). Sift breaks that into "$80 groceries, $40 office supplies, $30 toys."

Three revenue streams from one AI engine:
1. **Consumer app** (freemium) — personal spending intelligence + AI assistant
2. **Enterprise dashboard** — employee card expense intelligence with policy enforcement
3. **Data platform** — anonymized, aggregated item-level purchase data licensing

## Business Model

### Pricing Tiers

**Consumer:**
- Free: 30 receipts/month, basic categories, receipt feed
- Plus ($8/mo): Unlimited receipts, AI chat assistant, budgets, smart alerts
- Pro ($15/mo): Tax categorization (Schedule C), export to accountant, priority support

**Enterprise:**
- Starter ($25/seat/mo): Employee card tracking, item categorization, basic reports
- Business ($40/seat/mo): Spend policies, approval workflows, department rollups, anomaly detection
- Enterprise ($50/seat/mo): Custom integrations, dedicated support, compliance reporting, API access

**Data Licensing:**
- Anonymized, aggregated trend data sold to CPG brands, retailers, market research firms, hedge funds
- Unlocks at ~50K active users
- Target: $500K-2M/year in licensing revenue

### Go-to-Market Timeline
- Month 1-2: Ship MVP (consumer + enterprise)
- Month 3-6: 10K consumer users, 5-10 enterprise clients ($25-50K MRR)
- Month 6-9: 50K users, data licensing conversations start
- Month 9-12: First data licensing deal, 20+ enterprise clients ($100K+ MRR)

## Market Position

**Competitive landscape:** Expensify, Ramp, Brex track expenses at merchant level. Mint/Credit Karma same. Fetch Rewards scans receipts for cashback, not intelligence. Dext/Shoeboxed scan for accountants but don't categorize items with AI. Zero companies offer cross-merchant, item-level spend categorization.

**vs. Apple/Google Wallet receipts:** They are single-channel (only their wallet's transactions). Sift is the aggregation layer across all channels — both wallets, email, loyalty accounts, scans, and bank statements. Apple/Google building receipt infrastructure is good for Sift — they train consumers to expect digital receipts and pressure retailers to adopt them. Sift sits on top.

**Privacy positioning:** "Your spending data belongs to you, not Big Tech." Sift never sells individual data. Only anonymized, aggregated trends — users can opt out.

## System Architecture

### Layer 1: Receipt Ingestion

Five channels, ordered by automation level:

1. **Email parser (auto, zero effort)** — User connects Gmail/Outlook via OAuth once. All digital receipts from major retailers (Walmart, Target, Amazon, Costco, Home Depot, Starbucks, DoorDash, Uber, etc.) are automatically parsed. Primary ingestion channel covering ~60-70% of spending.

2. **Loyalty account syncs (auto, zero effort)** — OAuth connections to Walmart+, Target Circle, Kroger, Amazon. Full itemized purchase history pulled automatically. Every future purchase syncs passively.

3. **Dedicated receipt email** — Users get a `username@receipts.sift.app` address. Set it as your receipt email at checkout. Receipts flow directly into Sift.

4. **Apple/Google Wallet integration** — Hook into digital receipt standards as they roll out. Tap to pay, receipt flows to Sift. Future channel, growing fast.

5. **Photo scan (fallback)** — Camera/upload OCR for physical receipts. Only needed for small local businesses, cash purchases, or merchants without digital receipts. The exception, not the rule.

**Gap matching:** Plaid connection sees bank charges. When a charge has no matched receipt, Sift flags it: "We see a $87.32 Target charge — snap the receipt or skip?" Only asks for photos on unmatched gaps.

### Layer 2: AI Categorization Engine

The core moat. Powered by Claude AI.

- **Item extraction:** Parse line items from any receipt format (email HTML, plain text, OCR output, API JSON). Normalize merchant-specific formats into standard schema.
- **Smart categorization:** Hierarchical category tree. Each item gets a primary category (Groceries > Produce > Fruits) and optional secondary (Tax: Deductible Meal). Both consumer categories and IRS Schedule C categories maintained.
- **Confidence scoring:** Every categorization gets a confidence score (0-1). Low confidence items surface for user correction.
- **Feedback loop:** User corrections feed back into the model. Per-user learning ("Jacob always categorizes Home Depot lumber as business expense") AND cross-user learning (network effect — more users = better categorization for everyone).
- **Anomaly detection:** Flags unusual purchases, policy violations (enterprise), spending spikes, duplicate charges.

### Layer 3: Three Products

#### Consumer App
- **AI Chat Assistant** — Primary interface. "How much did I spend on groceries this month?" "What did I buy at Target last Tuesday?" "Am I on track with my food budget?" Natural language queries against the full item-level database.
- **Spending Dashboard** — Visual breakdown by category, merchant, time period. Drill from high-level ("Food: $800") to item-level ("16 lb chicken breast from Costco, $42").
- **Receipt Feed** — Chronological list of all receipts. Tap to see itemized breakdown. Search by item, merchant, date, category.
- **Budgets** — Set spending limits per category. Real-time tracking. Smart alerts when approaching limits.
- **Tax Categories** — Auto-map items to IRS Schedule C categories. End-of-year export for accountant. "You have $14,200 in potential deductions this year."
- **Smart Alerts** — Price increases on regular purchases, unusual spending, budget warnings, duplicate charges.

#### Enterprise Dashboard
- **Employee Card Tracking** — See what every employee is buying, item by item. "Your field team spent $14K at gas stations — $4,200 was snacks, not fuel."
- **Spend Policy Engine** — Define rules: "max $50/day on meals", "no alcohol", "office supplies require pre-approval over $200". Auto-flag violations.
- **Department Rollups** — Aggregate spending by team, department, project, cost center.
- **Approval Workflows** — Route flagged purchases for manager approval. Configurable thresholds.
- **Compliance Reports** — Exportable reports for audits, tax filing, board reviews.
- **Admin Controls** — Role-based access (admin, manager, employee), SSO integration, invite management.

#### Data Platform (Phase 2)
- **Anonymization pipeline** — Strip all PII. Aggregate to minimum cohort sizes. Differential privacy techniques.
- **Trend analytics API** — "Organic food spending is up 12% in the Southeast among 25-34 year olds."
- **Dashboards for licensees** — Self-serve analytics portal for CPG brands and market researchers.

## Data Model

### Core Tables

```
users
  id, email, name, avatar_url, auth_provider, subscription_tier,
  created_at, updated_at

organizations
  id, name, slug, billing_email, subscription_tier, max_seats,
  spend_policy_config, created_at

org_members
  id, org_id, user_id, role (admin|manager|employee),
  department, cost_center, invited_at, joined_at

connected_accounts
  id, user_id, provider (gmail|outlook|walmart|target|amazon|plaid),
  access_token_encrypted, refresh_token_encrypted, status,
  last_synced_at, created_at

receipt_inboxes
  id, user_id, email_address (username@receipts.sift.app),
  is_active, created_at

receipts
  id, user_id, org_id (nullable), merchant_name, merchant_category,
  total_amount, currency, tax_amount, tip_amount,
  transaction_date, source (email|scan|loyalty_sync|wallet|manual),
  source_ref (email_id, image_url, etc.),
  plaid_transaction_id (nullable), raw_data_json,
  processing_status (pending|processed|failed),
  created_at

receipt_items
  id, receipt_id, name, description, quantity, unit_price,
  total_price, category_id, tax_category_id (nullable),
  confidence_score, is_user_corrected, original_category_id,
  created_at

categories
  id, parent_id (nullable), name, slug, icon,
  type (consumer|tax|enterprise), level (1-4),
  description

budgets
  id, user_id, category_id, amount_limit, period (weekly|monthly),
  alert_threshold_pct, is_active, created_at

spend_policies
  id, org_id, name, description, rule_type
  (max_amount|blocked_category|require_approval|time_restriction),
  rule_config_json, applies_to (all|department|role|user_ids),
  is_active, created_at

policy_violations
  id, spend_policy_id, receipt_item_id, receipt_id,
  user_id, org_id, status (flagged|approved|rejected),
  reviewed_by, reviewed_at, notes, created_at

category_overrides
  id, user_id, receipt_item_id, original_category_id,
  corrected_category_id, created_at

anonymized_transactions
  id, region, age_bracket, income_bracket, merchant_category,
  item_category_id, amount, transaction_month, created_at
```

### Key Indexes
- `receipts`: (user_id, transaction_date), (org_id, transaction_date), (plaid_transaction_id)
- `receipt_items`: (receipt_id), (category_id, created_at)
- `policy_violations`: (org_id, status), (user_id, status)
- `anonymized_transactions`: (item_category_id, transaction_month, region)

## Tech Stack

- **Frontend:** Next.js App Router, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API routes + Vercel Functions (Fluid Compute)
- **Database:** Supabase (PostgreSQL + Row Level Security + Realtime)
- **Auth:** Supabase Auth (email/password, Google OAuth, Apple Sign-In, SSO for enterprise)
- **AI:** Claude API via Vercel AI SDK — receipt parsing, categorization, chat assistant
- **OCR:** Google Cloud Vision API or Tesseract (receipt photo scanning)
- **Email parsing:** Gmail API + Outlook Graph API via OAuth
- **Bank connection:** Plaid (transaction matching + card linking)
- **Payments:** Stripe (consumer subscriptions + enterprise billing)
- **Storage:** Supabase Storage (receipt images)
- **Hosting:** Vercel
- **Background jobs:** Vercel Functions (Fluid Compute) for receipt processing pipeline
- **Search:** Supabase full-text search on receipt items

## Auth & Security

- Supabase Auth with RLS policies on all tables
- Enterprise SSO via SAML (phase 2)
- All connected account tokens encrypted at rest
- Receipt images stored in private Supabase Storage buckets
- PII never leaves the primary database
- Anonymization pipeline runs as a separate service with no access to PII tables
- SOC 2 compliance target for enterprise sales

## Receipt Processing Pipeline

1. **Ingest** — Receipt arrives (email webhook, loyalty sync, photo upload, wallet event)
2. **Normalize** — Extract raw text/HTML/JSON into standard format
3. **Parse** — AI extracts merchant info, line items, totals, tax, tip
4. **Categorize** — AI assigns categories to each item with confidence scores
5. **Match** — Attempt to match with Plaid bank transactions
6. **Policy check** (enterprise) — Run items against org spend policies
7. **Store** — Write receipt + items to database
8. **Notify** — Push alerts for budget warnings, policy violations, anomalies

Each step is idempotent. Failed steps retry with exponential backoff.

## Pages / Routes

### Consumer
- `/` — Landing page / marketing
- `/login`, `/signup` — Auth flows
- `/dashboard` — Spending overview, category breakdown, trends
- `/chat` — AI assistant (primary interface)
- `/receipts` — Receipt feed with search/filter
- `/receipts/[id]` — Single receipt with itemized breakdown
- `/budgets` — Budget management
- `/tax` — Tax category summary and export (Pro tier)
- `/settings` — Account, connected accounts, subscription, preferences
- `/connect` — Link email, loyalty accounts, bank

### Enterprise
- `/org/dashboard` — Company-wide spend overview
- `/org/employees` — Employee list with spending summaries
- `/org/employees/[id]` — Individual employee spend detail
- `/org/policies` — Spend policy management
- `/org/violations` — Policy violation queue
- `/org/reports` — Compliance and spend reports
- `/org/settings` — Org settings, SSO, billing, roles

### API Routes
- `/api/receipts` — CRUD for receipts
- `/api/receipts/scan` — Photo upload + OCR processing
- `/api/receipts/process` — Receipt processing pipeline trigger
- `/api/chat` — AI chat endpoint (streaming)
- `/api/connect/[provider]` — OAuth flows for email/loyalty/bank
- `/api/webhooks/email` — Inbound email receipt webhook
- `/api/webhooks/plaid` — Plaid transaction webhooks
- `/api/webhooks/stripe` — Stripe subscription webhooks
- `/api/budgets` — Budget CRUD
- `/api/org/policies` — Policy CRUD
- `/api/org/reports` — Report generation
- `/api/data/trends` — Data platform API (licensed access)
