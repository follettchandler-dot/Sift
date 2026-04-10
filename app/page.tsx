"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  Check,
  Shield,
  Lock,
  Eye,
  Server,
  ChevronDown,
  Play,
  Zap,
  BarChart3,
  MessageSquare,
  Target,
  Building2,
} from "lucide-react"

function XIcon() {
  return (
    <svg className="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg className="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

// ─── Dashboard Mockup ───────────────────────────────────────────────────────

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-[580px]">
      {/* Floating category pill — back layer */}
      <div className="absolute -top-4 -left-6 z-10 bg-white border border-stone-200 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2 text-xs font-medium text-stone-700">
        <span className="w-2 h-2 rounded-full bg-lime-400" />
        Groceries · $284
      </div>
      <div className="absolute top-20 -right-8 z-10 bg-white border border-stone-200 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2 text-xs font-medium text-stone-700">
        <span className="w-2 h-2 rounded-full bg-sky-400" />
        Office · $142
      </div>

      {/* Main dashboard card */}
      <div className="bg-white rounded-2xl shadow-2xl shadow-stone-900/10 border border-stone-200/80 overflow-hidden">
        {/* Dashboard header */}
        <div className="bg-stone-900 px-5 py-3.5 flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-stone-600" />
            <div className="w-3 h-3 rounded-full bg-stone-600" />
            <div className="w-3 h-3 rounded-full bg-stone-600" />
          </div>
          <div className="flex-1 mx-4 bg-stone-700 rounded-md h-5 flex items-center px-3">
            <span className="text-stone-400 text-[10px]">app.itemized.io/dashboard</span>
          </div>
        </div>

        <div className="p-5">
          {/* Stat cards row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "This month", value: "$2,847", change: "+12%", up: false },
              { label: "Groceries", value: "$412", change: "of $450 budget", up: true },
              { label: "Items tracked", value: "384", change: "across 47 receipts", up: true },
            ].map((stat) => (
              <div key={stat.label} className="bg-stone-50 rounded-xl p-3 border border-stone-100">
                <p className="text-stone-400 text-[10px] mb-1">{stat.label}</p>
                <p className="font-semibold text-stone-900 text-base leading-none mb-1">{stat.value}</p>
                <p className="text-[10px] text-stone-400">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-4">
            {/* Donut chart */}
            <div className="col-span-2">
              <p className="text-stone-400 text-[10px] mb-2 uppercase tracking-wider">By Category</p>
              <div className="relative w-24 h-24 mx-auto">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#84cc16" strokeWidth="3.5"
                    strokeDasharray="35 65" strokeDashoffset="0" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#38bdf8" strokeWidth="3.5"
                    strokeDasharray="28 72" strokeDashoffset="-35" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f59e0b" strokeWidth="3.5"
                    strokeDasharray="20 80" strokeDashoffset="-63" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#a78bfa" strokeWidth="3.5"
                    strokeDasharray="17 83" strokeDashoffset="-83" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] text-stone-500 font-medium text-center leading-tight">Apr<br />2026</span>
                </div>
              </div>
              <div className="space-y-1.5 mt-3">
                {[
                  { name: "Groceries", pct: "35%", color: "bg-lime-400" },
                  { name: "Office", pct: "28%", color: "bg-sky-400" },
                  { name: "Dining", pct: "20%", color: "bg-amber-400" },
                  { name: "Other", pct: "17%", color: "bg-violet-400" },
                ].map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${c.color}`} />
                      <span className="text-stone-500">{c.name}</span>
                    </div>
                    <span className="text-stone-700 font-medium">{c.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent transactions */}
            <div className="col-span-3">
              <p className="text-stone-400 text-[10px] mb-2 uppercase tracking-wider">Recent Items</p>
              <div className="space-y-1.5">
                {[
                  { name: "Organic Whole Milk", store: "Whole Foods", cat: "Groceries", price: "$6.49", color: "bg-lime-400" },
                  { name: "Printer Paper 500ct", store: "Staples", cat: "Office", price: "$11.99", color: "bg-sky-400" },
                  { name: "Avocado Toast", store: "Blue Bottle", cat: "Dining", price: "$14.00", color: "bg-amber-400" },
                  { name: "Laundry Detergent", store: "Target", cat: "Home", price: "$12.49", color: "bg-violet-400" },
                  { name: "Chicken Breast 2lb", store: "Costco", cat: "Groceries", price: "$9.99", color: "bg-lime-400" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-2 py-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-stone-800 font-medium truncate leading-none">{item.name}</p>
                      <p className="text-[9px] text-stone-400 mt-0.5">{item.store}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-700 tabular-nums">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating receipt snippet below */}
      <div className="absolute -bottom-6 -left-8 z-10 bg-stone-900 text-white rounded-xl shadow-xl p-3.5 text-[10px] border border-stone-700 max-w-[180px]">
        <p className="text-stone-400 uppercase tracking-wider text-[9px] mb-2">Itemized · WALMART</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-stone-300">Chicken Breast</span>
            <span className="text-amber-400 font-medium">$11.98</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-stone-300">Bananas</span>
            <span className="text-amber-400 font-medium">$2.49</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-stone-300">Clorox Wipes</span>
            <span className="text-amber-400 font-medium">$9.98</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── AI Categorization Visual ────────────────────────────────────────────────

function CategorizationVisual() {
  const items = [
    { name: "Organic Whole Milk", cat: "Dairy", color: "bg-lime-400", text: "text-lime-700", bg: "bg-lime-50 border-lime-200" },
    { name: "Chicken Breast 2lb", cat: "Meat & Seafood", color: "bg-rose-400", text: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
    { name: "Printer Paper 500ct", cat: "Office Supplies", color: "bg-sky-400", text: "text-sky-700", bg: "bg-sky-50 border-sky-200" },
    { name: "Clorox Wipes 3pk", cat: "Household", color: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
    { name: "AA Batteries 8pk", cat: "Electronics", color: "bg-violet-400", text: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  ]
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-900/5 p-6 max-w-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-stone-900 text-sm">WALMART #4218</p>
          <p className="text-stone-400 text-xs mt-0.5">Apr 7, 2026 · $52.39</p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
          <Zap className="w-3 h-3 text-amber-500" />
          <span className="text-amber-700 text-xs font-medium">AI Processed</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
              <span className="text-stone-700 text-sm">{item.name}</span>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${item.bg} ${item.text}`}>
              {item.cat}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-stone-100">
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <Check className="w-3.5 h-3.5 text-green-500" />
          Categorized with 96% confidence · 147 categories available
        </div>
      </div>
    </div>
  )
}

