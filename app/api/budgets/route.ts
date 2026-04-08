import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { startOfMonth, startOfWeek } from "date-fns"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: budgets, error } = await supabase
    .from("budgets")
    .select(
      `
      *,
      category:categories(id, name, slug)
    `
    )
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }

  const now = new Date()
  const monthStart = startOfMonth(now).toISOString()
  const weekStart = startOfWeek(now).toISOString()

  // Calculate spent amount for each budget
  const budgetsWithSpent = await Promise.all(
    (budgets ?? []).map(async (budget) => {
      const periodStart = budget.period === "weekly" ? weekStart : monthStart

      const { data: items } = await supabase
        .from("receipt_items")
        .select("total_price, receipt:receipts!inner(user_id, transaction_date)")
        .eq("category_id", budget.category_id)
        .eq("receipt.user_id", user.id)
        .gte("receipt.transaction_date", periodStart)

      const spent = items?.reduce((sum, item) => sum + (item.total_price ?? 0), 0) ?? 0

      return { ...budget, spent }
    })
  )

  return NextResponse.json({ budgets: budgetsWithSpent })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { category_id, amount_limit, period, alert_threshold_pct } = body

  if (!category_id || !amount_limit || !period) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const { data: budget, error } = await supabase
    .from("budgets")
    .insert({
      user_id: user.id,
      category_id,
      amount_limit: parseFloat(amount_limit),
      period,
      alert_threshold_pct: alert_threshold_pct ?? 80,
      is_active: true,
    })
    .select(`*, category:categories(id, name, slug)`)
    .single()

  if (error) {
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 })
  }

  return NextResponse.json({ budget }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing budget id" }, { status: 400 })
  }

  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
