# Sift — Business Plan

## Executive Summary

Sift is building the infrastructure layer for itemized purchase data. Not another budgeting app. Not another expense tracker. We're building the system that makes it technically possible to know exactly what every dollar was spent on — automatically, passively, for every transaction, at every merchant.

Today, $10.5 trillion in US consumer spending is invisible at the item level. Banks show "Walmart $152." Nobody shows "$82 groceries, $41 office supplies, $29 toys." Not because the data doesn't exist — it does, locked inside POS systems, card networks, and merchant databases. The problem is that nobody has built the aggregation and intelligence layer to unlock it.

Sift is that layer. We start with what's accessible today (email receipts, retailer APIs) to build a user base. Then we use that user base as leverage to unlock the data sources that require partnerships (POS systems, card networks). Then we issue our own card to capture 100% of transactions natively. Each phase funds and enables the next.

The endgame: **the credit card that knows what you bought.** Not where you shopped. What you bought. Every item, every store, every swipe, automatically.

## The Vision: 100% Itemized Coverage

Most fintech companies start with the easy data and stop there. We're building a three-phase system where each phase closes a coverage gap and funds the next:

### Phase 1: Software Layer (Months 1-12)
**Coverage: 85-90% of transactions**

What we can access today without any partnerships:
- **Email receipt parsing** — Gmail/Outlook OAuth. Auto-scan inbox for receipts from 200+ major retailers. User connects once, never touches it again.
- **Retailer account linking** — Walmart+, Target Circle, Amazon, Kroger, Costco. Full purchase history with every item via their APIs. One-time setup, continuous sync.
- **Bank transaction matching** — Plaid sees "Target $87.32." Email receipt from Target shows items. Auto-match. For unmatched transactions, surface them as "untracked" — not requiring action, just transparency.
- **Photo scan** — Fallback for the 10-15% of merchants that don't email receipts. Not the primary experience.

This phase builds the user base, proves the AI categorization engine, and generates revenue through consumer subscriptions and early enterprise deals.

**Revenue target: $50K MRR by Month 12**

### Phase 2: Partnership Layer (Months 6-24)
**Coverage: 95-98% of transactions**

This is where we break through the wall. The data for the remaining 10-15% exists — it's inside POS systems. We go get it.

**POS System Partnerships**

Target partners: Square, Toast, Clover, Lightspeed, Shopify POS

These companies process transactions for millions of small businesses — the gas stations, restaurants, and corner stores that don't email receipts. They have complete item-level data for every transaction.

The partnership model:
- Sift identifies when a consumer's card number matches a transaction in the POS system
- The POS company shares the itemized receipt data for that specific transaction
- The consumer has already consented through Sift's terms of service
- The POS company gets: analytics on their merchants' customers, a value-add feature to offer merchants ("your customers can auto-track their receipts"), and potential revenue share

**Why they'll partner with us:**
- At 100K+ users, we have a meaningful consumer base that shops at their merchants
- We drive consumer engagement with their merchants' businesses
- We solve a problem their merchants hear about: "Can I get a copy of my receipt?"
- No POS company is building consumer-facing receipt intelligence — it's outside their business model

**Digital Receipt Standard (ARTS/NRF)**
The National Retail Federation has been pushing standardized digital receipt formats. As adoption grows, we become the consumer aggregator — the inbox where all digital receipts land automatically, regardless of format or merchant.

**Bank/Neobank Partnership**
Partner with one neobank (like Current, Chime, or a credit union) to be their "smart spending" feature. They share Level 2/3 card data with us for their cardholders. In return, their app gets item-level spending breakdowns as a differentiating feature. Their customers see "Sift-powered spending insights" inside their banking app.

This is a white-label play that gives us massive data volume and proves the model for larger bank partnerships.

**Revenue target: $500K MRR by Month 24**

### Phase 3: The Sift Card (Months 18-36)
**Coverage: 100% of transactions on the Sift card**

This is the endgame. We issue our own debit and credit card through a banking-as-a-service provider (Marqeta, Lithic, or Unit).

**Why this changes everything:**

When WE are the card issuer, we sit in the payment flow. We receive Level 3 item data directly from the merchant's payment processor on every single transaction. No partnerships needed. No email parsing. No photo scanning. The user swipes their Sift card, and 3 seconds later every item appears in their app, categorized.