// ─── Chat Visual ─────────────────────────────────────────────────────────────

function ChatVisual() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-900/5 p-5 max-w-sm">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-100">
        <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center text-white text-xs font-bold">I</div>
        <span className="font-semibold text-stone-900 text-sm">Itemized Assistant</span>
        <span className="ml-auto flex items-center gap-1 text-xs text-green-600">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Online
        </span>
      </div>

      <div className="space-y-3">
        {/* User message */}
        <div className="flex justify-end">
          <div className="bg-stone-900 text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm max-w-[80%]">
            How much did I spend on coffee this month?
          </div>
        </div>

        {/* AI response */}
        <div className="flex gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-amber-400 flex items-center justify-center text-stone-900 text-xs font-bold shrink-0 mt-1">I</div>
          <div className="bg-stone-50 border border-stone-200 rounded-2xl rounded-bl-md px-4 py-3 text-sm max-w-[85%]">
            <p className="text-stone-700 mb-2">You spent <span className="font-bold text-stone-900">$127.40</span> on coffee in April — here&apos;s the breakdown:</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Blue Bottle Coffee (5×)</span>
                <span className="font-medium text-stone-800">$68.50</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Starbucks (8×)</span>
                <span className="font-medium text-stone-800">$42.80</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Grocery beans (2×)</span>
                <span className="font-medium text-stone-800">$16.10</span>
              </div>
            </div>
            <p className="text-stone-400 text-xs mt-2">That&apos;s 23% above last month. Want me to set a coffee budget?</p>
          </div>
        </div>

        {/* Follow-up user */}
        <div className="flex justify-end">
          <div className="bg-stone-900 text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm max-w-[80%]">
            Yes, set it to $100/month
          </div>
        </div>

        {/* Typing indicator */}
        <div className="flex gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-amber-400 flex items-center justify-center text-stone-900 text-xs font-bold shrink-0 mt-1">I</div>
          <div className="bg-stone-50 border border-stone-200 rounded-2xl rounded-bl-md px-4 py-3">
            <div className="flex gap-1 items-center h-4">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Budget Visual ────────────────────────────────────────────────────────────

