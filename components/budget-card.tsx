import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
} from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface BudgetCardProps {
  budget: {
    id: string
    amount_limit: number
    period: "weekly" | "monthly"
    alert_threshold_pct: number
    spent: number
    category: {
      id: string
      name: string
      slug: string
    } | null
  }
  onDelete?: (id: string) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function BudgetCard({ budget, onDelete }: BudgetCardProps) {
  const pct = budget.amount_limit > 0 ? (budget.spent / budget.amount_limit) * 100 : 0
  const cappedPct = Math.min(pct, 100)
  const isOver = pct >= 100
  const isWarning = !isOver && pct >= budget.alert_threshold_pct
  const remaining = Math.max(0, budget.amount_limit - budget.spent)

  const indicatorColor = isOver
    ? "bg-red-500"
    : isWarning
    ? "bg-amber-500"
    : "bg-emerald-500"

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-2 pb-2">
        <div className="min-w-0">
          <p className="font-medium truncate">{budget.category?.name ?? "Unknown"}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-xs capitalize text-zinc-400 border-zinc-700">
            {budget.period}
          </Badge>
          {onDelete && (
            <button
              onClick={() => onDelete(budget.id)}
              className="text-zinc-600 hover:text-red-400 transition-colors text-xs"
              aria-label="Delete budget"
            >
              ✕
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={cappedPct}>
          <ProgressTrack>
            <ProgressIndicator className={cn("transition-all", indicatorColor)} />
          </ProgressTrack>
        </Progress>
        <div className="flex items-center justify-between text-sm">
          <span className={cn("font-medium tabular-nums", isOver ? "text-red-400" : isWarning ? "text-amber-400" : "text-zinc-300")}>
            {formatCurrency(budget.spent)}
            <span className="text-zinc-500 font-normal"> / {formatCurrency(budget.amount_limit)}</span>
          </span>
          <span className="text-zinc-500 tabular-nums text-xs">
            {isOver ? (
              <span className="text-red-400">Over by {formatCurrency(budget.spent - budget.amount_limit)}</span>
            ) : (
              <>{formatCurrency(remaining)} left</>
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
