"use client"

import { useEffect, useState } from "react"
import { Plus, Wallet } from "lucide-react"
import { BudgetCard } from "@/components/budget-card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Budget, Category } from "@/lib/types"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<(Budget & { spent: number })[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [categoryId, setCategoryId] = useState("")
  const [amountLimit, setAmountLimit] = useState("")
  const [period, setPeriod] = useState<"monthly" | "weekly">("monthly")
  const [alertPct, setAlertPct] = useState("80")

  useEffect(() => {
    fetchBudgets()
    fetchCategories()
  }, [])

  async function fetchBudgets() {
    setLoading(true)
    const res = await fetch("/api/budgets")
    if (res.ok) {
      const data = await res.json()
      setBudgets(data.budgets ?? [])
    }
    setLoading(false)
  }

  async function fetchCategories() {
    const res = await fetch("/api/categories")
    if (res.ok) {
      const data = await res.json()
      // Only show top-level (level 0 or 1) categories for budgets
      setCategories((data.categories ?? []).filter((c: Category) => c.level <= 1))
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!categoryId || !amountLimit) return
    setSaving(true)
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category_id: categoryId,
        amount_limit: parseFloat(amountLimit),
        period,
        alert_threshold_pct: parseInt(alertPct, 10),
      }),
    })
    if (res.ok) {
      setDialogOpen(false)
      setCategoryId("")
      setAmountLimit("")
      setPeriod("monthly")
      setAlertPct("80")
      await fetchBudgets()
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/budgets?id=${id}`, { method: "DELETE" })
    if (res.ok) {
      setBudgets((prev) => prev.filter((b) => b.id !== id))
    }
  }

  const totalBudgeted = budgets.reduce((s, b) => s + b.amount_limit, 0)
  const totalSpent = budgets.reduce((s, b) => s + (b.spent ?? 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
          <p className="text-sm text-zinc-400 mt-1">Track spending against your limits</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2">
                <Plus className="size-4" />
                Add Budget
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Budget</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="amount">Amount Limit ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="500"
                  value={amountLimit}
                  onChange={(e) => setAmountLimit(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="period">Period</Label>
                <Select value={period} onValueChange={(v) => setPeriod(v as "monthly" | "weekly")}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="alert">Alert Threshold (%)</Label>
                <Input
                  id="alert"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="80"
                  value={alertPct}
                  onChange={(e) => setAlertPct(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={saving || !categoryId || !amountLimit}>
                  {saving ? "Saving…" : "Create Budget"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      {budgets.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex gap-8">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Total Budgeted</p>
            <p className="text-xl font-bold tabular-nums">{formatCurrency(totalBudgeted)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Total Spent</p>
            <p className="text-xl font-bold tabular-nums text-emerald-400">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Remaining</p>
            <p className="text-xl font-bold tabular-nums">
              {formatCurrency(Math.max(0, totalBudgeted - totalSpent))}
            </p>
          </div>
        </div>
      )}

      {/* Budget grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-zinc-900 animate-pulse" />
          ))}
        </div>
      ) : budgets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard
                key={budget.id}
                budget={{ ...budget, category: budget.category ?? null }}
                onDelete={handleDelete}
              />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-zinc-900 text-zinc-600">
            <Wallet className="size-8" />
          </div>
          <div>
            <p className="font-medium text-zinc-300">No budgets yet</p>
            <p className="text-sm text-zinc-500 mt-1">
              Set spending limits to track your categories
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="size-4" />
            Add Your First Budget
          </Button>
        </div>
      )}
    </div>
  )
}
