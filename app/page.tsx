import Link from "next/link"
import { ArrowRight } from "lucide-react"

function ReceiptDemo() {
  const items = [
    { name: "Organic Bananas", qty: "1 bunch", price: 2.49, cat: "Produce", color: "bg-lime-400" },
    { name: "Chicken Breast 2lb", qty: "1", price: 11.98, cat: "Meat", color: "bg-rose-400" },
    { name: "Printer Paper 500ct", qty: "1", price: 8.99, cat: "Office", color: "bg-sky-400" },
    { name: "Clorox Wipes", qty: "2", price: 9.98, cat: "Household", color: "bg-amber-400" },
    { name: "Hot Wheels 5-Pack", qty: "1", price: 6.49, cat: "Toys", color: "bg-violet-400" },
    { name: "Greek Yogurt", qty: "3", price: 4.47, cat: "Dairy", color: "bg-lime-400" },
    { name: "AA Batteries 8pk", qty: "1", price: 7.99, cat: "Office", color: "bg-sky-400" },
  ]

  const categories = [
    { name: "Groceries", amount: 18.94, pct: 36, color: "bg-lime-400" },
    { name: "Office", amount: 16.98, pct: 32, color: "bg-sky-400" },
    { name: "Household", amount: 9.98, pct: 19, color: "bg-amber-400" },
    { name: "Toys", amount: 6.49, pct: 13, color: "bg-violet-400" },
  ]

  return (
    <div className="relative">
      {/* The receipt */}
      <div className="bg-white rounded-2xl shadow-2xl shadow-stone-900/10 border border-stone-200/60 p-6 max-w-sm mx-auto rotate-[-1deg] relative z-10">
        <div className="text-center border-b border-dashed border-stone-300 pb-4 mb-4">
          <p className="font-[var(--font-outfit)] font-bold text-stone-900 text-lg">WALMART</p>
          <p className="text-stone-400 text-xs mt-1">Supercenter #4218 &middot; Apr 7, 2026</p>
        </div>
        <div className="space-y-2.5">
          {items.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                <span className="text-stone-700 truncate">{item.name}</span>
              </div>
              <span className="text-stone-900 font-medium tabular-nums ml-3">${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-stone-300 mt-4 pt-3 flex justify-between font-bold text-stone-900">
          <span>Total</span>
          <span className="tabular-nums">$52.39</span>
        </div>
      </div>

      {/* The breakdown card */}
      <div className="bg-stone-900 text-white rounded-2xl shadow-2xl p-5 max-w-[260px] absolute -right-4 -bottom-6 rotate-[2deg] z-20 border border-stone-700">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-3">Itemized Breakdown</p>
        <div className="flex gap-0.5 h-3 rounded-full overflow-hidden mb-4">
          {categories.map((c) => (
            <div key={c.name} className={`${c.color} opacity-90`} style={{ width: `${c.pct}%` }} />
          ))}
        </div>
        <div className="space-y-2">
          {categories.map((c) => (
            <div key={c.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${c.color}`} />
                <span className="text-stone-300">{c.name}</span>
              </div>
              <span className="text-white font-medium tabular-nums">${c.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-[var(--font-serif)] text-4xl md:text-5xl text-stone-900">{value}</p>
      <p className="text-stone-500 text-sm mt-1">{label}</p>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-stone-900 font-[var(--font-outfit)] selection:bg-amber-200">
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Nav */}
      <nav className="relative z-40 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center text-white font-bold text-sm tracking-tight group-hover:bg-amber-500 transition-colors duration-300">
            I
          </div>
          <span className="font-bold text-xl tracking-tight">itemized</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-stone-500 hover:text-stone-900 transition-colors px-4 py-2"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-stone-900 text-white px-5 py-2.5 rounded-full hover:bg-stone-800 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-32">
        <div className="grid md:grid-cols-2 gap-16 md:gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/60 text-amber-700 rounded-full px-3.5 py-1 text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Now in beta
            </div>
            <h1 className="font-[var(--font-serif)] text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
              Your bank shows
              <br />
              charges.
              <br />
              <span className="italic text-amber-600">We show items.</span>
            </h1>
            <p className="text-stone-500 text-lg md:text-xl leading-relaxed max-w-lg mb-10">
              Every bank app says &ldquo;Walmart &mdash; $52.39.&rdquo;
              Itemized tells you it was $19 in groceries, $17 in office supplies,
              $10 in household goods, and $6 in toys.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white px-7 py-3.5 rounded-full font-medium hover:bg-stone-800 transition-all hover:gap-3 group"
              >
                Start free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <span className="text-stone-400 text-sm self-center">No credit card required</span>
            </div>
          </div>

          <div className="relative flex justify-center md:justify-end py-8">
            <ReceiptDemo />
          </div>
        </div>
      </section>

      {/* Divider stat strip */}
      <section className="relative z-10 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          <Stat value="147" label="categories tracked" />
          <Stat value="$0" label="to start" />
          <Stat value="<3s" label="to scan a receipt" />
          <Stat value="94%" label="categorization accuracy" />
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-28">
        <div className="max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-4">How it works</p>
          <h2 className="font-[var(--font-serif)] text-4xl md:text-5xl tracking-tight leading-tight">
            Three steps to total<br />spending clarity
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-0 md:gap-0">
          {[
            {
              num: "01",
              title: "Snap or connect",
              desc: "Photograph a receipt, connect your email, or link retailer accounts. Itemized ingests receipts from everywhere.",
            },
            {
              num: "02",
              title: "AI breaks it down",
              desc: "Every line item is extracted and categorized automatically. Groceries, office supplies, personal care \u2014 item by item.",
            },
            {
              num: "03",
              title: "See your real spending",
              desc: "Dashboards, budgets, and an AI assistant that actually knows what you bought. Ask it anything.",
            },
          ].map((step, i) => (
            <div
              key={step.num}
              className={`p-8 md:p-10 ${i < 2 ? "border-b md:border-b-0 md:border-r" : ""} border-stone-200`}
            >
              <span className="font-[var(--font-serif)] text-6xl text-stone-200">{step.num}</span>
              <h3 className="font-semibold text-xl mt-4 mb-3">{step.title}</h3>
              <p className="text-stone-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features — editorial style */}
      <section className="relative z-10 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-28">
          <div className="max-w-2xl mb-20">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-4">Features</p>
            <h2 className="font-[var(--font-serif)] text-4xl md:text-5xl tracking-tight leading-tight">
              Built for people who
              <br />
              <span className="text-amber-400 italic">actually care</span> where
              <br />
              their money goes
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-stone-700/50 rounded-2xl overflow-hidden">
            {[
              {
                title: "AI chat that knows your receipts",
                desc: "Ask \u201Chow much did I spend on coffee this month?\u201D and get an exact number with the receipts to back it up. Not a guess \u2014 real data.",
                accent: "text-amber-400",
              },
              {
                title: "Item-level categorization",
                desc: "One Walmart trip becomes 4 budget categories. Gas station purchases split into fuel vs. snacks. Every item tagged with 94% accuracy.",
                accent: "text-lime-400",
              },
              {
                title: "Budgets that actually work",
                desc: "Set a grocery budget and track it at the item level, not the store level. Know you\u2019re over on snacks before you\u2019re over on food.",
                accent: "text-sky-400",
              },
              {
                title: "Tax-ready categorization",
                desc: "Every item auto-tagged to IRS Schedule C categories. Come tax season, export a clean spreadsheet of deductions. Your accountant will love you.",
                accent: "text-rose-400",
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-stone-900 p-8 md:p-12">
                <h3 className={`font-semibold text-xl mb-3 ${feature.accent}`}>{feature.title}</h3>
                <p className="text-stone-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise teaser */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-28">
        <div className="bg-stone-100 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-4">For businesses</p>
            <h2 className="font-[var(--font-serif)] text-3xl md:text-4xl tracking-tight leading-tight mb-4">
              Know what your team<br />is actually buying
            </h2>
            <p className="text-stone-500 leading-relaxed max-w-lg">
              Your field team spent $14,000 at gas stations last quarter. Was it fuel? Itemized shows you $4,200 was snacks and energy drinks. Per-employee, per-item expense intelligence.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-stone-900 text-white px-7 py-3.5 rounded-full font-medium hover:bg-stone-800 transition-all"
            >
              Request enterprise access
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="relative z-10 border-t border-stone-200 max-w-7xl mx-auto px-6 md:px-12 py-28">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-4">Pricing</p>
          <h2 className="font-[var(--font-serif)] text-4xl md:text-5xl tracking-tight">Simple, honest pricing</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              name: "Free",
              price: "$0",
              period: "forever",
              features: ["30 receipts/month", "Basic categories", "Receipt feed"],
              cta: "Get started",
              accent: false,
            },
            {
              name: "Plus",
              price: "$8",
              period: "/month",
              features: ["Unlimited receipts", "AI chat assistant", "Smart budgets", "Priority categorization"],
              cta: "Start free trial",
              accent: true,
            },
            {
              name: "Pro",
              price: "$15",
              period: "/month",
              features: ["Everything in Plus", "Tax categorization", "Export to accountant", "Priority support"],
              cta: "Start free trial",
              accent: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.accent
                  ? "bg-stone-900 text-white ring-2 ring-amber-400 ring-offset-2 ring-offset-[#FAFAF7]"
                  : "bg-white border border-stone-200"
              }`}
            >
              <p className="font-medium text-sm mb-1">{plan.name}</p>
              <p className="font-[var(--font-serif)] text-4xl mb-1">
                {plan.price}
                <span className={`text-base font-[var(--font-outfit)] ${plan.accent ? "text-stone-400" : "text-stone-400"}`}>{plan.period}</span>
              </p>
              <ul className={`mt-6 space-y-2.5 text-sm ${plan.accent ? "text-stone-300" : "text-stone-500"}`}>
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className={`mt-1 w-1 h-1 rounded-full shrink-0 ${plan.accent ? "bg-amber-400" : "bg-stone-400"}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block text-center mt-8 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  plan.accent
                    ? "bg-amber-400 text-stone-900 hover:bg-amber-300"
                    : "bg-stone-100 text-stone-900 hover:bg-stone-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-28">
        <div className="text-center">
          <h2 className="font-[var(--font-serif)] text-4xl md:text-5xl tracking-tight mb-4">
            Your bank hides the details.
            <br />
            <span className="italic text-amber-600">Itemized reveals them.</span>
          </h2>
          <p className="text-stone-500 text-lg max-w-lg mx-auto mb-8">
            Start seeing where your money actually goes, item by item.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-stone-800 transition-all hover:gap-3 group"
          >
            Start for free
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-200 px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center text-white font-bold text-xs">I</div>
            <span className="font-medium text-stone-600">itemized</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Itemized. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
