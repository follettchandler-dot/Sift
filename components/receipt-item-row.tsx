import { AlertTriangle } from "lucide-react"
import { CategoryBadge } from "@/components/category-badge"

interface ReceiptItemRowProps {
  item: {
    id: string
    description: string | null
    quantity: number | null
    unit_price: number | null
    total_price: number | null
    confidence_score: number | null
    category: {
      id: string
      name: string
      slug: string
    } | null
  }
}

export function ReceiptItemRow({ item }: ReceiptItemRowProps) {
  const lowConfidence =
    item.confidence_score != null && item.confidence_score < 0.7

  const formattedTotal =
    item.total_price != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(item.total_price)
      : "—"

  const qty = item.quantity ?? 1
  const showQty = qty !== 1 && item.unit_price != null

  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-zinc-800 last:border-0">
      <div className="flex items-start gap-3 min-w-0">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {item.description || "Unknown item"}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {item.category && (
              <CategoryBadge
                name={item.category.name}
                slug={item.category.slug}
              />
            )}
            {lowConfidence && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-500">
                <AlertTriangle className="size-3" />
                Low confidence
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-medium tabular-nums">{formattedTotal}</p>
        {showQty && (
          <p className="text-xs text-zinc-500 mt-0.5">
            {qty} ×{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(item.unit_price!)}
          </p>
        )}
      </div>
    </div>
  )
}
