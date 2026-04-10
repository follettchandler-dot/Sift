# Sift — Business Plan

## Executive Summary

Sift is building the **data infrastructure layer for itemized purchase intelligence.**

We're not another personal finance app. We're not another expense tracker. We're the pipe that makes item-level purchase data accessible to every consumer fintech, expense tool, and financial institution that needs it.

Today, $10.5 trillion in US consumer spending is locked at the merchant level. Every bank app, Mint, Monarch, Expensify, Ramp — they all show the same thing: "Walmart $152.39." The data exists at the item level inside POS systems, card networks, and merchant databases. Nobody has built the infrastructure to unlock it and make it accessible.

Sift is that infrastructure. We aggregate item-level purchase data from email receipts, retailer APIs, POS partnerships, card networks, and (eventually) our own card. Then we expose it through an API that any fintech, bank, or business can integrate.

**The Plaid playbook for itemized spending data.**

Plaid built the pipe for bank account access. Every fintech depends on it. Sift is building the pipe for item-level purchase data. Every fintech will depend on it.

## The Vision

### What We're Building

A data infrastructure layer with three customer types:

**1. API Customers (B2B2C)**
Other fintech apps, banks, and expense tools integrate the Sift API to add item-level data to their products. Monarch, Mint, Expensify, Ramp, neobanks, credit unions — they pay us per receipt processed.

**2. Direct Consumer Product**
Sift's own consumer app demonstrates the data product, builds the user base that powers the data engine, and serves users who want item-level intelligence directly.

**3. Direct Enterprise Product**
Item-level employee expense intelligence sold to mid-market companies. Highest-margin near-term revenue while we build the infrastructure layer.

### The Endgame

Sift becomes the default data layer for any product that needs to know what was purchased, not just where. Like Plaid for bank data or Twilio for SMS, we become unkillable infrastructure that every fintech depends on.

**Acquisition target: $5-15B** — comparable to Plaid ($13B+ valuation), Stripe ($50B+), Twilio ($10B+).

## The Three Pillars

### Pillar 1: Data Sources (Ingest)

The hardest and most defensible part. We aggregate item-level data from every possible source:

| Source | Coverage | Status |
|--------|----------|--------|
| Email receipt parsing | 60-70% | Building now |
| Retailer API connections | 75-85% | Phase 1 |
| Receipt photo OCR | 90-95% | Live |
| POS partnerships (Square, Toast, Clover) | 95-98% | Phase 2 |
| Bank/card network Level 3 data | 95-98% | Phase 2 |
| Sift Card (own card issuing) | 100% | Phase 3 |

Every new source increases coverage and makes the API more valuable.

### Pillar 2: Intelligence Engine (Process)

The AI layer that extracts items from raw data and categorizes them:
- **Item extraction** — parse line items from any receipt format (HTML, plain text, OCR, JSON)
- **Smart categorization** — 147 categories with 94% accuracy
- **Cross-merchant taxonomy** — same "snacks" category whether it's from Walmart, Target, or a gas station
- **User correction flywheel** — every correction trains per-user AND cross-user models

### Pillar 3: Distribution (Expose)

Three ways customers consume the data:

**API**
```
GET /api/v1/receipts/{id}
GET /api/v1/users/{id}/items?category=groceries&start=2026-04-01
POST /api/v1/parse  # send receipt text/image, get structured data back
GET /api/v1/categories
```

**Webhooks**
```
receipt.processed
item.categorized
budget.threshold_exceeded
```

**SDKs**
JavaScript, Python, Ruby — integrated in 5 minutes by any developer.

## Business Model

### Revenue Streams

**1. API Revenue (Long-term primary)**
- Pay-per-receipt-processed: $0.02-0.10 per receipt
- Volume tiers for high-volume customers
- Premium tier for real-time webhooks and advanced categorization
- Target customers: 100+ fintechs, banks, expense tools by Year 3
- Year 3 target: $30M+ ARR

**2. Direct Enterprise (Near-term primary)**
- $25-50/seat/month for item-level employee expense intelligence
- Direct sales to mid-market companies
- Highest gross margin, fastest sales cycle
- Year 1 target: $200K ARR
- Year 3 target: $20M ARR

**3. Direct Consumer (User base + data)**
- Freemium: free tier (30 receipts/mo), Plus ($8/mo), Pro ($15/mo)
- Drives user base for the data engine
- Generates training data for the AI categorization engine
- Year 1 target: 10K users, $50K ARR
- Year 3 target: 1M users, $5M ARR

