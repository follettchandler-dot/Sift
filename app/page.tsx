import Link from "next/link"
import {
  Receipt,
  Brain,
  MessageSquare,
  BarChart3,
  Wallet,
  Shield,
} from "lucide-react"

const FEATURES = [
  {
    icon: Receipt,
    title: "Itemized Receipts",
    description:
      "Every line item captured and stored — not just the total. See exactly what you bought, down to the unit price.",
  },
  {
    icon: Brain,
    title: "AI Categorization",
    description:
      "Items are automatically tagged to smart categories. Groceries, household, personal care — sorted without lifting a finger.",
  },
  {
    icon: MessageSquare,
    title: "Ask Anything",
    description:
      'Chat with your spending data. "How much did I spend on protein last month?" Get a real answer instantly.',
  },
  {
    icon: BarChart3,
    title: "Spending Dashboard",
    description:
      "Visual breakdowns by category, merchant, and month. Know your patterns at a glance.",
  },
  {
    icon: Wallet,
    title: "Smart Budgets",
    description:
      "Set category budgets and get alerted before you overspend. Stay on track without micromanaging.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data is yours. No selling, no sharing. Encrypted at rest and in transit.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-sm">
            S
          </div>
          <span className="font-semibold text-lg tracking-tight">Sift</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors px-4 py-2 text-sm font-medium text-white"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-32 max-w-4xl mx-auto">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
          AI-powered receipt intelligence
        </div>
        <h1 className="text-5xl font-bold tracking-tight leading-tight sm:text-6xl mb-6">
          Know exactly where{" "}
          <span className="text-emerald-400">every dollar goes</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Sift turns your receipts into insight. Scan a Walmart receipt and
          instantly see $42 in groceries, $18 in household supplies, and $12 in
          snacks — not just &ldquo;$72 at Walmart.&rdquo;
        </p>
        <Link
          href="/signup"
          className="rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors px-8 py-3 text-base font-semibold text-white"
        >
          Start for free — no credit card
        </Link>
      </section>

      {/* Features */}
      <section className="px-6 pb-32 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col gap-4"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <feature.icon className="size-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32 max-w-2xl mx-auto text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Stop guessing.{" "}
          <span className="text-emerald-400">Start sifting.</span>
        </h2>
        <p className="text-zinc-400 mb-8">
          Join thousands of people who actually know where their money goes.
        </p>
        <Link
          href="/signup"
          className="inline-block rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors px-8 py-3 text-base font-semibold text-white"
        >
          Create your free account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded bg-emerald-500 text-white font-bold text-xs">
              S
            </div>
            <span>Sift</span>
          </div>
          <span>&copy; {new Date().getFullYear()} Sift. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
