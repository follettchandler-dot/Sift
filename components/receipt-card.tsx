import Link from "next/link"
import { Receipt, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { CategoryBadge } from "@/components/category-badge"

interface ReceiptItem {
  id: string
  description: string | null
  total_price: number | null
  category: {
    id: string
    name: string
    slug: string
  } | null
}

interface ReceiptCardProps {
  receipt: {
    id: string
    merchant_name: string | null
    total: number | null
    transaction_date: string | null
    receipt_items: ReceiptItem[]
  }
}

export function ReceiptCard({ receipt }: ReceiptCardProps) {
  const itemCount = receipt.receipt_items.length

  // Collect unique categories from items (top 3)
  const uniqueCategories = receipt.receipt_items
    .reduce(
      (acc, item) => {
        if (item.category && !acc.find((c) => c.id === item.category!.id)) {
          acc.push(item.category)
        }
        return acc
      },
      [] as { id: string; name: string; slug: string }[]
    )
    .slice(0, 3)

  const formattedDate = receipt.transaction_date
    ? format(new Date(receipt.transaction_date), "MMM d, yyyy")
    : "Unknown date"

  const formattedTotal =
    receipt.total != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(receipt.total)
      : "—"

  return (
    <Link href={`/receipts/${receipt.id}`} className="block group">
      <Card className="transition-colors hover:ring-zinc-700">
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
              <Receipt className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate">
                {receipt.merchant_name || "Unknown Merchant"}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-semibold tabular-nums">{formattedTotal}</span>
            <ChevronRight className="size-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {uniqueCategories.map((cat) => (
            <CategoryBadge key={cat.id} name={cat.name} slug={cat.slug} />
          ))}
          <span className="text-xs text-zinc-600 ml-auto">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}