**4. Data Licensing (Scale-dependent)**
- Anonymized, aggregated trend data for CPG brands, market research firms, hedge funds
- Activated at 100K+ users
- Year 3 target: 10 deals at $500K each = $5M ARR

### Total Revenue Targets

| Year | API | Enterprise | Consumer | Data | Total ARR |
|------|-----|-----------|----------|------|-----------|
| Year 1 | $0 | $200K | $50K | $0 | $250K |
| Year 2 | $2M | $5M | $1M | $1M | $9M |
| Year 3 | $30M | $20M | $5M | $5M | **$60M** |

## Why Infrastructure Wins

### The Plaid Comparison

Plaid was founded in 2013 to build bank account access infrastructure. They didn't try to compete with Mint or Venmo. They became the pipe those apps used.

**2013:** "Why do we need this? Banks already let users log in."
**2015:** A few fintechs integrated.
**2018:** Every major fintech depended on Plaid.
**2020:** Visa tried to acquire for $5.3B, blocked. Now valued $13B+.

Plaid won by being infrastructure, not a product. They serve every fintech instead of competing with them.

**Sift follows the exact same playbook for item-level data.**

### Why Item-Level Data Matters

Every consumer fintech, expense tool, and bank wants item-level data. They've wanted it for years. None of them can build it because:

1. **It's expensive infrastructure** — POS partnerships, OCR, AI categorization, multi-source aggregation
2. **It's outside their core business** — they're product companies, not data companies
3. **The data sources are fragmented** — no single source has it all

Sift solves all of this. We become the one place to get it. Then every fintech becomes our customer.

### The Moat

Once Sift is integrated into 50+ fintechs, switching costs become enormous. No competitor can offer the same coverage (we have all the data sources), the same accuracy (our AI has been training on millions of receipts), or the same integrations (50+ apps already use us).

**Network effects compound:**
- More users = more receipts = better AI = more accurate data
- More API customers = more usage = more revenue = more R&D investment
- More data sources = more coverage = more attractive to new customers

## Customer Strategy

### Phase 1: Direct Enterprise (Months 1-12)

Sell item-level employee expense intelligence directly to mid-market companies. This generates revenue, validates the value of item-level data, and builds case studies for the API play.

**Sales motion:**
- Direct outreach to CFOs and finance directors
- Demo: "Your team spent $14K at gas stations. $4,200 was snacks."
- Average deal: $3-5K/month
- Target: 50 customers by end of Year 1

### Phase 2: API Beta (Months 6-18)

Launch the API with 5-10 design partners. Other fintechs and small banks integrate Sift to add item-level data to their products.

**Design partner candidates:**
- Neobanks (Current, Chime, Varo) — differentiate against big banks
- Regional credit unions — offer features they can't build themselves
- Tax software (TurboTax, FreshBooks) — auto-categorize for tax filing
- Budgeting apps (YNAB, PocketGuard) — add item-level data without rebuilding

**Pricing:** Free for first 10K receipts/month, $0.05/receipt above.

### Phase 3: API General Availability (Months 12-24)

Open the API to any developer. Self-serve signup, pay-as-you-go billing.

**Marketing:**
- Developer documentation site
- Open-source SDKs
- Hackathon sponsorships
- Technical content marketing

**Target:** 100 paying API customers by Month 24.

### Phase 4: Sift Card (Months 18-36)

Launch our own card to capture 100% of cardholder spending at the item level. This becomes both a consumer product AND a data source that powers the API.

## Competitive Positioning

### We Don't Compete With Monarch, Mint, Expensify, or Ramp

We power them. Same way Plaid powers Venmo. They get to focus on their product while we provide the data layer.

### We DO Compete With

| Company | What They Do | Why Sift Wins |
|---------|-------------|---------------|
| Sensibill | Receipt data API | Bank-only distribution, no consumer product, weaker AI |
| Veryfi | Receipt OCR API | OCR only, no categorization or aggregation |
| Klippa | Document parsing | Document focus, not purchase intelligence |
| Bunq receipt feature | Wallet receipts | Single-bank, single-channel |

**Sift's edge:** We're the only company building the FULL stack — multi-source ingestion + AI categorization + cross-merchant taxonomy + developer APIs + consumer/enterprise products.

## Technology

### Current Stack
- **Frontend:** Next.js 16, Tailwind CSS, Vercel
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **AI:** Google Gemini 2.5 Flash (receipt parsing + categorization)
- **Payments:** Stripe (consumer + enterprise billing)
- **Live at:** sift-iota.vercel.app

