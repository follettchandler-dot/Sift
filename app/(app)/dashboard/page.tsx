import { DollarSign, Receipt, ShoppingCart } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ReceiptCard } from "@/components/receipt-card"
import { SpendingDonut, SpendingBarChart } from "@/components/spending-chart"
import { startOfMonth, subMonths, format } from "date-fns"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const now = new Date()
  const monthStart = startOfMonth(now).toISOString()

  // Current month receipts with items + categories
  const { data: receipts } = await supabase
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
    .eq("user_id", user!.id)
    .gte("transaction_date", monthStart)
    .order("transaction_date", { ascending: false })

  // Stats
  const totalSpent = receipts?.reduce((sum, r) => sum + (r.total ?? 0), 0) ?? 0
  const receiptCount = receipts?.length ?? 0
  const itemCount = receipts?.reduce((sum, r) => sum + (r.receipt_items?.length ?? 0), 0) ?? 0

  // Category totals from items
  const categoryMap = new Map<string, { name: string; amount: number }>()
  for (const receipt of receipts ?? []) {
    for (const item of receipt.receipt_items ?? []) {
      if (!item.category) continue
      const key = item.category.id
      const existing = categoryMap.get(key)
      const itemTotal = item.total_price ?? 0
      if (existing) {
        existing.amount += itemTotal
      } else {
        categoryMap.set(key, { name: item.category.name, amount: itemTotal })
      }
    }
  }

  const categoryTotals = Array.from(categoryMap.values())
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 12)

  const categoryTotal = categoryTotals.reduce((s, c) => s + c.amount, 0)
  const categoryData = categoryTotals.map((c) => ({
    ...c,
    percentage: categoryTotal > 0 ? (c.amount / categoryTotal) * 100 : 0,
  }))

  // Last 6 months trend
  const trendData = await Promise.all(
    Array.from({ length: 6 }, async (_, i) => {
      const monthDate = subMonths(now, 5 - i)
      const from = startOfMonth(monthDate).toISOString()
      const to = startOfMonth(subMonths(monthDate, -1)).toISOString()
      const { data } = await supabase
        .from("receipts")
        .select("total")
        .eq("user_id", user!.id)
        .gte("transaction_date", from)
        .lt("transaction_date", to)
      const amount = data?.reduce((s, r) => s + (r.total ?? 0), 0) ?? 0
      return { month: format(monthDate, "MMM"), amount }
    })
  )

  // Recent receipts (last 5)
  const recentReceipts = receipts?.slice(0, 5) ?? []

  const stats = [
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Receipts",
      value: receiptCount.toString(),
      icon: Receipt,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Items Tracked",
      value: itemCount.toString(),
      icon: ShoppingCart,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {format(now, "MMMM yyyy")} spending overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex-row items-center justify-between gap-4 pb-2">
              <p className="text-sm text-zinc-400">{stat.label}</p>
              <div className={`flex size-8 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <p className="font-medium">Category Breakdown</p>
            <p className="text-xs text-zinc-500">This month by category</p>
          </CardHeader>
          <CardContent>
            <SpendingDonut data={categoryData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="font-medium">Spending Trend</p>
            <p className="text-xs text-zinc-500">Last 6 months</p>
          </CardHeader>
          <CardContent>
            <SpendingBarChart data={trendData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Receipts */}
      <div>
        <h2 className="mb-3 font-semibold">Recent Receipts</h2>
        {recentReceipts.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentReceipts.map((receipt) => (
              <ReceiptCard key={receipt.id} receipt={receipt} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-zinc-900 text-zinc-600">
              <Receipt className="size-7" />
            </div>
            <div>
              <p className="font-medium text-zinc-300">No receipts this month</p>
              <p className="text-sm text-zinc-500 mt-1">Scan a receipt to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