**"The card that knows what you bought."**

This is a category-defining product. Ramp and Brex issue cards but only show merchant-level data. Apple Card shows merchant-level data. Every card in existence shows merchant-level data. Sift would be the first card that shows item-level data.

**The card also solves the business model:**
- Interchange revenue: 1-3% on every transaction (this alone is a massive revenue stream at scale)
- Subscription revenue: Premium card tiers with enhanced features
- Data licensing: Card transaction data is the most complete dataset possible
- Enterprise cards: Corporate Sift cards for employee expense intelligence

**Banking-as-a-Service partners:**
- **Marqeta** — Powers Square Card, DoorDash, Uber. Modern API, strong Level 3 data support.
- **Lithic** — Developer-first card issuing. Fast launch, low minimums. Good for MVP card.
- **Unit** — Full banking-as-a-service. Checking accounts + cards. Could offer Sift as a full banking product.

**Revenue target: $2.5M MRR by Month 36**

## Why Nobody Has Done This

**Banks won't do it.** They make money on interchange fees. More spending = more revenue. Showing customers exactly what they buy encourages smarter spending, which reduces bank revenue. It's against their financial interest.

**Card networks won't do it.** Visa and Mastercard are B2B infrastructure. They serve banks and merchants, not consumers. Building a consumer product is outside their DNA and business model.

**Expense tools won't do it.** Expensify, Ramp, Brex — they're focused on corporate expense management. They don't have consumer products, and they don't have the AI engine to categorize 147 item categories with 94% accuracy.

**POS companies won't do it.** Square, Toast, Clover serve merchants, not consumers. They have the data but no consumer distribution. They'd rather partner with someone who has consumer users.

**Apple/Google won't do it.** They only see their own wallet transactions. They'll never aggregate across competing wallets, bank cards, and cash purchases. They're single-channel by design.

The only company that can do this is one purpose-built for it. One that starts with software, builds a user base, uses that leverage for partnerships, and ultimately issues its own card. That's Sift.

## Revenue Model

### Three Revenue Streams (Software Phase)

**Consumer SaaS**
| Tier | Price | Target Users (Y2) | Annual Revenue |
|------|-------|--------------------|---------------|
| Free | $0 | 950K | $0 (data value) |
| Plus | $8/mo | 35K | $3.4M |
| Pro | $15/mo | 15K | $2.7M |
| **Total** | | **1M** | **$6.1M** |

**Enterprise Expense Intelligence**
| Tier | Price | Target Clients (Y2) | Annual Revenue |
|------|-------|---------------------|---------------|
| Starter | $25/seat/mo | 100 (avg 20 seats) | $6M |
| Business | $40/seat/mo | 75 (avg 30 seats) | $10.8M |
| Enterprise | $50/seat/mo | 25 (avg 50 seats) | $7.5M |
| **Total** | | **200 companies** | **$24.3M** |

**Data Licensing**
- Anonymized, aggregated item-level purchase trends
- Buyers: CPG brands, retailers, market research firms, hedge funds
- Target: 10 deals at avg $500K/year = **$5M**

### Card Revenue Stream (Phase 3)

| Source | Per-Transaction | At 100K Cardholders |
|--------|----------------|-------------------|
| Interchange | 1.5% avg | $36M/year |
| Monthly fee (premium) | $9.99/mo | $6M/year |
| Data licensing uplift | — | $10M/year |
| **Total** | | **$52M/year** |

The card transforms Sift from a $30M ARR software company into a $50M+ ARR fintech company.

## Unit Economics

### Consumer (Software)
- CAC: $15 (organic + content marketing)
- LTV (Plus, 18mo retention): $144
- LTV/CAC: 9.6x
- Payback period: 1.9 months
- Gross margin: 85%+

### Enterprise
- CAC: $5,000 (direct sales)
- ACV: $36,000 (avg 25 seats at $30/seat x 12mo + expansion)
- LTV (36mo retention): $108,000
- LTV/CAC: 21.6x
- Payback period: 1.7 months

### Card (Phase 3)
- CAC: $50 (existing user conversion)
- Annual revenue per cardholder: $360 (interchange) + $120 (subscription) = $480
- LTV (48mo): $1,920
- LTV/CAC: 38.4x