### API Infrastructure (Building)
- REST API at api.sift.app (planned)
- Authentication via API keys + OAuth
- Webhook delivery system (planned)
- Rate limiting and quota management
- SDKs for JavaScript, Python, Ruby

### Data Sources (In Progress / Planned)
- Gmail OAuth integration (built — needs Google API credentials)
- Outlook integration (planned)
- Plaid for bank transaction matching (planned)
- Retailer OAuth (Walmart+, Target Circle, Amazon, Kroger, Costco)
- POS partner integrations (Square, Toast, Clover) — Phase 2
- BaaS card issuing (Marqeta, Lithic, Unit) — Phase 3

## Funding Strategy

### Bootstrap (Months 1-6)
- No funding needed initially
- Generate revenue from direct enterprise sales
- Founder-led sales, lean engineering
- Goal: $20-50K MRR from enterprise

### Seed Round: $1.5M - $3M (Months 6-12)
**Use of funds:**
- 3 engineering hires (1 senior, 2 mid-level)
- 1 partnerships lead
- POS partnership development
- API infrastructure build-out
- Sales team for enterprise scaling

**Milestones:**
- 50 enterprise customers
- 10 API design partners
- $1M ARR
- 100K consumer users

### Series A: $10M - $20M (Months 18-24)
**Use of funds:**
- API team scale-up
- Enterprise sales team (5+ AEs)
- Partnership team (POS, banks, retailers)
- Card program development (Marqeta integration, KYC, compliance)
- Marketing and developer evangelism

**Milestones:**
- 100 API customers
- $10M ARR
- Card program launching

### Series B: $30M - $60M (Months 30-36)
**Use of funds:**
- Card program scale-up
- Geographic expansion
- Data licensing team
- Enterprise sales scale (20+ AEs)

**Milestones:**
- $30M ARR
- Card program scaling
- 100K+ cardholders

## The Team

### Founder
Sales leadership background. Managed 50-rep org generating $3.4M annual revenue. Built MVP solo. Strong instincts for B2B sales and go-to-market.

### Key Hires (Seed)
1. **CTO / Technical Co-founder** — AI/ML and data engineering background
2. **Head of Partnerships** — POS, bank, retailer relationships
3. **Senior Backend Engineer** — API infrastructure, data pipelines
4. **Enterprise Sales Lead** — Mid-market expense intelligence sales

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Big tech (Plaid, Stripe) builds competing product | Medium | First mover advantage. Focus on AI categorization moat. Become acquisition target. |
| POS companies won't partner | High | Direct sales to enterprise generates revenue without partnerships. Multiple POS targets. Software layer alone covers 85-90% |
| API adoption slow | Medium | Start with design partners. Generous free tier. Strong developer experience. |
| Consumer apps don't see value in API | Low | Item-level data is universally valuable. Every fintech has wanted this for years. |
| Card program regulatory complexity | Medium | Use BaaS providers (Marqeta/Lithic). Hire fintech counsel. |

## Exit Scenarios

| Path | Timeline | Valuation Range |
|------|----------|----------------|
| Acquisition by Plaid/Stripe | Year 3-5 | $1-5B |
| Acquisition by major bank | Year 4-6 | $2-8B |
| Acquisition by data company (Bloomberg, S&P) | Year 4-6 | $3-10B |
| IPO | Year 6-8 | $5-15B |
| Profitable private infrastructure company | Ongoing | $100M+ ARR, cash-positive |

## Why Now

1. **AI accuracy crossed the threshold** — 94% categorization accuracy was impossible 2 years ago
2. **Digital receipts are mainstream** — 80%+ of major retailers now email receipts
3. **API-first fintech is the norm** — every company wants infrastructure they can integrate
4. **BaaS makes card issuing accessible** — Marqeta, Lithic, Unit democratized card programs
5. **Alternative data market exploding** — $7.3B and growing 40% CAGR
6. **Consumer data rights expanding** — CFPB Section 1033 protects consumer ownership of financial data

The window is open. Whoever builds the item-level data infrastructure first becomes the Plaid of purchase intelligence. That's a $10B+ outcome.

## Milestones

- [x] MVP built and deployed
- [x] AI receipt parsing working (94% accuracy)
- [x] Stripe billing integrated
- [x] Gmail OAuth integration built
- [ ] Google API credentials configured
- [ ] First 10 consumer users
- [ ] First enterprise pilot ($3-5K/month)
- [ ] API documentation site live
- [ ] First API design partner signed
- [ ] Seed funding round
- [ ] First POS partnership conversation
- [ ] 50 enterprise customers
- [ ] 10 paying API customers
- [ ] Series A
- [ ] Card program launch
