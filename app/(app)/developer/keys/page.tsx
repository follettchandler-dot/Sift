"use client"

import { useEffect, useState } from "react"
import { Key, Plus, Copy, Trash2, Eye, EyeOff, CheckCheck } from "lucide-react"

interface ApiKey {
  id: string
  name: string
  key_prefix: string
  environment: "test" | "live"
  last_used_at: string | null
  created_at: string
  plain_key?: string // only present immediately after creation
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyEnv, setNewKeyEnv] = useState<"test" | "live">("test")
  const [creating, setCreating] = useState(false)
  const [justCreated, setJustCreated] = useState<ApiKey | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [hasConsumer, setHasConsumer] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const [consumerRes, keysRes] = await Promise.all([
      fetch("/api/developer/consumer"),
      fetch("/api/developer/keys"),
    ])
    const consumerData = await consumerRes.json()
    const keysData = await keysRes.json()
    setHasConsumer(!!consumerData.consumer)
    setKeys(keysData.keys || [])
    setLoading(false)
  }

  async function createKey(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    const res = await fetch("/api/developer/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName, environment: newKeyEnv }),
    })
    const data = await res.json()
    if (data.key) {
      setJustCreated(data.key)
      setKeys((prev) => [data.key, ...prev])
      setShowModal(false)
      setNewKeyName("")
      setNewKeyEnv("test")
    }
    setCreating(false)
  }

  async function revokeKey(id: string) {
    if (!confirm("Revoke this key? This cannot be undone.")) return
    setRevokingId(id)
    await fetch(`/api/developer/keys?id=${id}`, { method: "DELETE" })
    setKeys((prev) => prev.filter((k) => k.id !== id))
    if (justCreated?.id === id) setJustCreated(null)
    setRevokingId(null)
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!hasConsumer) {
    return (
      <div className="max-w-lg text-center py-16">
        <Key className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-semibold text-lg mb-2">No developer profile</h2>
        <p className="text-muted-foreground text-sm mb-4">Set up your developer profile first to create API keys.</p>
        <a href="/developer" className="text-emerald-500 text-sm hover:underline">Go to Developer dashboard →</a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">API Keys</h1>
          <p className="text-muted-foreground text-sm">Manage your API keys. Keys are shown only once at creation.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-500 text-black font-medium px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          New key
        </button>
      </div>

      {/* Newly created key banner */}
      {justCreated && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="font-semibold text-sm text-emerald-400 mb-0.5">Key created — save it now</p>
              <p className="text-xs text-muted-foreground">This is the only time you&rsquo;ll see the full key.</p>
            </div>
            <button onClick={() => setJustCreated(null)} className="text-muted-foreground hover:text-foreground text-xs">dismiss</button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <code className="flex-1 text-xs font-mono bg-background border border-border px-3 py-2 rounded-lg text-emerald-300 overflow-x-auto">
              {justCreated.plain_key}
            </code>
            <button
              onClick={() => copyToClipboard(justCreated.plain_key!, "new")}
              className="shrink-0 p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
            >
              {copiedId === "new" ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Keys list */}
      {keys.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Key className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium mb-1">No API keys yet</p>
          <p className="text-sm text-muted-foreground">Create your first key to start using the API.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          {keys.map((key) => (
            <div key={key.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{key.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    key.environment === "live"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-zinc-700 text-zinc-400"
                  }`}>
                    {key.environment}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <code className="font-mono">{key.key_prefix}••••••••••••••••••••••••••••••••</code>
                  <span>·</span>
                  <span>Created {formatDate(key.created_at)}</span>
                  {key.last_used_at && (
                    <>
                      <span>·</span>
                      <span>Last used {formatDate(key.last_used_at)}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(key.key_prefix + "...", key.id)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  title="Copy prefix"
                >
                  {copiedId === key.id ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => revokeKey(key.id)}
                  disabled={revokingId === key.id}
                  className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400"
                  title="Revoke key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="font-semibold text-lg mb-1">Create API key</h2>
            <p className="text-muted-foreground text-sm mb-5">Give it a name so you remember what it&rsquo;s for.</p>
            <form onSubmit={createKey} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Key name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Production, My App, Testing..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Environment</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["test", "live"] as const).map((env) => (
                    <button
                      key={env}
                      type="button"
                      onClick={() => setNewKeyEnv(env)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                        newKeyEnv === env
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : "border-border text-muted-foreground hover:border-zinc-500"
                      }`}
                    >
                      {env.charAt(0).toUpperCase() + env.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-emerald-500 text-black font-medium py-2 rounded-lg hover:bg-emerald-400 transition-colors text-sm disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create key"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
