# SIFT — Handoff

Itemized receipt intelligence platform. Breaks down charges item-by-item instead of merchant-level (not "Walmart $150" but "$80 groceries, $40 office, $30 toys").

## Ownership
- **Company owner:** Chandler Follett
- **GitHub repo owner:** `follettchandler-dot/SIFT` (private)
- **Supabase owner:** Chandler's account
- **Built with:** Jacob Trask (co-founder / dev lead)

## Revenue model
Three streams from one AI engine:
1. Consumer freemium ($0 / $8 / $15 per month)
2. Enterprise expense intelligence ($25-50 / seat / month)
3. Anonymized data licensing ($500K-2M / year at scale)

## Stack
- Next.js 16 (App Router) + React 19
- Supabase (Postgres, auth, storage)
- AI SDK v6 (`ai` + `@ai-sdk/google`) for receipt parsing
- Google Cloud Vision for OCR
- Stripe for billing
- Plaid for bank connections (scaffolded)
- Tailwind v4 + shadcn
- Deployed on Vercel

## Live URLs
- Production: https://sift-iota.vercel.app
- Supabase project: `xowkfwgaywbzlmxdlaku.supabase.co`

## Current status (as of handoff)
- MVP built, landing page live
- Supabase schema + seed categories applied
- Receipts storage bucket created
- First Vercel deploy live
- Subsequent deploys were blocked by a GitHub account flag on Jacob's side — may be resolved now, verify before next push

## Env vars required (names only — real values shared separately)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # sb_publishable_* format
SUPABASE_SERVICE_ROLE_KEY       # sb_secret_* format
NEXT_PUBLIC_APP_URL
AI_GATEWAY_API_KEY              # still needed
STRIPE_SECRET_KEY               # still needed
STRIPE_WEBHOOK_SECRET           # still needed
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
GOOGLE_APPLICATION_CREDENTIALS  # Vision OCR — still needed
PLAID_CLIENT_ID
PLAID_SECRET
```

## Key directories
- `app/` — Next.js App Router pages + API routes
- `components/` — shared UI (shadcn-based)
- `lib/` — Supabase client, Stripe, AI utilities
- `supabase/` — migrations + seed SQL
- `hooks/` — client-side hooks

## Design system
Editorial fintech — warm cream / stone palette, amber accents, DM Serif Display + Outfit fonts. Not a dark-mode AI template. See landing page for reference.

## Next steps
1. Get AI Gateway API key, Stripe products/prices, Google Cloud Vision credentials
2. Verify subsequent Vercel deploys work (was blocked by GitHub flag)
3. Build enterprise dashboard (Phase 2)
4. Email parsing — Gmail / Outlook ingestion
5. Loyalty syncs — Walmart+, Target, Amazon
6. Plaid bank connection wiring
7. Data licensing platform

## Local dev
```bash
npm install
cp .env.example .env.local   # then fill in from the secrets handoff
npm run dev
```

## Important
This repo uses **Next.js 16** — docs and training data for older versions are stale. See `AGENTS.md` and `node_modules/next/dist/docs/` before writing Next.js code.