## Go-to-Market Strategy

### Immediate (Months 1-6): Build the Base
- Launch consumer app with email parsing + retailer linking
- Content marketing: "I spent $340 on coffee this month" viral share cards
- SEO: "receipt tracker", "itemized spending", "budget by category"
- Target: 10K users, 500 paid subscribers

### Growth (Months 3-12): Enterprise Revenue
- Direct sales to mid-market companies (50-500 employees)
- Lead with: "We'll show you what your employees are actually buying"
- Sales playbook: Demo with real gas station receipt breakdowns
- Partner channel: Accountants and bookkeepers who recommend to clients
- Target: 25 enterprise clients, $100K MRR

### Scale (Months 6-18): Partnerships
- Approach Square with 100K+ user base as leverage
- Pitch neobank partnership (white-label smart spending)
- Join NRF digital receipt standard working group
- Target: 2 POS partnerships, 1 bank partnership

### Endgame (Months 18-36): The Card
- Launch Sift Card via Marqeta or Lithic
- Convert existing users to cardholders
- "Never miss a receipt again — every item, every swipe, automatically"
- Target: 50K cardholders in first year

## Competitive Landscape

| Company | Item Data? | AI Categorization? | Cross-Merchant? | Card Issuer? |
|---------|-----------|-------------------|-----------------|-------------|
| Mint/Credit Karma | No | No | Yes | No |
| Expensify | No | Basic | No | No |
| Ramp/Brex | No | Basic | No | Yes (merchant-level only) |
| Fetch Rewards | Yes (for rewards) | No | Yes | No |
| Apple Card | No | No | No | Yes (merchant-level only) |
| **Sift** | **Yes** | **94% accuracy** | **Yes** | **Planned (item-level)** |

### Defensibility (Four Compounding Moats)

1. **Data network effect** — More users = better AI = better product = more users. Every receipt trains the model.
2. **Category taxonomy** — 147 categories, continuously refined. Years of accumulated categorization logic.
3. **User correction flywheel** — Every correction trains per-user AND cross-user models. Compounds over time.
4. **Aggregated data asset** — The anonymized dataset becomes exponentially more valuable with scale. This is the moat that makes us acquirable.

### Why This Is a Billion-Dollar Company

At 1M cardholders doing avg $2,000/month in spending:
- Interchange alone: $360M/year
- Subscription + data licensing: $100M+/year
- Total revenue potential: $400M+/year

Companies at this scale (Chime, Current, Brex, Ramp) are valued at 10-30x revenue. Sift with the card product at scale is a **$4-12B company**.

But we don't need to get there to be a great business. Even at the software-only stage with 200 enterprise clients and 50K paid consumers, Sift is a $30M ARR company worth $150-300M.

## Technology

### Current Stack
- **Frontend:** Next.js 16, Tailwind CSS, Vercel
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **AI:** Google Gemini 2.5 Flash (receipt parsing + categorization)
- **Payments:** Stripe (consumer + enterprise billing)
- **Live at:** sift-iota.vercel.app

### Phase 2 Additions
- Gmail API + Microsoft Graph API (email receipt parsing)
- Retailer OAuth integrations (Walmart+, Target Circle, Amazon, Kroger)
- Plaid (bank transaction matching)
- POS partner APIs (Square, Toast, Clover)

### Phase 3 Additions
- Marqeta or Lithic (card issuing)
- KYC/AML compliance (Alloy or Persona)
- Core banking integration (Unit or Treasury Prime)

## Financial Projections

### Year 1 (Software Phase)
| Quarter | Users | Paid | Enterprise | MRR | Cumulative Revenue |
|---------|-------|------|-----------|-----|-------------------|
| Q1 | 2K | 100 | 0 | $800 | $2.4K |
| Q2 | 8K | 500 | 3 | $13K | $41K |
| Q3 | 25K | 2K | 8 | $45K | $176K |
| Q4 | 50K | 5K | 15 | $105K | $491K |

### Year 2 (Partnership Phase)
| Quarter | Users | Paid | Enterprise | Data Deals | MRR |
|---------|-------|------|-----------|------------|-----|
| Q1 | 100K | 10K | 25 | 1 | $250K |
| Q2 | 250K | 25K | 50 | 3 | $550K |
| Q3 | 500K | 50K | 100 | 5 | $1.1M |
| Q4 | 1M | 100K | 200 | 10 | $2.5M |