function BudgetVisual() {
  const budgets = [
    { name: "Groceries", spent: 412, limit: 450, pct: 92, color: "bg-amber-400", status: "warning" },
    { name: "Dining Out", spent: 298, limit: 200, pct: 100, color: "bg-red-400", status: "over" },
    { name: "Office Supplies", spent: 67, limit: 150, pct: 45, color: "bg-emerald-400", status: "good" },
    { name: "Personal Care", spent: 44, limit: 100, pct: 44, color: "bg-emerald-400", status: "good" },
    { name: "Entertainment", spent: 31, limit: 80, pct: 39, color: "bg-emerald-400", status: "good" },
  ]
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-900/5 p-6 max-w-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-stone-900">April Budgets</p>
          <p className="text-stone-400 text-xs mt-0.5">Item-level tracking</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-400">23 days left</p>
        </div>
      </div>
      <div className="space-y-4">
        {budgets.map((b) => (
          <div key={b.name}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-stone-700">{b.name}</span>
              <span className={`text-xs font-semibold ${
                b.status === "over" ? "text-red-600" : b.status === "warning" ? "text-amber-600" : "text-emerald-600"
              }`}>
                ${b.spent} / ${b.limit}
              </span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  b.status === "over" ? "bg-red-400" : b.status === "warning" ? "bg-amber-400" : "bg-emerald-400"
                }`}
                style={{ width: `${Math.min(b.pct, 100)}%` }}
              />
            </div>
            {b.status === "over" && (
              <p className="text-[10px] text-red-500 mt-1">$98 over budget</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Comparison Visual ───────────────────────────────────────────────────────

function ComparisonVisual() {
  const bankTransactions = [
    { merchant: "WALMART SUPERCENTER", amount: "$52.39" },
    { merchant: "COSTCO WHOLESALE", amount: "$183.47" },
    { merchant: "SHELL OIL 28394", amount: "$74.00" },
    { merchant: "AMZN MKTP US*1K3", amount: "$38.99" },
    { merchant: "WFM AUSTIN TX", amount: "$91.22" },
  ]

  const itemizedRows = [
    { item: "Organic Bananas", cat: "Produce", amount: "$2.49", color: "bg-lime-400" },
    { item: "Chicken Breast 2lb", cat: "Meat", amount: "$11.98", color: "bg-rose-400" },
    { item: "Printer Paper", cat: "Office", amount: "$8.99", color: "bg-sky-400" },
    { item: "Clorox Wipes ×2", cat: "Household", amount: "$9.98", color: "bg-amber-400" },
    { item: "Hot Wheels 5-Pack", cat: "Toys", amount: "$6.49", color: "bg-violet-400" },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Bank view */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-stone-100 px-5 py-3.5 border-b border-stone-200">
          <p className="font-semibold text-stone-600 text-sm">Your bank app</p>
          <p className="text-xs text-stone-400 mt-0.5">Generic transaction list</p>
        </div>
        <div className="divide-y divide-stone-100">
          {bankTransactions.map((t) => (
            <div key={t.merchant} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-700 font-mono tracking-tight">{t.merchant}</p>
                <p className="text-xs text-stone-400 mt-0.5">No item detail</p>
              </div>
              <span className="text-sm font-semibold text-stone-900 tabular-nums">{t.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized view */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden ring-2 ring-amber-100">
        <div className="bg-amber-50 px-5 py-3.5 border-b border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-900 text-sm">Itemized view</p>
              <p className="text-xs text-amber-600 mt-0.5">Every item, categorized</p>
            </div>
            <div className="flex items-center gap-1 bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              <Zap className="w-3 h-3" />
              AI-powered
            </div>
          </div>
        </div>
        <div className="divide-y divide-stone-100">
          {itemizedRows.map((item) => (
            <div key={item.item} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                <div>
                  <p className="text-sm text-stone-800 font-medium">{item.item}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{item.cat}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-stone-900 tabular-nums">{item.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    {
      q: "How does Itemized get my receipt data?",
      a: "Three ways: snap a photo of any receipt, forward email receipts to your personal Itemized address, or connect your retailer accounts (Amazon, Walmart+, Costco) for automatic sync. We also integrate with major bank and credit card accounts to match purchases automatically.",
    },
    {
      q: "Is my financial data safe?",
      a: "Yes. We use 256-bit AES encryption at rest and TLS 1.3 in transit — the same standard as major banks. We never sell your data, never share it with advertisers, and you can delete your account and all data at any time. We're actively pursuing SOC 2 Type II certification.",
    },
    {
      q: "What if a receipt can't be parsed?",
      a: "Our AI handles the vast majority of receipts with 94%+ accuracy. On the rare occasion an item can't be categorized, we flag it for your review. You can quickly assign a category manually, and the AI learns from your corrections to improve over time.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Absolutely. No contracts, no cancellation fees. Cancel from your account settings in 30 seconds. You keep access through the end of your billing period, and you can export all your data before leaving.",
    },
    {
      q: "Do you offer team or business plans?",
      a: "Yes — our Business plan supports multiple users, team expense tracking, policy enforcement, and integrations with QuickBooks and Xero. Contact us for enterprise pricing or request a demo to see the business dashboard.",
    },
    {
      q: "How is Itemized different from Mint or YNAB?",
      a: "Mint and YNAB see the same thing your bank sees: 'Walmart — $52.39.' Itemized is the only app that breaks that charge down into individual items — groceries, office supplies, toys, household goods. Our AI reads the actual receipt, not just the charge amount.",
    },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-stone-200 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-stone-50 transition-colors"
          >
            <span className="font-medium text-stone-900 text-sm pr-4">{faq.q}</span>
            <ChevronDown
              className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="px-6 pb-4">
              <p className="text-stone-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-stone-900" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── 1. Nav ── */}
      <header className="sticky top-0 z-40 bg-[#FAFAF7]/90 backdrop-blur-md border-b border-stone-200/60">
        <nav className="flex items-center justify-between px-6 md:px-10 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center text-white font-bold text-sm group-hover:bg-amber-500 transition-colors duration-200">
              I
            </div>
            <span className="font-bold text-xl tracking-tight">itemized</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {["Product", "For Business", "Pricing", "API"].map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="text-sm text-stone-500 hover:text-stone-900 transition-colors px-3.5 py-2 rounded-lg hover:bg-stone-100"
              >
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors px-4 py-2 hidden sm:block"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-stone-900 text-white px-5 py-2.5 rounded-full hover:bg-stone-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* ── 2. Hero ── */}
      <section className="relative overflow-hidden max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-32 md:pt-28 md:pb-40">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/70 text-amber-700 rounded-full px-3.5 py-1.5 text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Now in beta · Free to start
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-[68px] leading-[0.95] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Your bank hides
              <br />
              the details.
              <br />
              <span className="italic text-amber-600">We reveal them.</span>
            </h1>

            <p className="text-stone-500 text-lg md:text-xl leading-relaxed max-w-lg mb-10">
              Every bank shows &ldquo;Walmart — $52.39.&rdquo; Itemized shows you
              it was $19 in groceries, $17 in office supplies, $10 in household
              goods, and $6 in toys. Item by item, automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white px-7 py-3.5 rounded-full font-medium hover:bg-stone-700 transition-all hover:gap-3 group"
              >
                Start for free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 border border-stone-300 text-stone-700 px-7 py-3.5 rounded-full font-medium hover:bg-stone-100 transition-colors">
                <Play className="w-4 h-4 text-stone-500" />
                Watch demo
              </button>
            </div>

            <p className="text-stone-400 text-xs mt-4">No credit card required &middot; Free plan available</p>
          </div>

          <div className="relative flex justify-center lg:justify-end py-10">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ── 3. Trust Bar ── */}
      <section className="border-y border-stone-200 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          <p className="text-center text-stone-400 text-xs uppercase tracking-[0.2em] mb-8">
            As seen in
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {[
              { name: "FORBES", style: "font-serif font-bold text-xl tracking-tight" },
              { name: "TECHCRUNCH", style: "font-sans font-extrabold text-sm tracking-widest" },
              { name: "WIRED", style: "font-sans font-black text-xl tracking-tight" },
              { name: "PRODUCT HUNT", style: "font-sans font-bold text-sm tracking-wider" },
              { name: "FINTECH WEEKLY", style: "font-serif italic text-base" },
              { name: "FAST COMPANY", style: "font-sans font-black text-sm tracking-widest" },
            ].map((pub) => (
              <span
                key={pub.name}
                className={`${pub.style} text-stone-300 hover:text-stone-400 transition-colors cursor-default select-none`}
              >
                {pub.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Stats ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {[
            { value: "147", label: "Spending categories" },
            { value: "94%", label: "Categorization accuracy" },
            { value: "<3s", label: "To process a receipt" },
            { value: "$0", label: "To get started" },
          ].map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <p
                className="text-4xl md:text-5xl text-stone-900 mb-1"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                {stat.value}
              </p>
              <p className="text-stone-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. The Problem ── */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-4">The problem</p>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Your bank is lying to you
              <br />
              <span className="italic text-amber-400">by omission.</span>
            </h2>
            <p className="text-stone-400 text-lg max-w-xl mx-auto">
              You can&apos;t budget what you can&apos;t see. Here&apos;s the difference.
            </p>
          </div>
          <ComparisonVisual />
        </div>
      </section>

      {/* ── 6. Feature: AI Categorization ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32" id="product">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-600 mb-4">AI Categorization</p>
            <h2
              className="text-4xl md:text-5xl tracking-tight leading-tight mb-6"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              AI that knows
              <br />
              exactly what you bought
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed mb-8">
              Our AI reads every line on every receipt and maps it to one of 147 spending categories.
              A single Costco trip becomes groceries, household supplies, electronics, and clothing —
              automatically, in under 3 seconds.
            </p>
            <div className="space-y-4">
              {[
                { icon: <Zap className="w-4 h-4" />, title: "94% accuracy", desc: "Across 147 categories out of the box" },
                { icon: <BarChart3 className="w-4 h-4" />, title: "Item-level insight", desc: "Not just 'Walmart' — every product on the receipt" },
                { icon: <Target className="w-4 h-4" />, title: "Learns your habits", desc: "Improves with every receipt you confirm" },
              ].map((feat) => (
                <div key={feat.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                    {feat.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">{feat.title}</p>
                    <p className="text-stone-400 text-sm">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <CategorizationVisual />
          </div>
        </div>
      </section>

      {/* ── 7. Feature: AI Chat ── */}
      <section className="bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center order-2 lg:order-1">
              <ChatVisual />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-600 mb-4">AI Assistant</p>
              <h2
                className="text-4xl md:text-5xl tracking-tight leading-tight mb-6"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                Ask anything about
                <br />
                your spending
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-8">
                Itemized&apos;s AI knows every item you&apos;ve ever bought. Ask in plain English — &ldquo;How much
                did I spend on coffee this month?&rdquo; &mdash; and get a real answer backed by actual receipts.
                Not a vague total. Exact numbers, exact items.
              </p>
              <div className="space-y-3">
                {[
                  "\"What did I spend on snacks at gas stations last quarter?\"",
                  "\"Show me everything I bought for the home office this year\"",
                  "\"Am I on track with my grocery budget?\"",
                ].map((q) => (
                  <div key={q} className="flex items-start gap-2.5">
                    <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-stone-500 text-sm italic">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Feature: Smart Budgets ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-600 mb-4">Smart Budgets</p>
            <h2
              className="text-4xl md:text-5xl tracking-tight leading-tight mb-6"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Budgets that track
              <br />
              items, not just stores
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed mb-8">
              Traditional budgets see &ldquo;Target — $120&rdquo; and don&apos;t know where to put it.
              Itemized knows it was $60 in household goods, $35 in clothing, and $25 in snacks —
              and applies each to the right budget automatically.
            </p>
            <div className="space-y-4">
              {[
                { icon: <Target className="w-4 h-4" />, title: "Cross-store budgets", desc: "Track 'Groceries' across Walmart, Costco, and Whole Foods in one budget" },
                { icon: <BarChart3 className="w-4 h-4" />, title: "Early warnings", desc: "Get notified before you're over budget, not after" },
                { icon: <Zap className="w-4 h-4" />, title: "Automatic allocation", desc: "Every receipt item hits the right budget instantly" },
              ].map((feat) => (
                <div key={feat.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                    {feat.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">{feat.title}</p>
                    <p className="text-stone-400 text-sm">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <BudgetVisual />
          </div>
        </div>
      </section>

      {/* ── 9. For Business ── */}
      <section className="bg-stone-900 text-white" id="for-business">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-4">For Business</p>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Know what your team
              <br />
              <span className="italic text-amber-400">is actually buying.</span>
            </h2>
            <p className="text-stone-400 text-lg max-w-xl mx-auto">
              Your field team spent $14,000 at gas stations last quarter. Was it fuel?
              Itemized shows you $4,200 was snacks and energy drinks. Per-employee, per-item clarity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-stone-700/50 rounded-2xl overflow-hidden mb-12">
            {[
              {
                icon: <BarChart3 className="w-5 h-5" />,
                title: "Per-employee tracking",
                desc: "See exactly what each team member is buying, not just aggregate totals by store.",
                accent: "text-amber-400",
              },
              {
                icon: <Target className="w-5 h-5" />,
                title: "Policy enforcement",
                desc: "Flag purchases that violate expense policy at the item level — automatically.",
                accent: "text-lime-400",
              },
              {
                icon: <Building2 className="w-5 h-5" />,
                title: "QuickBooks & Xero sync",
                desc: "Push categorized, item-level data directly to your accounting software.",
                accent: "text-sky-400",
              },
            ].map((feat) => (
              <div key={feat.title} className="bg-stone-900 p-8 md:p-10">
                <div className={`mb-3 ${feat.accent}`}>{feat.icon}</div>
                <h3 className={`font-semibold text-lg mb-3 ${feat.accent}`}>{feat.title}</h3>
                <p className="text-stone-400 leading-relaxed text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Enterprise stat card */}
          <div className="bg-stone-800 rounded-2xl border border-stone-700 p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-3">Real example</p>
              <h3
                className="text-2xl md:text-3xl mb-3"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                $14,000 in &ldquo;gas station&rdquo; charges
              </h3>
              <p className="text-stone-400 leading-relaxed">
                A construction company&apos;s field team. Every charge read &ldquo;SHELL OIL&rdquo; or &ldquo;CIRCLE K&rdquo;.
                Itemized revealed: $9,800 actual fuel, $2,700 food &amp; drinks, $1,500 tobacco products.
              </p>
            </div>
            <div className="shrink-0 space-y-3 min-w-[220px]">
              {[
                { label: "Fuel", amount: "$9,800", pct: 70, color: "bg-emerald-400" },
                { label: "Food & Drinks", amount: "$2,700", pct: 19, color: "bg-amber-400" },
                { label: "Tobacco / Other", amount: "$1,500", pct: 11, color: "bg-red-400" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-300">{row.label}</span>
                    <span className="text-white font-medium">{row.amount}</span>
                  </div>
                  <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden">
                    <div className={`h-full ${row.color} rounded-full`} style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-amber-500 text-stone-900 px-8 py-4 rounded-full font-semibold text-base hover:bg-amber-400 transition-colors"
            >
              Request a demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10. Testimonials ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-4">Testimonials</p>
          <h2
            className="text-4xl md:text-5xl tracking-tight"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            People who actually care
            <br />
            <span className="italic text-amber-600">where their money goes</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote: "I thought I was spending $300/month on groceries. Turns out I was spending $420 — because every Target trip was lumped with household stuff. Itemized fixed that in the first week.",
              name: "Sarah Chen",
              title: "CFO",
              company: "Techstars-backed startup",
              initial: "S",
              color: "bg-amber-400",
            },
            {
              quote: "As a freelancer, tax time used to be painful. Now I have a clean export of every deductible item across the year. My accountant actually complimented me for the first time ever.",
              name: "Marcus Johnson",
              title: "Freelance Designer",
              company: "Self-employed",
              initial: "M",
              color: "bg-sky-400",
            },
            {
              quote: "We run a 12-person field team. Before Itemized, expense reports were a black hole. Now I can see that 22% of our 'fuel' budget is actually snacks and coffee. That's a real number.",
              name: "Rachel Torres",
              title: "Operations Manager",
              company: "Verde Construction",
              initial: "R",
              color: "bg-lime-400",
            },
          ].map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-stone-200 p-7 shadow-sm flex flex-col">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-stone-600 text-sm leading-relaxed flex-1 mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-stone-900 text-sm shrink-0`}>
                  {t.initial}
                </div>
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{t.name}</p>
                  <p className="text-stone-400 text-xs">{t.title} &middot; {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 11. How It Works ── */}
      <section className="bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-4">How it works</p>
            <h2
              className="text-4xl md:text-5xl tracking-tight"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Up and running
              <br />
              in three minutes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>,
                title: "Snap or connect",
                desc: "Photograph a receipt, forward an email receipt, or connect Amazon, Walmart+, or your bank. Itemized pulls in receipts from everywhere you shop.",
                detail: "Works with 200+ retailers",
              },
              {
                num: "02",
                icon: <Zap className="w-6 h-6" />,
                title: "AI breaks it down",
                desc: "Every line item is extracted and categorized in under 3 seconds. Groceries, office supplies, personal care — identified item by item with 94% accuracy.",
                detail: "147 categories, zero effort",
              },
              {
                num: "03",
                icon: <BarChart3 className="w-6 h-6" />,
                title: "See your real spending",
                desc: "Dashboards, item-level budgets, and an AI assistant that knows exactly what you bought. Ask anything. Get exact answers.",
                detail: "Insights that actually matter",
              },
            ].map((step, i) => (
              <div key={step.num} className="relative">
                <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm h-full">
                  <div className="flex items-start justify-between mb-6">
                    <span
                      className="text-5xl text-stone-100 leading-none"
                      style={{ fontFamily: "var(--font-serif), serif" }}
                    >
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl text-stone-900 mb-3">{step.title}</h3>
                  <p className="text-stone-400 leading-relaxed text-sm mb-4">{step.desc}</p>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                    <Check className="w-3.5 h-3.5 text-amber-500" />
                    {step.detail}
                  </div>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10 text-stone-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. Security ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-4">Security & Privacy</p>
          <h2
            className="text-4xl md:text-5xl tracking-tight"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Your data is yours.
            <br />
            <span className="italic text-amber-600">Full stop.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              icon: <Lock className="w-6 h-6" />,
              title: "Bank-level encryption",
              desc: "256-bit AES at rest, TLS 1.3 in transit. The same standard as your bank.",
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "SOC 2 (in progress)",
              desc: "We're actively pursuing SOC 2 Type II certification. Audit underway.",
            },
            {
              icon: <Eye className="w-6 h-6" />,
              title: "We never sell data",
              desc: "No ads. No data brokers. Your spending data is never sold or shared.",
            },
            {
              icon: <Server className="w-6 h-6" />,
              title: "Delete anytime",
              desc: "Export or delete all your data in one click. No hold periods.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm text-center md:text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 mb-4 mx-auto md:mx-0">
                {item.icon}
              </div>
              <h3 className="font-semibold text-stone-900 text-sm mb-2">{item.title}</h3>
              <p className="text-stone-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 13. Pricing ── */}
      <section className="bg-stone-50 border-t border-stone-200" id="pricing">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-4">Pricing</p>
            <h2
              className="text-4xl md:text-5xl tracking-tight mb-4"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Simple, honest pricing
            </h2>
            <p className="text-stone-400 text-lg">No tricks. No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "For anyone curious about their spending.",
                features: [
                  "30 receipts per month",
                  "Basic AI categorization",
                  "Receipt feed & history",
                  "3 spending categories",
                  "Email support",
                ],
                cta: "Get started free",
                accent: false,
                popular: false,
              },
              {
                name: "Plus",
                price: "$8",
                period: "/month",
                description: "For serious personal finance.",
                features: [
                  "Unlimited receipts",
                  "Full AI categorization (147 cats)",
                  "AI chat assistant",
                  "Smart budgets",
                  "Tax-ready exports",
                  "Priority support",
                ],
                cta: "Start free trial",
                accent: true,
                popular: true,
              },
              {
                name: "Pro",
                price: "$15",
                period: "/month",
                description: "For freelancers, side hustlers, and small teams.",
                features: [
                  "Everything in Plus",
                  "IRS Schedule C tagging",
                  "Accountant export (.csv, .pdf)",
                  "Up to 3 team members",
                  "QuickBooks integration",
                  "Priority support + onboarding",
                ],
                cta: "Start free trial",
                accent: false,
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.accent
                    ? "bg-stone-900 text-white ring-2 ring-amber-400"
                    : "bg-white border border-stone-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-400 text-stone-900 text-xs font-bold px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  </div>
                )}
                <p className={`font-semibold text-sm mb-1 ${plan.accent ? "text-stone-300" : "text-stone-500"}`}>
                  {plan.name}
                </p>
                <p style={{ fontFamily: "var(--font-serif), serif" }} className="text-4xl mb-1">
                  {plan.price}
                  <span className={`text-base ${plan.accent ? "text-stone-400" : "text-stone-400"}`} style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                    {plan.period}
                  </span>
                </p>
                <p className={`text-sm mb-6 ${plan.accent ? "text-stone-400" : "text-stone-400"}`}>
                  {plan.description}
                </p>
                <ul className={`space-y-2.5 text-sm mb-8 ${plan.accent ? "text-stone-300" : "text-stone-500"}`}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.accent ? "text-amber-400" : "text-emerald-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-3 rounded-full text-sm font-semibold transition-colors ${
                    plan.accent
                      ? "bg-amber-400 text-stone-900 hover:bg-amber-300"
                      : "bg-stone-900 text-white hover:bg-stone-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Enterprise note */}
          <p className="text-center text-stone-400 text-sm mt-8">
            Need more? <Link href="/signup" className="text-stone-700 underline underline-offset-2 hover:text-stone-900">Contact us</Link> about Business and Enterprise plans.
          </p>
        </div>
      </section>

      {/* ── 14. FAQ ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-4">FAQ</p>
          <h2
            className="text-4xl md:text-5xl tracking-tight mb-4"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Questions, answered
          </h2>
        </div>
        <FAQ />
      </section>

      {/* ── 15. Final CTA ── */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-6">Get started today</p>
          <h2
            className="text-4xl md:text-6xl tracking-tight leading-tight mb-6 max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Finally understand
            where your money
            <span className="italic text-amber-400"> actually goes.</span>
          </h2>
          <p className="text-stone-400 text-lg max-w-lg mx-auto mb-10">
            Start seeing item-level spending data for free. No credit card required.
            Works in under 3 minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-amber-400 text-stone-900 px-10 py-4 rounded-full font-bold text-base hover:bg-amber-300 transition-all hover:gap-3 group"
          >
            Start for free
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="text-stone-600 text-sm mt-4">No credit card &middot; Free plan forever &middot; Cancel anytime</p>
        </div>
      </section>

      {/* ── 16. Footer ── */}
      <footer className="bg-stone-950 text-white border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-stone-700 flex items-center justify-center text-white font-bold text-sm">I</div>
                <span className="font-bold text-lg text-white">itemized</span>
              </Link>
              <p className="text-stone-500 text-sm leading-relaxed">
                Item-level receipt intelligence for individuals and teams.
              </p>
            </div>

            {/* Nav columns */}
            {[
              {
                heading: "Product",
                links: [
                  { label: "Features", href: "#features" },
                  { label: "API", href: "#" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Changelog", href: "#" },
                  { label: "Integrations", href: "#" },
                ],
              },
              {
                heading: "Company",
                links: [
                  { label: "About", href: "#" },
                  { label: "Careers", href: "#" },
                  { label: "Contact", href: "#" },
                  { label: "Blog", href: "#" },
                ],
              },
              {
                heading: "Resources",
                links: [
                  { label: "Documentation", href: "#" },
                  { label: "Guides", href: "#" },
                  { label: "Security", href: "#" },
                  { label: "Status", href: "#" },
                ],
              },
              {
                heading: "Legal",
                links: [
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Cookie Policy", href: "#" },
                ],
              },
            ].map((col) => (
              <div key={col.heading}>
                <p className="text-stone-400 text-xs uppercase tracking-[0.2em] mb-4 font-medium">{col.heading}</p>
                <ul className="space-y-3">
                  {col.links.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-stone-500 text-sm hover:text-white transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-stone-600 text-sm">
              &copy; {new Date().getFullYear()} Itemized, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <Link href="#" className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors">
                <XIcon />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors">
                <LinkedinIcon />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
