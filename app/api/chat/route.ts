import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { streamText, type UIMessage } from "ai"
import { google } from "@ai-sdk/google"
import { startOfMonth, startOfWeek } from "date-fns"

// Convert UI messages (parts format) to model messages (content format)
function toModelMessages(uiMessages: UIMessage[]) {
  return uiMessages.map((m) => ({
    role: m.role as "user" | "assistant",
    content:
      m.parts
        ?.filter((p) => p.type === "text")
        .map((p) => (p as { type: "text"; text: string }).text)
        .join("") ?? "",
  }))
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
  const rawMessages = body.messages ?? body.uiMessages ?? []
  const messages = rawMessages[0]?.parts ? toModelMessages(rawMessages) : rawMessages

  // Fetch last 100 receipts with items + categories
  const { data: receipts } = await supabase
    .from("receipts")
    .select(
      `
      id,
      merchant_name,
      total,
      transaction_date,
      receipt_items(
        description,
        total_price,
        category:categories(name, slug)
      )
    `
    )
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })
    .limit(100)

  // Fetch active budgets
  const { data: budgets } = await supabase
    .from("budgets")
    .select(
      `
      id,
      amount_limit,
      period,
      alert_threshold_pct,
      category:categories(name, slug)
    `
    )
    .eq("user_id", user.id)
    .eq("is_active", true)

  // Build spending context string
  const now = new Date()
  const monthStart = startOfMonth(now)
  const weekStart = startOfWeek(now)

  const receiptSummary =
    receipts
      ?.map((r) => {
        const date = r.transaction_date ?? "unknown date"
        const total = r.total != null ? `$${r.total.toFixed(2)}` : "unknown total"
        const items = r.receipt_items
          ?.map((i) => {
            const cat = (Array.isArray(i.category) ? i.category[0]?.name : (i.category as { name: string } | null)?.name) ?? "uncategorized"
            const price = i.total_price != null ? `$${i.total_price.toFixed(2)}` : ""
            return `    - ${i.description ?? "item"} (${cat})${price ? ` ${price}` : ""}`
          })
          .join("\n")
        return `- ${r.merchant_name ?? "Unknown"} on ${date}: ${total}\n${items ?? ""}`
      })
      .join("\n") ?? "No receipts found."

  const budgetSummary =
    budgets
      ?.map((b) => {
        const cat = (Array.isArray(b.category) ? b.category[0]?.name : (b.category as unknown as { name: string } | null)?.name) ?? "Unknown"
        return `- ${cat}: $${b.amount_limit}/month (alert at ${b.alert_threshold_pct}%)`
      })
      .join("\n") ?? "No budgets set."

  const systemPrompt = `You are Sift, an AI spending assistant. You help users understand their spending, find patterns, and make smarter financial decisions.

Today's date: ${now.toISOString().split("T")[0]}
Current month start: ${monthStart.toISOString().split("T")[0]}
Current week start: ${weekStart.toISOString().split("T")[0]}

USER'S RECENT RECEIPTS (last 100):
${receiptSummary}

USER'S BUDGETS:
${budgetSummary}

Be concise, specific, and helpful. Reference actual data from the receipts when answering. Format currency as USD. If the user asks about spending in a specific category or time period, calculate from the receipt data above.`

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages,
  })

  return result.toUIMessageStreamResponse()
}
