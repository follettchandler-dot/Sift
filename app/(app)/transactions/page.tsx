"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Circle, ArrowRightLeft, Camera } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CategoryBadge } from "@/components/category-badge"

type ReceiptItem = {
  id: string
  description: string | null
  total_price: number | null
  category: { name: string; slug: string } | null
}

type Receipt = {
  id: string
  merchant_name: string | null
  total: number | null
  receipt_items: ReceiptItem[]
}

type Transaction = {
  id: string
  merchant_name: string | null
  merchant_logo_url: string | null
  amount: number | null
  iso_currency_code: string | null
  date: string | null
  pending: boolean
  payment_channel: string | null
  category_primary: string | null
  category_detailed: string | null
  receipt_id: string | null
  receipt: Receipt | null
}

type Filter = "all" | "matched" | "untracked"

function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value)
}

function formatShortDate(dateStr: string) {
  return format(new Date(dateStr), "MMM d, yyyy")
}

function formatChannel(channel: string | null) {
  if (!channel) return null
  return channel
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ")
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>("all")
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch("/api/transactions?limit=200")
      .then((r) => r.json())
      .then((data) => {
        setTransactions(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = transactions.filter((tx) => {
    if (filter === "matched") return !!tx.receipt_id
    if (filter === "untracked") return !tx.receipt_id
    return true
  })

  const totalAmount = filtered.reduce((sum, tx) => sum + Math.abs(Number(tx.amount ?? 0)), 0)
  const matchedCount = transactions.filter((t) => t.receipt_id).length
  const untrackedCount = transactions.filter((t) => !t.receipt_id).length

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-serif">Transactions</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {transactions.length} transactions &middot;{" "}
          {matchedCount} itemized &middot;{" "}
          {untrackedCount} untracked
        </p>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2">
        {(["all", "matched", "untracked"] as Filter[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f === "matched" ? "Itemized" : f === "untracked" ? "Untracked" : "All"}
            {f === "all" && (
              <span className="ml-1.5 text-xs opacity-70">{transactions.length}</span>
            )}
            {f === "matched" && (
              <span className="ml-1.5 text-xs opacity-70">{matchedCount}</span>
            )}
            {f === "untracked" && (
              <span className="ml-1.5 text-xs opacity-70">{untrackedCount}</span>
            )}
          </Button>
        ))}
      </div>

      {/* Summary */}
      {filtered.length > 0 && (
        <p className="text-sm text-zinc-500">
          {filtered.length} transactions &middot; {formatCurrency(totalAmount)} total
        </p>
      )}

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-48 rounded bg-zinc-800" />
                <div className="h-3 w-24 rounded bg-zinc-800 mt-1" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-zinc-900 text-zinc-600">
            <ArrowRightLeft className="size-7" />
          </div>
          <div>
            <p className="font-medium text-zinc-300">No transactions found</p>
            <p className="text-sm text-zinc-500 mt-1">
              {filter !== "all" ? "Try switching the filter above" : "Connect a bank account to sync transactions"}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((tx) => {
            const isMatched = !!tx.receipt_id
            const isExpanded = expanded.has(tx.id)
            const amount = Math.abs(Number(tx.amount ?? 0))
            const logoLetter = (tx.merchant_name ?? "?")[0].toUpperCase()
            const categories = tx.receipt
              ? tx.receipt.receipt_items
                  .reduce((acc: { name: string; slug: string }[], item) => {
                    if (item.category && !acc.find((c) => c.slug === item.category!.slug)) {
                      acc.push(item.category)
                    }
                    return acc
                  }, [])
                  .slice(0, 3)
              : []

            return (
              <Card
                key={tx.id}
                className={`transition-colors ${isMatched && tx.receipt ? "cursor-pointer hover:ring-zinc-700" : ""}`}
                onClick={isMatched && tx.receipt ? () => toggleExpand(tx.id) : undefined}
              >
                <CardHeader className="flex-row items-start justify-between gap-4 pb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {tx.merchant_logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tx.merchant_logo_url}
                        alt={tx.merchant_name ?? ""}
                        className="size-9 rounded-lg object-contain bg-white p-1 shrink-0"
                      />
                    ) : (
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 font-semibold text-sm">
                        {logoLetter}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {tx.merchant_name || "Unknown Merchant"}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {tx.date ? formatShortDate(tx.date) : "—"}
                        {tx.payment_channel && (
                          <span className="ml-1.5">&middot; {formatChannel(tx.payment_channel)}</span>
                        )}
                        {tx.pending && (
                          <span className="ml-1.5 text-amber-400">Pending</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold tabular-nums">
                      {formatCurrency(amount, tx.iso_currency_code ?? "USD")}
                    </span>
                    {isMatched ? (
                      <Badge className="gap-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">
                        <CheckCircle className="size-3" />
                        Itemized
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-zinc-400 border-zinc-700">
                        <Circle className="size-3" />
                        Untracked
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {isMatched && categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {categories.map((cat) => (
                        <CategoryBadge key={cat.slug} name={cat.name} slug={cat.slug} />
                      ))}
                    </div>
                  )}

                  {!isMatched && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500 italic">No itemized data</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1.5 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.location.href = "/scan"
                        }}
                      >
                        <Camera className="size-3" />
                        Scan receipt
                      </Button>
                    </div>
                  )}

                  {isMatched && tx.receipt && isExpanded && (
                    <div className="mt-2 border-t border-zinc-800 pt-3">
                      <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">
                        Items
                      </p>
                      <div className="flex flex-col gap-1">
                        {tx.receipt.receipt_items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="text-zinc-300 truncate mr-2">
                              {item.description || "Item"}
                            </span>
                            <span className="tabular-nums text-zinc-400 shrink-0">
                              {item.total_price != null
                                ? formatCurrency(item.total_price)
                                : "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