### Year 3 (Card Phase)
| Quarter | Cardholders | Total Users | MRR |
|---------|------------|-------------|-----|
| Q1 | 10K | 1.5M | $3.5M |
| Q2 | 25K | 2M | $5M |
| Q3 | 50K | 3M | $7.5M |
| Q4 | 100K | 5M | $12M |

## Funding Strategy

### Seed Round: $750K - $1.5M
- **When:** Now (MVP live, first users)
- **Use:** 2 engineering hires, marketing, email parsing + retailer integrations
- **Milestone:** 50K users, 15 enterprise clients, $100K MRR

### Series A: $5M - $10M
- **When:** Month 12-18 (proven product-market fit)
- **Use:** POS partnerships, bank partnership, card program development, sales team
- **Milestone:** 500K users, 100 enterprise clients, $1M MRR, card program in development

### Series B: $20M - $40M
- **When:** Month 24-30 (card launched, scaling)
- **Use:** Card marketing, geographic expansion, data platform build-out
- **Milestone:** 100K cardholders, $10M+ MRR

## Team

### Current
- **Founder/CEO** — Sales leadership background (managed 50-rep org generating $3.4M). Built MVP and go-to-market. Brings B2B sales DNA — knows how to sell to businesses and close enterprise deals.

### Key Hires (Seed)
1. **CTO / Technical Co-founder** — AI/ML background. Owns the categorization engine, POS integrations, and card infrastructure.
2. **Growth Lead** — Consumer acquisition. Content marketing, viral mechanics, SEO.

### Key Hires (Series A)
3. **Head of Partnerships** — POS and bank partnership development
4. **Enterprise Sales** — 2 AEs for mid-market enterprise deals
5. **Fintech/Card Lead** — Banking-as-a-service integration, compliance, card program

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| POS companies won't partner | High | Build user base first for leverage. Multiple POS targets. Can succeed without POS partnerships at 85-90% coverage. |
| Card program regulatory complexity | Medium | Use established BaaS providers (Marqeta/Lithic) who handle compliance. Hire fintech counsel. |
| Consumer adoption slow | Medium | Free tier removes friction. Viral sharing mechanics. Enterprise revenue funds consumer growth. |
| Apple/Google build competing product | Low | They're single-channel. Can't aggregate across ecosystems. Our cross-platform aggregation is the moat. |
| AI categorization accuracy issues | Low | 94% accuracy today with correction flywheel improving continuously. Users tolerate imperfection with the ability to correct. |
| Privacy/data concerns | Medium | Privacy-first positioning. SOC 2 compliance. Users own their data. Opt-in only for anonymized aggregation. |
| Bank builds it themselves | Low | Banks have had Level 3 data for 20+ years and haven't built this. It's against their financial interest. |

## Exit Scenarios

| Scenario | Timeline | Valuation Range |
|----------|----------|----------------|
| Acquisition by bank (Chase, Capital One) | Year 3-4 | $200-500M |
| Acquisition by fintech (Plaid, Stripe, Square) | Year 2-4 | $300M-1B |
| Acquisition by data company (Bloomberg, Nielsen) | Year 3-5 | $500M-2B |
| IPO | Year 5-7 | $1-5B |
| Profitable private company | Ongoing | $30M+ ARR, cash-flow positive |

The most likely acquirer is a company that needs item-level purchase data at scale: a card issuer wanting to differentiate (Capital One), a payments company wanting consumer data (Stripe/Square), or a data company wanting alternative data (Bloomberg). All of these have made acquisitions in this range.

## Milestones

- [x] MVP built and deployed (sift-iota.vercel.app)
- [x] AI receipt parsing and categorization working (94% accuracy)
- [x] Stripe billing integrated (Free/Plus/Pro tiers)
- [x] AI chat assistant live (Gemini-powered)
- [ ] First 100 consumer users
- [ ] Email receipt auto-parsing (Gmail/Outlook)
- [ ] Retailer account linking (Walmart+, Target, Amazon)
- [ ] First enterprise pilot
- [ ] Seed funding closed
- [ ] First POS partnership signed
- [ ] Neobank white-label partnership
- [ ] Sift Card launched
- [ ] 100K cardholders
