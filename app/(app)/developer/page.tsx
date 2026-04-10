"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Code, Key, ExternalLink, Plus, TrendingUp, Zap } from "lucide-react"

interface ApiConsumer {
  id: string
  name: string
  company_name: string | null
  email: string
  website: string | null
  use_case: string | null
  plan: string
  status: string
  created_at: string
}

interface CreateForm {
  name: string
  company_name: string
  website: string
  use_case: string
}

export default function DeveloperPage() {
  const [consumer, setConsumer] = useState<ApiConsumer | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreateForm>({
    name: "",
    company_name: "",
    website: "",
    use_case: "",
  })
  const [keyCount, setKeyCount] = useState(0)

  useEffect(() => {
    async function load() {
      const [consumerRes, keysRes] = await Promise.all([
        fetch("/api/developer/consumer"),
        fetch("/api/developer/keys"),
      ])
      const consumerData = await consumerRes.json()
      const keysData = await keysRes.json()
      setConsumer(consumerData.consumer)
      setKeyCount((keysData.keys || []).length)
      setLoading(false)
    }
    load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    const res = await fetch("/api/developer/consumer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.consumer) {
      setConsumer(data.consumer)
      setShowForm(false)
    }
    setCreating(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!consumer && !showForm) {
    return (
      <div className="max-w-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Developer API</h1>
          <p className="text-muted-foreground">
            Add item-level purchase data to your product. Sift&rsquo;s API lets you parse receipts and categorize line items with AI.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <Code className="w-6 h-6 text-emerald-500" />
          </div>
          <h2 className="font-semibold text-lg mb-2">Set up your developer profile</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Create a profile to get your API keys and start integrating Sift.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-emerald-500 text-black font-medium px-6 py-2.5 rounded-lg hover:bg-emerald-400 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Get API access
          </button>
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold mb-2">Get API access</h1>
        <p className="text-muted-foreground text-sm mb-8">Tell us a bit about how you plan to use the Sift API.</p>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Your name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Company name</label>
            <input
              type="text"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Acme Inc."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="https://yourapp.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">What are you building?</label>
            <textarea
              value={form.use_case}
              onChange={(e) => setForm({ ...form, use_case: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Personal finance app, expense tracker, tax software..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 bg-emerald-500 text-black font-medium px-6 py-2.5 rounded-lg hover:bg-emerald-400 transition-colors text-sm disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create profile"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Developer API</h1>
        <p className="text-muted-foreground text-sm">
          Integrate item-level receipt data into your product.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Plan", value: consumer!.plan.charAt(0).toUpperCase() + consumer!.plan.slice(1), icon: TrendingUp },
          { label: "API Keys", value: String(keyCount), icon: Key },
          { label: "Status", value: consumer!.status.charAt(0).toUpperCase() + consumer!.status.slice(1), icon: Zap },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <stat.icon className="w-3.5 h-3.5" />
              {stat.label}
            </div>
            <p className="font-semibold text-lg">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Consumer info */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">Profile</h2>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span>{consumer!.name}</span>
          </div>
          {consumer!.company_name && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Company</span>
              <span>{consumer!.company_name}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{consumer!.email}</span>
          </div>
          {consumer!.website && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Website</span>
              <a href={consumer!.website} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline flex items-center gap-1">
                {consumer!.website.replace(/^https?:\/\//, "")}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/developer/keys"
          className="rounded-xl border border-border bg-card p-5 hover:border-emerald-500/50 transition-colors group"
        >
          <Key className="w-5 h-5 text-emerald-500 mb-3" />
          <p className="font-medium text-sm mb-1">Manage API keys</p>
          <p className="text-xs text-muted-foreground">Create, view, and revoke keys</p>
        </Link>
        <Link
          href="/docs"
          target="_blank"
          className="rounded-xl border border-border bg-card p-5 hover:border-emerald-500/50 transition-colors group"
        >
          <Code className="w-5 h-5 text-emerald-500 mb-3" />
          <p className="font-medium text-sm mb-1">API documentation</p>
          <p className="text-xs text-muted-foreground">Endpoints, examples, SDKs</p>
        </Link>
      </div>

      {/* Base URL */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold mb-3 text-sm">Base URL</h2>
        <code className="text-xs bg-muted px-3 py-2 rounded-lg block font-mono text-emerald-400">
          https://usesift.com/api/v1
        </code>
        <p className="text-xs text-muted-foreground mt-2">
          All requests require <code className="font-mono bg-muted px-1 rounded">Authorization: Bearer sk_test_xxx</code>
        </p>
      </div>
    </div>
  )
}
