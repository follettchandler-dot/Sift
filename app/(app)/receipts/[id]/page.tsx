import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, Receipt } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryBadge } from "@/components/category-badge"
import { ReceiptItemRow } from "@/components/receipt-item-row"
import { Button } from "@/components/ui/button"

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: receipt } = await supabase
    .from("receipts")
    .select(
      `
      *,
      receipt_items(
        *,
        category:categories(id, name, slug, parent_id)
      )
    `
    )
    .eq("id", id)
    .eq("user_id", user!.id)
    .single()

  if (!receipt) {
    notFound()
  }

  type ReceiptItem = {
    id: string
    description: string | null
    quantity: number | null
    unit_price: number | null
    total_price: number | null
    confidence_score: number | null
    category: { id: string; name: string; slug: string; parent_id: string | null } | null
  }

  const items: ReceiptItem[] = receipt.receipt_items ?? []

  // Category breakdown
  const categoryTotals = items.reduce(
    (acc: { name: string; slug: string; total: number }[], item: ReceiptItem) => {
      const catName = item.category?.name ?? "Uncategorized"
      const catSlug = item.category?.slug ?? "other"
      const price = item.total_price ?? 0
      const existing = acc.find((c) => c.name === catName)
      if (existing) {
        existing.total += price
      } else {
        acc.push({ name: catName, slug: catSlug, total: price })
      }
      return acc
    },
    [] as { name: string; slug: string; total: number }[]
  )
  categoryTotals.sort((a, b) => b.total - a.total)

  const grandTotal = receipt.total ?? 0
  const taxAmount = (receipt.metadata as Record<string, number> | null)?.tax_amount ?? null
  const tipAmount = (receipt.metadata as Record<string, number> | null)?.tip_amount ?? null
  const subtotal =
    taxAmount != null || tipAmount != null
      ? grandTotal - (taxAmount ?? 0) - (tipAmount ?? 0)
      : null

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

  const formattedDate = receipt.transaction_date
    ? format(new Date(receipt.transaction_date), "MMMM d, yyyy")
    : "Unknown date"

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Back + header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4 gap-2 text-zinc-400"
          render={<Link href="/receipts" />}
        >
          <ArrowLeft className="size-4" />
          Back to Receipts
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400">
            <Receipt className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {receipt.merchant_name || "Unknown Merchant"}
            </h1>
            <p className="text-sm text-zinc-400">{formattedDate}</p>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      {categoryTotals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {categoryTotals.map((cat) => {
              const pct = grandTotal > 0 ? (cat.total / grandTotal) * 100 : 0
              return (
                <div key={cat.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <CategoryBadge name={cat.name} slug={cat.slug} />
                    <span className="text-zinc-400 tabular-nums">
                      {fmt(cat.total)}{" "}
                      <span className="text-zinc-600 text-xs">
                        ({pct.toFixed(0)}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500/70"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Itemized list */}
      <Card>
        <CardHeader>
          <CardTitle>Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            items.map((item) => (
              <ReceiptItemRow key={item.id} item={item} />
            ))
          ) : (
            <p className="text-sm text-zinc-500 py-4 text-center">
              No line items found
            </p>
          )}
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Totals</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          {subtotal != null && (
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span className="tabular-nums">{fmt(subtotal)}</span>
            </div>
          )}
          {taxAmount != null && (
            <div className="flex justify-between text-zinc-400">
              <span>Tax</span>
              <span className="tabular-nums">{fmt(taxAmount)}</span>
            </div>
          )}
          {tipAmount != null && (
            <div className="flex justify-between text-zinc-400">
              <span>Tip</span>
              <span className="tabular-nums">{fmt(tipAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-base pt-2 border-t border-zinc-800 mt-1">
            <span>Total</span>
            <span className="tabular-nums">{fmt(grandTotal)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
